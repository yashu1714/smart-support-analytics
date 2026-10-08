from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import engine, Base, SessionLocal
import models

from ml_model import (
    predict_category_with_confidence
)

from classifier import (
    predict_priority,
    predict_sentiment
)


Base.metadata.create_all(
    bind=engine
)


app = FastAPI()


app.add_middleware(
    CORSMiddleware,

   allow_origins=[
    "http://localhost:5174",
    "http://localhost:5173",
    "https://smart-support-analytics-4tol.vercel.app"
],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)

class TicketCreate(BaseModel):

    customer_name: str

    message: str

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


@app.get("/")
def home():

    return {
        "message":
        "Smart Support Analytics is running!"
    }

@app.post("/tickets")
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):

    category_result = (
        predict_category_with_confidence(
            ticket.message
        )
    )

    predicted_category = (
        category_result["category"]
    )

    category_confidence = (
        category_result["confidence"]
    )

    predicted_priority = (
        predict_priority(
            ticket.message
        )
    )

    predicted_sentiment = (
        predict_sentiment(
            ticket.message
        )
    )

    new_ticket = models.Ticket(

        customer_name=
        ticket.customer_name,

        message=
        ticket.message,

        category=
        predicted_category,

        priority=
        predicted_priority,

        sentiment=
        predicted_sentiment

    )

    db.add(
        new_ticket
    )

    db.commit()

    db.refresh(
        new_ticket
    )

    return {

        "id":
        new_ticket.id,

        "customer_name":
        new_ticket.customer_name,

        "message":
        new_ticket.message,

        "category":
        new_ticket.category,

        "category_confidence":
        category_confidence,

        "priority":
        new_ticket.priority,

        "sentiment":
        new_ticket.sentiment,

        "status":
        new_ticket.status

    }

@app.get("/tickets")
def get_tickets(
    db: Session = Depends(get_db)
):

    tickets = (
        db.query(
            models.Ticket
        ).all()
    )

    return tickets

@app.get("/tickets/{ticket_id}")
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(
            models.Ticket
        )
        .filter(
            models.Ticket.id ==
            ticket_id
        )
        .first()
    )


    if ticket is None:

        return {
            "message":
            "Ticket not found"
        }


    return ticket

@app.get("/analytics/summary")
def get_analytics_summary(
    db: Session = Depends(get_db)
):

    total_tickets = (
        db.query(
            models.Ticket
        ).count()
    )


    open_tickets = (
        db.query(
            models.Ticket
        )
        .filter(
            models.Ticket.status ==
            "Open"
        )
        .count()
    )


    high_priority = (
        db.query(
            models.Ticket
        )
        .filter(
            models.Ticket.priority ==
            "High"
        )
        .count()
    )


    payment_tickets = (
        db.query(
            models.Ticket
        )
        .filter(
            models.Ticket.category ==
            "Payment"
        )
        .count()
    )


    negative_sentiment = (
        db.query(
            models.Ticket
        )
        .filter(
            models.Ticket.sentiment ==
            "Negative"
        )
        .count()
    )


    return {

        "total_tickets":
        total_tickets,

        "open_tickets":
        open_tickets,

        "high_priority_tickets":
        high_priority,

        "payment_tickets":
        payment_tickets,

        "negative_sentiment_tickets":
        negative_sentiment

    }

@app.get("/analytics/categories")
def get_category_analytics(
    db: Session = Depends(get_db)
):

    results = (
        db.query(
            models.Ticket.category,
            func.count(
                models.Ticket.id
            )
        )
        .group_by(
            models.Ticket.category
        )
        .all()
    )


    return {

        category: count

        for category, count
        in results

    }

@app.get("/analytics/priority")
def get_priority_analytics(
    db: Session = Depends(get_db)
):

    results = (
        db.query(
            models.Ticket.priority,
            func.count(
                models.Ticket.id
            )
        )
        .group_by(
            models.Ticket.priority
        )
        .all()
    )


    return {

        priority: count

        for priority, count
        in results

    }

@app.get("/analytics/sentiment")
def get_sentiment_analytics(
    db: Session = Depends(get_db)
):

    results = (
        db.query(
            models.Ticket.sentiment,
            func.count(
                models.Ticket.id
            )
        )
        .group_by(
            models.Ticket.sentiment
        )
        .all()
    )


    return {

        sentiment: count

        for sentiment, count
        in results

    }
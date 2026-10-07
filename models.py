from sqlalchemy import Column, Integer, String
from database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    message = Column(String)
    category = Column(String, default="General")
    priority = Column(String, default="Low")
    sentiment = Column(String, default="Neutral")
    status = Column(String, default="Open")
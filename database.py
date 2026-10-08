import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

if os.getenv("VERCEL"):
    DATABASE_URL = "sqlite:////tmp/support.db"
else:
    DATABASE_URL = "sqlite:///./support.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    }
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
Base = declarative_base()
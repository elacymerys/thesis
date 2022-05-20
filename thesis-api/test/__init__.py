from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from api import app
from database import get_db
from database.models import Base

TEST_SQLALCHEMY_DATABASE_URL = 'sqlite://'  # in-memory database for tests
test_engine = create_engine(TEST_SQLALCHEMY_DATABASE_URL)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def get_test_db():
    db = TestSessionLocal()
    db.execute("PRAGMA foreign_keys=ON")
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = get_test_db

Base.metadata.create_all(test_engine)

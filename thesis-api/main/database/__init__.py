from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


USER = 'thesis_admin'
PASS = 'sp8Z6vj9FHZt'
HOST = 'localhost'
PORT = 5432
NAME = 'thesis'


SQLALCHEMY_DATABASE_URL = f'postgresql://{USER}:{PASS}@{HOST}:{PORT}/{NAME}'

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

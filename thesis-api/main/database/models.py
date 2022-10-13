from sqlalchemy import Column, Integer, String, ForeignKey, Float, BigInteger, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base


Base = declarative_base()


class CategoryModel(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, unique=True, nullable=False)
    search_word = Column(String, unique=True, nullable=False)
    no_of_records = Column(Integer, unique=False, nullable=False)

    terms = relationship('TermModel')

    
class TermModel(Base):
    __tablename__ = 'terms'

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    initial_difficulty = Column(Float, nullable=False)
    correct_answers_counter = Column(BigInteger, nullable=False, default=0)
    total_answers_counter = Column(BigInteger, nullable=False, default=0)
    difficulty = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)

    category = relationship('CategoryModel', back_populates='terms')

    __table_args__ = (
        UniqueConstraint('name', 'category_id'),
    )

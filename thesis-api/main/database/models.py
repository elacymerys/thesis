from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, declarative_base


Base = declarative_base()


class CategoryModel(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, unique=True, nullable=False)
    search_word = Column(String, unique=True, nullable=False)

    terms = relationship('TermModel')

    
class TermModel(Base):
    __tablename__ = 'terms'

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, unique=True, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)

    category = relationship('CategoryModel', back_populates='terms')

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

db = create_engine("postgresql://ysiwegbxzjkyhn:c46507a3f46524c6a9ade84babb21af934c7ab82bd9ec9d419f6fa9682659d8f@ec2-52-31-219-113.eu-west-1.compute.amazonaws.com:5432/d8u49b2vibt7pu",echo=True)

conn = db.connect()

Base = declarative_base()

dbsession = Session(db)
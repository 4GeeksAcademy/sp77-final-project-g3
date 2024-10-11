from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    first_name = db.Column(db.String(), unique=False, nullable=True)
    last_name = db.Column(db.String(), unique=False, nullable=True)
    phone_number = db.Column(db.String(), unique=False, nullable=True)
    country = db.Column(db.String(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.id} - {self.email}>'

    def serialize(self):
        return {'id': self.id,
                'email': self.email,
                'first_name': self.first_name,
                'last_name': self.last_name,
                'phone_number': self.phone_number,
                'country': self.country}


class Sources(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    type = db.Column(db.String(80), unique=False, nullable=False)
    amount = db.Column(db.Float(), unique=False, nullable=False)

    def __repr__(self):
        return f'<Source {self.id} - {self.name}>'

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'type': self.type,
                'amount': self.amount}
    

class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(), unique=False, nullable=False)
    name = db.Column(db.String(), unique=False, nullable=False)
    description = db.Column(db.String(), unique=False, nullable=True)

    def __repr__(self):
        return f'<Category {self.id} - {self.type} - {self.name}>'

    def serialize(self):
        return {'id': self.id,
                'type': self.type,
                'name': self.name,
                'description': self.description}


class Transactions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float(), unique=False, nullable=False)
    description = db.Column(db.String(), unique=False, nullable=True)
    date = db.Column(db.DateTime(), nullable=False, default=datetime.now(tz=timezone.utc))

    def __repr__(self):
        return f'<Transaction {self.id} - {self.amount}>'

    def serialize(self):
        return {'id': self.id,
                'amount': self.amount,
                'description': self.description,
                'date': self.date}


class FixedExpenses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    expected_amount = db.Column(db.Float(), unique=False, nullable=False)
    real_amount = db.Column(db.Float(), unique=False, nullable=False)
    period = db.Column(db.String(), unique=False, nullable=False)
    next_date = db.Column(db.DateTime(), nullable=False)

    def __repr__(self):
        return f'<Fixed Expenses {self.id} - {self.expected_amount}>'

    def serialize(self):
        return {'id': self.id,
                'expected_amount': self.expected_amount,
                'real_amount': self.real_amount,
                'period': self.period,
                'next_date': self.next_date}

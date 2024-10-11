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

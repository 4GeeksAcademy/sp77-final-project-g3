from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    first_name = db.Column(db.String(80), unique=False, nullable=True)
    last_name = db.Column(db.String(80), unique=False, nullable=True)
    phone_number = db.Column(db.String(), unique=False, nullable=True)
    country = db.Column(db.String(), unique=False, nullable=False)
    photo_url = db.Column(db.String(), unique=False, nullable=True)

    def __repr__(self):
        return f'<User {self.id} - {self.email}>'

    def serialize(self):
        return {'id': self.id,
                'email': self.email,
                'first_name': self.first_name,
                'last_name': self.last_name,
                'phone_number': self.phone_number,
                'country': self.country,
                'photo_url': self.photo_url}


class Institutions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    code = db.Column(db.String(80), unique=True, nullable=False)
    consent = db.Column(db.String(80), unique=True, nullable=True)

    def _repr_(self):
        return f'<Institution {self.name}>'
    
    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'code': self.code,
                'consent': self.consent}


class Sources(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    type_source = db.Column(db.Enum("bank_account", "manual_entry", "credit_card", "debit_card", "others", name="type_source"), nullable=False)
    amount = db.Column(db.Float(), unique=False, nullable=False, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('source_to', lazy='select'))

    def __repr__(self):
        return f'<Source {self.name} - {self.type_source}>'

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'type_source': self.type_source,
                'amount': self.amount,
                'user_id': self.user_id}
    

class Balances(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    total_balance = db.Column(db.Float(), unique=False, nullable=False)
    monthly_expenses = db.Column(db.Float(), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('balance_to', lazy='select'))

    def __repr__(self):
        return f'<Total Balance {self.total_balance} - Monthly Expenses {self.monthly_expenses}>'

    def serialize(self):
        return {'id': self.id,
                'total_balance': self.total_balance,
                'monthly_expenses': self.monthly_expenses,
                'user_id': self.user_id}
    

class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type_category = db.Column(db.Enum("income", "expense", name="type_category"), nullable=False)
    name = db.Column(db.String(), unique=False, nullable=False)
    description = db.Column(db.String(), unique=False, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('category_to', lazy='select'))

    def __repr__(self):
        return f'<Category {self.name} - {self.type_category}>'

    def serialize(self):
        return {'id': self.id,
                'type': self.type_category,
                'name': self.name,
                'description': self.description,
                'user_id': self.user_id}


class Transactions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float(), unique=False, nullable=False)
    description = db.Column(db.String(), unique=False, nullable=True)
    date = db.Column(db.DateTime(), nullable=False, default=datetime.now(tz=timezone.utc))
    source_id = db.Column(db.Integer, db.ForeignKey('sources.id'))
    source_to = db.relationship('Sources', foreign_keys=[source_id], backref=db.backref('transaction_to', lazy='select'))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    category_to = db.relationship('Categories', foreign_keys=[category_id], backref=db.backref('transaction_to', lazy='select'))

    def __repr__(self):
        return f'<Transaction {self.amount} - {self.date}>'

    def serialize(self):
        return {'id': self.id,
                'amount': self.amount,
                'description': self.description,
                'date': self.date,
                'source_id': self.source_id,
                'category_id': self.category_id}


class FixedExpenses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(), unique=False, nullable=False)
    expected_amount = db.Column(db.Float(), unique=False, nullable=False)
    real_amount = db.Column(db.Float(), unique=False, nullable=False)
    period = db.Column(db.String(), unique=False, nullable=False)
    next_date = db.Column(db.DateTime(), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    category_to = db.relationship('Categories', foreign_keys=[category_id], backref=db.backref('fixed_expense_to', lazy='select'))
    is_active_next_period = db.Column(db.Boolean(), unique=False, nullable=False, default=True)

    def __repr__(self):
        return f'<Fixed Expenses {self.real_amount} - {self.period}>'

    def serialize(self):
        return {'id': self.id,
                'expected_amount': self.expected_amount,
                'real_amount': self.real_amount,
                'period': self.period,
                'next_date': self.next_date,
                'category_id': self.category_id,
                'is_active_next_period': self.is_active_next_period,
                'description': self.description}
    

class Budgets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    budget_amount = db.Column(db.Float(), unique=False, nullable=False)
    target_period = db.Column(db.DateTime(), nullable=False)
    total_expense = db.Column(db.Float(), unique=False, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    category_to = db.relationship('Categories', foreign_keys=[category_id], backref=db.backref('budget_to', lazy='select'))

    def __repr__(self):
        return f'<Budget {self.budget_amount} - {self.target_period}>'

    def serialize(self):
        return {'id': self.id,
                'budget_amount': self.budget_amount,
                'target_period': self.target_period,
                'total_expense': self.total_expense,
                'category_id': self.category_id}

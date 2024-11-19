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
    photo_url = db.Column(db.String(), unique=False, nullable=True)
    yapily_username = db.Column(db.String(), unique=True, nullable=True)
    yapily_id = db.Column(db.String(), unique=True, nullable=True)
    reset_token = db.Column(db.String(64), nullable=True)
    token_expiration = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<User {self.id} - {self.email}>'

    def serialize(self):
        return {'id': self.id,
                'email': self.email,
                'first_name': self.first_name,
                'last_name': self.last_name,
                'phone_number': self.phone_number,
                'photo_url': self.photo_url,
                'yapily_username': self.yapily_username,
                'yapily_id': self.yapily_id,
                'reset_token': self.reset_token,
                'token_expiration': self.token_expiration}


class Institutions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    yapily_id = db.Column(db.String(), unique=True, nullable=False)
    name = db.Column(db.String(120), unique=True, nullable=False)
    icon = db.Column(db.String(), unique=True, nullable=True)

    def __repr__(self):
        return f'<Institution {self.name} - {self.yapily_id}>'
    
    def serialize(self):
        return {'id': self.id,
                'yapily_id': self.yapily_id,
                'name': self.name,
                'icon': self.icon}


class Connections(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    consent_token = db.Column(db.String(600), unique=True, nullable=True)
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id'))
    institution_to = db.relationship('Institutions', foreign_keys=[institution_id], backref=db.backref('connection_to', lazy='select'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('connection_to', lazy='select'))

    def __repr__(self):
        return f'<Connected to Institution {self.institution_id}>'
    
    def serialize(self):
        return {'id': self.id,
                'consent_token': self.consent_token,
                'institution_id': self.institution_id,
                'user_id': self.user_id}


class Sources(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    yapily_id = db.Column(db.String(), unique=False, nullable=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    type_source = db.Column(db.Enum("bank_account", "manual_entry", "credit_card", "debit_card", "others", name="type_source"), nullable=False)
    amount = db.Column(db.Float(), unique=False, nullable=False, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('source_to', lazy='select'))
    connection_id = db.Column(db.Integer, db.ForeignKey('connections.id'))
    connection_to = db.relationship('Connections', foreign_keys=[connection_id], backref=db.backref('source_to', lazy='select'))

    def __repr__(self):
        return f'<Source {self.name} - {self.type_source}>'

    def serialize(self):
        return {'id': self.id,
                'yapily_id': self.yapily_id,
                'name': self.name,
                'type_source': self.type_source,
                'amount': self.amount,
                'user_id': self.user_id,
                'connection_id': self.connection_id}
    

class Balances(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    total_balance = db.Column(db.Float(), unique=False, nullable=False)
    monthly_expenses = db.Column(db.Float(), unique=False, nullable=False)
    monthly_income = db.Column(db.Float(), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('balance_to', lazy='select'))

    def __repr__(self):
        return f'<Total Balance {self.total_balance} - Monthly Expenses {self.monthly_expenses}>'

    def serialize(self):
        return {'id': self.id,
                'total_balance': self.total_balance,
                'monthly_expenses': self.monthly_expenses,
                'monthly_income': self.monthly_income,
                'user_id': self.user_id}
    

class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=False, nullable=False)
    description = db.Column(db.String(), unique=False, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('category_to', lazy='select'))

    def __repr__(self):
        return f'<Category {self.name} - {self.description}>'

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'description': self.description,
                'user_id': self.user_id}


class Transactions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    yapily_id = db.Column(db.String(), unique=False, nullable=True)
    amount = db.Column(db.Float(), unique=False, nullable=False)
    name = db.Column(db.String(), unique=False, nullable=True)
    type = db.Column(db.Enum("income", "expense", name="type"), nullable=False)
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
                'yapily_id': self.yapily_id,
                'amount': self.amount,
                'name': self.name,
                'type': self.type,
                'description': self.description,
                'date': self.date,
                'source_id': self.source_id,
                'category_id': self.category_id,
                'source': self.source_to.serialize() if self.source_to else None, # esto me permite acceso a los datos de source
                'category': self.category_to.serialize() if self.category_to else None} 

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
                'category_id': self.category_id,
                'category_name': self.category_to.name if self.category_to else None}

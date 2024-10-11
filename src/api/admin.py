import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, Users, Sources, Balances, Categories, Transactions, FixedExpenses, Budgets


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'darkly'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    admin.add_view(ModelView(Users, db.session))  # You can duplicate that line to add mew models
    admin.add_view(ModelView(Sources, db.session))
    admin.add_view(ModelView(Balances, db.session))
    admin.add_view(ModelView(Categories, db.session))
    admin.add_view(ModelView(Transactions, db.session))
    admin.add_view(ModelView(FixedExpenses, db.session))
    admin.add_view(ModelView(Budgets, db.session))
    # admin.add_view(ModelView(YourModelName, db.session))
    
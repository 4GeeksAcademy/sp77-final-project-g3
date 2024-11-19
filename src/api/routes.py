"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Institutions, Connections, Sources, Balances, Categories, Transactions, FixedExpenses, Budgets
from datetime import datetime, timezone, timedelta
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from dotenv import load_dotenv
import os
import requests
import cloudinary
import cloudinary.uploader
import secrets
import smtplib
from email.mime.text import MIMEText


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API
load_dotenv()


yapily_uuid = os.getenv('YAPILY_UUID')
yapily_secret = os.getenv('YAPILY_SECRET')


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body["message"]= "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


@api.route('/signup', methods=['POST'])
def signup():
    response_body = {}
    data = request.json
    new_user = Users(email = data.get('email'),
                     password = data.get('password'),
                     first_name = data.get('first_name'),
                     last_name = data.get('last_name'),
                     phone_number = data.get('phone_number'))
    db.session.add(new_user)
    db.session.commit()
    response_body['message'] = "Registration succeeded!"
    response_body['results'] = new_user.serialize()
    return response_body, 200


@api.route('/login', methods=['POST'])
def login():
    response_body = {}
    data = request.json
    email = data.get('email', None)
    password = data.get('password', None)
    user = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password)).scalar()
    if not user:
        response_body['message'] = "The email or password is incorrect"
        return response_body, 401
    access_token = create_access_token(identity={'email': user.email, 'user_id': user.id})
    response_body['message'] = f'Welcome, {email}'
    response_body['access_token'] = access_token
    response_body['results'] = user.serialize()
    return response_body, 200


@api.route('/profile', methods=['PUT'])
@jwt_required()
def profile():
    response_body = {}
    current_user = get_jwt_identity()
    row = db.session.execute(db.select(Users).where(Users.id == current_user['user_id'])).scalar()
    data = request.json
    row.email = data.get('email')
    row.first_name = data.get('first_name')
    row.last_name = data.get('last_name')
    row.phone_number = data.get('phone_number')
    row.country = data.get('country')
    row.photo_url = data.get('photo_url')
    db.session.commit()
    response_body['message'] = "Profile updated!"
    response_body['results'] = row.serialize()
    return response_body, 200


@api.route('/remove-account', methods=['DELETE'])
@jwt_required()
def remove_account():
    response_body = {}
    current_user = get_jwt_identity()
    account = db.session.execute(db.select(Users).where(Users.id == current_user['user_id'])).scalar()
    db.session.delete(account)
    db.session.commit()
    response_body['message'] = "Your account was successfully removed!"
    response_body['results'] = {}
    return response_body, 200


@api.route('/institutions', methods=['GET'])
def institutions():
    response_body = {}
    url = 'https://api.yapily.com/institutions'
    response = requests.get(url, auth=(yapily_uuid, yapily_secret))
    if response.status_code != 200:
        response_body['message'] = "Something went wrong"
        response_body['results'] = response.json()
        return response_body, 400
    institutions_list = response.json()
    data = institutions_list.get('data')
    for institution_data in data:
        saved_institution = db.session.execute(db.select(Institutions).where(Institutions.yapily_id == institution_data.get('id'))).scalar_one_or_none()
        if not saved_institution:
            icon = None
            for media_item in institution_data.get('media'):
                if isinstance(media_item, dict) and media_item.get('type') == "icon":
                    icon = media_item.get('source')
                    break
            new_institution = Institutions(name=institution_data.get('name'),
                                           yapily_id=institution_data.get('id'),
                                           icon=icon)
            db.session.add(new_institution)
    db.session.commit()
    rows = db.session.execute(db.select(Institutions)).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = "These are the available institutions!"
    response_body['results'] = result
    return response_body, 200


@api.route('/connections', methods=['GET'])
@jwt_required()
def connections():
    response_body = {}
    current_user = get_jwt_identity()
    rows = db.session.execute(db.select(Connections).where(Connections.user_id == current_user['user_id'])).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = "These are your connections (GET)"
    response_body['results'] = result
    return response_body, 200


@api.route('/connections/<int:id>', methods=['DELETE'])
@jwt_required()
def connection(id):
    response_body = {}
    current_user = get_jwt_identity()
    row = db.session.execute(db.select(Connections).where(Connections.user_id == current_user['user_id'], Connections.id == id)).scalar()
    db.session.execute(db.delete(Transactions).where(Transactions.source_id.in_(db.session.execute(db.select(Sources.id).where(Sources.connection_id == id)).scalars())))
    db.session.execute(db.delete(Sources).where(Sources.connection_id == id))
    db.session.delete(row)
    db.session.commit()
    response_body['message'] = "The connection was deleted (DELETE)"
    response_body['results'] = {}
    return response_body, 200


@api.route('/create-yapily-user', methods=['POST'])
@jwt_required()
def create_yapily_user():
    response_body = {}
    current_user = get_jwt_identity()
    user = Users.query.filter_by(id=current_user['user_id']).first()
    email_start = user.email.split('@')[0]
    url = "https://api.yapily.com/users"
    payload = {
        "applicationUserId": f"ExpenseVue{user.id}{email_start}"
    }
    headers = {
        "Content-Type": "application/json;charset=UTF-8"
    }
    response = requests.post(url, json=payload, headers=headers, auth=(yapily_uuid, yapily_secret))
    if response.status_code != 201:
        response_body['message'] = "Something went wrong"
        response_body['results'] = response.json()
        return response_body, 400
    data = response.json()
    user.yapily_username = data.get('applicationUserId')
    user.yapily_id = data.get('uuid')
    db.session.commit()
    response_body['message'] = "User created in Yapily"
    response_body['results'] = data
    return response_body, 200


@api.route('/yapily-users', methods=['GET'])
def yapily_users():
    response_body = {}
    url = "https://api.yapily.com/users"
    response = requests.get(url, auth=(yapily_uuid, yapily_secret))
    if response.status_code != 200:
        response_body['message'] = "Something went wrong"
        response_body['results'] = response.json()
        return response_body, 400
    data = response.json()
    if not data:
        response_body['message'] = "No users found in Yapily."
        response_body['results'] = []
        return response_body, 400
    response_body['message'] = "These are all the current Yapily users within the app"
    response_body['results'] = data
    return response_body, 200


@api.route('/remove-yapily-user', methods=['DELETE'])
def remove_yapily_user():
    response_body = {}
    user_uuid = request.headers.get('yapilyId')
    url = "https://api.yapily.com/users/" + user_uuid
    response = requests.delete(url, auth=(yapily_uuid, yapily_secret))
    if response.status_code != 200:
        response_body['message'] = "Something went wrong"
        response_body['results'] = response.json()
        return response_body, 400
    data = response.json()
    response_body['message'] = "Yapily user removed!"
    response_body['results'] = data.get('data')
    return response_body, 200


@api.route('/account-auth-requests', methods=['POST'])
@jwt_required()
def account_auth_requests():
    response_body = {}
    current_user = get_jwt_identity()
    user = Users.query.filter_by(id=current_user['user_id']).first()
    front_data = request.get_json()
    application_user_id = front_data.get('applicationUserId')
    institution_id = front_data.get('institutionId')
    callback = front_data.get('callback')
    url = 'https://api.yapily.com/account-auth-requests'
    payload = {
        "applicationUserId": application_user_id,
        "institutionId": institution_id,
        "callback": callback
    }
    headers = {
        "Content-Type": "application/json;charset=UTF-8"
    }
    query = {
        "raw": "true"
    }
    response = requests.post(url, json=payload, headers=headers, params=query, auth=(yapily_uuid, yapily_secret))
    if response.status_code != 201:
        response_body['message'] = "Something went wrong"
        response_body['results'] = response.json()
        return response_body, 400
    data = response.json()
    authorisation_url = data.get('data').get('authorisationUrl')
    institution = Institutions.query.filter_by(yapily_id=institution_id).first()
    new_connection = Connections(user_id=user.id,
                                 institution_id=institution.id)
    db.session.add(new_connection)
    db.session.commit()
    return {"authorisationUrl": authorisation_url}, 200


@api.route('/consent-token', methods=['POST'])
@jwt_required()
def consent_token():
    response_body = {}
    current_user = get_jwt_identity()
    user = Users.query.filter_by(id=current_user['user_id']).first()
    front_data = request.get_json()
    consent_token = front_data.get('consentToken')
    institution_id = front_data.get('institutionId')
    institution = Institutions.query.filter_by(yapily_id=institution_id).first()
    connection = Connections.query.filter_by(institution_id=institution.id, user_id=user.id).first()
    connection.consent_token = consent_token
    db.session.commit()
    response_body['message'] = f"The consent token for the institution {institution.name} was saved"
    response_body['results'] = consent_token
    return response_body, 200


@api.route('/accounts', methods=['GET'])
@jwt_required()
def accounts():
    response_body = {}
    current_user = get_jwt_identity()
    user = Users.query.filter_by(id=current_user['user_id']).first()
    consent_token = request.headers.get('consent')
    connection = Connections.query.filter_by(consent_token=consent_token).first()
    url = 'https://api.yapily.com/accounts'
    headers = {
        "consent": consent_token
    }
    query = {
        "raw": "true"
    }
    response = requests.get(url, headers=headers, params=query, auth=(yapily_uuid, yapily_secret))
    if response.status_code != 200:
        response_body['message'] = "Something went wrong"
        response_body['results'] = response.json()
        return response_body, 400
    accounts_list = response.json()
    data = accounts_list.get('data')
    for account_data in data:
        saved_source = db.session.execute(db.select(Sources).where((Sources.yapily_id == account_data.get('id')) & (Sources.user_id == user.id))).scalar_one_or_none()
        if not saved_source:
            new_source = Sources(name=account_data.get('type'),
                                 yapily_id=account_data.get('id'),
                                 type_source='bank_account',
                                 amount=account_data.get('balance'),
                                 user_id=user.id,
                                 connection_id=connection.id)
            db.session.add(new_source)
    db.session.commit()
    rows = db.session.execute(db.select(Sources)).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = f"Your accounts were added to your sources successfully!"
    response_body['results'] = result
    return response_body, 200


@api.route('/bank-transactions', methods=['GET'])
@jwt_required()
def bank_transactions():
    response_body = {}
    current_user = get_jwt_identity()
    user = Users.query.filter_by(id=current_user['user_id']).first()
    consent_token = request.headers.get('consent')
    source_id = request.headers.get('sourceId')
    connection = Connections.query.filter_by(consent_token=consent_token, user_id=user.id).first()
    source = Sources.query.filter_by(yapily_id=source_id, user_id=user.id).first()
    url = f'https://api.yapily.com/accounts/' + source_id + '/transactions'
    headers = {
        "consent": consent_token
    }
    query = {
        "raw": "true"
    }
    response = requests.get(url, headers=headers, params=query, auth=(yapily_uuid, yapily_secret))
    if response.status_code != 200:
        response_body['message'] = "Something went wrong"
        response_body['results'] = response.json()
        return response_body, 400
    transactions_list = response.json()
    data = transactions_list.get('data')
    for transaction_data in data:
        saved_transaction = db.session.execute(db.select(Transactions).where((Transactions.yapily_id == transaction_data.get('id')) & (Transactions.source_id == source.id))).scalar_one_or_none()
        if not saved_transaction:
            amount = transaction_data.get('amount')
            transaction_type = 'expense' if amount < 0 else 'income'
            new_transaction = Transactions(yapily_id=transaction_data.get('id'),
                                           amount=abs(amount),
                                           type=transaction_type,
                                           description=transaction_data.get('description'),
                                           date=transaction_data.get('date'),
                                           source_id=source.id)
            db.session.add(new_transaction)
    db.session.commit()
    rows = db.session.execute(db.select(Transactions)).scalars()
    result = [row.serialize() for row in rows]
    response_body['message'] = f"The transactions from the account {source.yapily_id} were added successfully!"
    response_body['results'] = result
    return response_body, 200


@api.route('/sources', methods=['GET', 'POST'])
@jwt_required()
def sources():
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'GET':
        rows = db.session.execute(db.select(Sources).where(Sources.user_id == current_user['user_id'])).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "These are your sources (GET)"
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Sources(name = data.get('name'),
                      type_source = data.get('type_source'),
                      amount = data.get('amount'),
                      user_id = current_user['user_id'])
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "You have a new source (POST)"
        response_body['results'] = row.serialize()
        return response_body, 200


@api.route('/sources/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def source(id):
    response_body = {}
    current_user = get_jwt_identity()
    row = db.session.execute(db.select(Sources).where(Sources.user_id == current_user['user_id'], Sources.id == id)).scalar()
    if not row:
        response_body['message'] = "This source does not exist"
        response_body['results'] = {}
        return response_body, 400
    if request.method == 'GET':
        response_body['message'] = f"This is the source no. {id} (GET)"
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.name = data.get('name')
        row.type_source = data.get('type_source')
        row.amount = data.get('amount')
        db.session.commit()
        response_body['message'] = "All changes were saved (PUT)"
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = "The source was deleted (DELETE)"
        response_body['results'] = {}
        return response_body, 200


@api.route('/balances', methods=['GET'])
@jwt_required()
def balances():
    response_body = {}
    current_user = get_jwt_identity()
    row = db.session.execute(db.select(Balances).where(Balances.user_id == current_user['user_id'])).scalar()
    if not row:
        response_body['message'] = "You do not have a balance"
        return response_body, 403
    result = row.serialize()
    response_body['message'] = "This is your balance (GET)"
    response_body['results'] = result
    return response_body, 200


@api.route('/categories', methods=['GET', 'POST'])
@jwt_required()
def categories():
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'GET':
        rows = db.session.execute(db.select(Categories).where(Categories.user_id == current_user['user_id'])).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "List of the categories"
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Categories(name = data.get('name'),
                         description = data.get('description'),
                         user_id = data.get('user_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "Creating a category"
        response_body['results'] = row.serialize()
        return response_body, 200


@api.route('/categories/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def category(id):
    response_body = {}
    current_user = get_jwt_identity()
    row = db.session.execute(db.select(Categories).where(Categories.user_id == current_user['user_id'], Categories.id == id)).scalar()
    if not row:
        response_body['message'] = f'The category {id} does not exist'
        response_body['results'] = {}
        return response_body, 400
    if request.method == 'GET':
        response_body['message'] = f'Category data {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.name = data.get('name')
        row.description = data.get('description')
        row.user_id = data.get('user_id')
        db.session.commit()
        response_body['message'] = f'Category {id} edited'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Category {id} deleted'
        response_body['results'] = {}
        return response_body, 200


@api.route('/transactions', methods=['GET', 'POST'])
@jwt_required()
def transactions():
    response_body = {}
    current_user = get_jwt_identity()
    rows = db.session.execute(db.select(Transactions).join(Sources).where(Sources.user_id == current_user['user_id'])).scalars().all()
    for row in rows:
        print(f"{row.source_to.user_id} - current_user {current_user['user_id']}")
        if row.source_to.user_id != current_user['user_id']:
            response_body['message'] = f'No puedes hacer esta transaccion: {row.id}'
            response_body['results'] = {}
            return response_body, 403
    if request.method == 'GET': 
        result = [i.serialize() for i in rows]
        response_body['message'] = 'This are all your Transactions'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Transactions(amount = data.get('amount'),
                           name = data.get('name'),
                           type = data.get('type'),
                           description = data.get('description'),
                           date = data.get('date'),
                           source_id = data.get('source_id'),
                           category_id = data.get('category_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'Creaste una nueva Transaccions'
        response_body['results'] = row.serialize()
        return response_body, 200


@api.route('/transactions/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def transaction(id):
    response_body = {}
    current_user = get_jwt_identity()
    row = db.session.execute(db.select(Transactions).join(Sources).where(Sources.user_id == current_user['user_id'], Transactions.id == id)).scalar()
    if not row:
        response_body['message'] = "This Transaction does not exist"
        response_body['results'] = {}
        return response_body, 400
    if request.method  == 'GET':
        response_body['message'] = f'This is the transaction: {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.amount = data.get('amount', row.amount)
        row.name = data.get('name', row.name)
        row.type = data.get('type', row.type)
        row.description = data.get('description', row.description)
        row.date = data.get('date', row.date)
        row.source_id = data.get('source_id', row.source_id)
        row.category_id = data.get('category_id', row.category_id)
        response_body['message'] = f'You just edited transaction: {id}'
        response_body['results'] = row.serialize()
        db.session.commit()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'You just deleted transaction: {id}'
        response_body['results'] = {}
        return response_body, 200    


@api.route('/fixed-expenses', methods=['GET', 'POST'])
@jwt_required()
def fixed_expenses():
    response_body = {}
    current_user = get_jwt_identity()
    expenses = db.session.execute(db.select(FixedExpenses).join(Categories).where(Categories.user_id == current_user['user_id'])).scalars()
    if request.method == 'GET':
        result = [row.serialize() for row in expenses]
        response_body['message'] = "you got the fixed expenses list!"
        response_body['results'] = result
        return jsonify(response_body), 200
    if request.method == 'POST':
        data = request.json
        new_expense = FixedExpenses(
            description = data.get('description'),
            expected_amount = data.get('expected_amount'),
            real_amount = data.get('real_amount'),
            period = data.get('period'),
            next_date = data.get('next_date'),
            category_id = data.get('category.id'),
            is_active_next_period = data.get('is_active_next_period'))
        db.session.add(new_expense)
        db.session.commit()
        response_body['message'] = "you posted a fixed expense!"
        response_body['results'] = new_expense.serialize()
        return response_body, 200


@api.route('/fixed-expenses/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def fixed_expense_by_id(id):
    expense = FixedExpenses.query.get_or_404(id)
    current_user = get_jwt_identity()
    category = db.session.execute(db.select(Categories).where(Categories.id == expense.category_id, Categories.user_id == current_user['user_id'])).scalar()
    if not category:
        return jsonify({'message': 'Unauthorized access to this expense'}), 403
    if request.method == 'GET':
        return jsonify(expense.serialize()), 200
    if request.method == 'PUT':
        data = request.json
        expense.description = data.get('description', expense.description)
        expense.expected_amount = data.get('expected_amount', expense.expected_amount)
        expense.real_amount = data.get('real_amount', expense.real_amount)
        expense.period = data.get('period', expense.period)
        expense.next_date = data.get('next_date', expense.next_date)
        expense.category_id = data.get('category_id', expense.category_id)
        expense.is_active_next_period = data.get('is_active_next_period', expense.is_active_next_period)
        db.session.commit()
        return jsonify(expense.serialize()), 200
    if request.method == 'DELETE':
        db.session.delete(expense)
        db.session.commit()
        return jsonify({'message:':'you deleted a fixed expense!'}), 200


@api.route('/budgets', methods=['GET', 'POST'])
@jwt_required()
def budgets():
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'GET':
        rows = db.session.execute(db.select(Budgets).distinct().where(Categories.user_id == current_user['user_id'])).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "These are your budgets (GET)"
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Budgets(budget_amount = data.get('budget_amount'),
                      target_period = data.get('target_period'),
                      total_expense = data.get('total_expense'),
                      category_id = data.get('category_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "You have a new budget (POST)"
        response_body['results'] = row.serialize()
        return response_body, 200


@api.route('/budgets/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def budget(id):
    response_body = {}
    current_user = get_jwt_identity()
    row = db.session.execute(db.select(Budgets).where(Categories.user_id == current_user['user_id'], Budgets.id == id)).scalar()
    if not row:
        response_body['message'] = "This budget does not exist"
        response_body['results'] = {}
        return response_body, 400
    if request.method == 'GET':
        response_body['message'] = f"This is the budget no. {id} (GET)"
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.budget_amount = data.get('budget_amount')
        row.target_period = data.get('target_period')
        row.total_expense = data.get('total_expense')
        row.category_id = data.get('category_id')
        db.session.commit()
        response_body['message'] = "All changes were saved (PUT)"
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = "The budget was deleted (DELETE)"
        response_body['results'] = {}
        return response_body, 200


@api.route('/users', methods=['GET', 'POST'])
@jwt_required()
def users():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Users)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = 'List of Users'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Users(email = data.get('email'),
                    password = data.get('password'),
                    first_name = data.get('first_name'),
                    last_name = data.get('last_name'),
                    phone_number = data.get('phone_number'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'Created a New User'
        response_body['results'] = row.serialize()
        return response_body, 200


@api.route('/users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def user(id):
    response_body = {}
    current_user = get_jwt_identity()
    print("current_user:", current_user) 
    row = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
    if not row:
        response_body['message'] = f'The user {id} does not exist'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = f'User {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.email = data.get('email', row.email)
        row.password = data.get('password', row.password)
        row.first_name = data.get('first_name', row.first_name)
        row.last_name = data.get('last_name', row.last_name)
        row.phone_number = data.get('phone_number', row.phone_number)
        row.photo_url = data.get('photo_url', row.photo_url)
        db.session.commit()
        response_body['message'] = f'User {id} edited'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'User {id} deleted'
        response_body['results'] = {}
        return response_body, 200


@api.route('/upload', methods=['POST'])
def upload():
    file_to_upload = request.files.get('img')
    if file_to_upload:
        upload = cloudinary.uploader.upload(file_to_upload)
        image_url = upload.get("url")  # Obtén solo la URL
        print('-------------la url donde esta la imagen-------------', image_url)
        return jsonify({"url": image_url}), 200  # Retorna solo la URL de la imagen
    return jsonify({"error": "No file uploaded"}), 400


def generate_reset_token():
    return secrets.token_urlsafe(16)

def send_reset_email(email, reset_link):
    sender_email = "expensevue.sp77@gmail.com"
    sender_password = "jmca cpzh kizy xtal" # Clave para aplicaciones
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    message = MIMEText(f"To reset your password, visit the following link: {reset_link}\n\nIf you did not request this, please ignore this email.")
    message["Subject"] = "Password Reset Request"
    message["From"] = sender_email
    message["To"] = email

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, message.as_string())
    except Exception as e:
        print(f"Error sending email: {e}")


@api.route('/forgot-password', methods=['POST'])
def password_recovery():
    response_body = {}
    data = request.json
    email = data.get('email')

    if not email:
        response_body['message'] = 'Email is required.'
        return jsonify(response_body), 400

    user = db.session.execute(db.select(Users).where(Users.email == email)).scalar()

    if not user:
        response_body['message'] = 'Email not registered.'
        response_body['results'] = {}
        return jsonify(response_body), 404

    try:
        reset_token = generate_reset_token()
        frontend_url = os.getenv('FRONTEND_URL')
        if not frontend_url.endswith('/'):
            frontend_url += '/'
        reset_link = f"{frontend_url}reset-password?token={reset_token}"
        user.reset_token = reset_token
        user.token_expiration = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()
        send_reset_email(email, reset_link)
        response_body['message'] = 'Recovery email sent.'
        response_body['results'] = {}
        return jsonify(response_body), 200

    except Exception as e:
        print(f"Error in password recovery: {e}")
        db.session.rollback()
        response_body['message'] = 'Error sending recovery email.'
        response_body['results'] = {}
        return jsonify(response_body), 500


@api.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    token = data.get('token')
    new_password = data.get('new_password')

    if not token or not new_password:
        return jsonify({'message': 'Token and new password are required.'}), 400

    user = db.session.execute(db.select(Users).where(Users.reset_token == token)).scalar()

    if not user or user.token_expiration < datetime.utcnow():
        return jsonify({'message': 'Invalid or expired token.'}), 400

    user.password = new_password  
    user.reset_token = None  
    user.token_expiration = None
    db.session.commit()

    return jsonify({'message': 'Password has been reset successfully.'}), 200

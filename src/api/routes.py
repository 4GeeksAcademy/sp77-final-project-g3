"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Sources, Balances, Categories, Transactions, FixedExpenses, Budgets
from datetime import datetime, timezone
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import requests


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body["message"]= "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
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
        row = Sources(id = data.get('id'),
                      name = data.get('name'),
                      type_source = data.get('type_source'),
                      amount = data.get('amount'),
                      user_id = data.get('user_id'))
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
        row.id = data.get('id')
        row.name = data.get('name')
        row.type_source = data.get('type_source')
        row.amount = data.get('amount')
        row.user_id = data.get('user_id')
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
        row = Categories(id = data.get('id'),
                         type_category = data.get('type_category'),
                         name = data.get('name'),
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
        row.type_category = data.get('type_category')
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
        row = Transactions(id = data.get('id'),
                           amount = data.get('amount'),
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
        row.description = data.get('description', row.description)
        row.date = data.get('date', row.date)
        row.source_id = data.get('source_id', row.source_id)
        row.category_id = data.get('category_id', row.category_id)
        response_body['message'] = f'You just edited transaction: {id}'
        response_body['results'] = row.serialize()
        db.session.commit()
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
    if request.method == 'GET':
        categories = db.session.execute(db.select(Categories).where(Categories.user_id == current_user['user_id'])).scalar()
        category_ids = [category.id for category in categories]
        expenses = db.session.execute(db.select(FixedExpenses).where(FixedExpenses.category_id.in_(category_ids))).scalars()
        response_body['message'] = "you got the fixed expenses list!"
        response_body['results'] = [expense.serialize() for expense in expenses]
        return jsonify(response_body), 200
    if request.method == 'POST':
        data = request.json
        category = db.session.execute(db.select(Categories).where(Categories.id == data['category_id'], Categories.user_id == current_user['user_id'])).scalar()
        if not category:
            response_body['message'] = "Invalid category for the current user"
            return jsonify(response_body), 400
        new_expense = FixedExpenses(
            description = data['description'],
            expected_amount = data['expected_amount'],
            period = data['period'],
            next_date = data['next-date'],
            category_id = category.id,
            is_active_next_period = data['is_active_next_period'])
        db.session.add(new_expense)
        db.session.commit()
        response_body['message'] = "you posted a fixed expense!"
        response_body['results'] = new_expense.serialize()
        return jsonify(new_expense.serialize()), 201
 

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
        rows = db.session.execute(db.select(Budgets).where(Categories.user_id == current_user['user_id'])).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "These are your budgets (GET)"
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Budgets(id = data.get('id'),
                      budget_amount = data.get('budget_amount'),
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
        row.id = data.get('id')
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

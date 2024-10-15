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

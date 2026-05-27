from flask import Blueprint, request, jsonify
from models import db, User, Customer, Lead, Interaction
import jwt
import datetime
from flask_bcrypt import Bcrypt
from functools import wraps
import os
from werkzeug.utils import secure_filename

routes = Blueprint('routes', __name__)
bcrypt = Bcrypt()
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key') # In production use environment variable

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Auth Routes
@routes.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists!'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists!'}), 400
        
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password, role=data.get('role', 'sales_rep')) # type: ignore
    db.session.add(new_user)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Database error occurred!'}), 500
    return jsonify({'message': 'User created successfully!'}), 201

@routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        return jsonify({'token': token, 'role': user.role, 'username': user.username})
    return jsonify({'message': 'Invalid credentials!'}), 401

# Customer Routes
@routes.route('/customers', methods=['GET'])
@token_required
def get_customers(current_user):
    customers = Customer.query.all()
    output = []
    for c in customers:
        output.append({'id': c.id, 'name': c.name, 'email': c.email, 'phone': c.phone, 'company': c.company, 'notes': c.notes})
    return jsonify({'customers': output})

@routes.route('/customers', methods=['POST'])
@token_required
def add_customer(current_user):
    data = request.get_json()
    new_customer = Customer(name=data['name'], email=data['email'], phone=data.get('phone'), company=data.get('company'), notes=data.get('notes')) # type: ignore
    db.session.add(new_customer)
    db.session.commit()
    return jsonify({'message': 'Customer added!'}), 201

@routes.route('/customers/<int:id>', methods=['PUT', 'DELETE'])
@token_required
def manage_customer(current_user, id):
    customer = Customer.query.get_or_404(id)
    if request.method == 'DELETE':
        db.session.delete(customer)
        db.session.commit()
        return jsonify({'message': 'Customer deleted!'})
    
    data = request.get_json()
    customer.name = data.get('name', customer.name)
    customer.email = data.get('email', customer.email)
    customer.phone = data.get('phone', customer.phone)
    customer.company = data.get('company', customer.company)
    customer.notes = data.get('notes', customer.notes)
    db.session.commit()
    return jsonify({'message': 'Customer updated!'})

# Lead Routes
@routes.route('/leads', methods=['GET'])
@token_required
def get_leads(current_user):
    status = request.args.get('status')
    query = Lead.query
    if status:
        query = query.filter_by(status=status)
    leads = query.all()
    output = []
    for l in leads:
        output.append({
            'id': l.id, 
            'customer_name': l.customer.name, 
            'status': l.status, 
            'assigned_to': l.assigned_to,
            'notes': l.notes
        })
    return jsonify({'leads': output})

@routes.route('/leads', methods=['POST'])
@token_required
def add_lead(current_user):
    data = request.get_json()
    new_lead = Lead(customer_id=data['customer_id'], status=data.get('status', 'New'), assigned_to=data.get('assigned_to'), notes=data.get('notes')) # type: ignore
    db.session.add(new_lead)
    db.session.commit()
    return jsonify({'message': 'Lead created!'}), 201

@routes.route('/leads/<int:id>', methods=['PUT', 'DELETE'])
@token_required
def manage_lead(current_user, id):
    lead = Lead.query.get_or_404(id)
    if request.method == 'DELETE':
        db.session.delete(lead)
        db.session.commit()
        return jsonify({'message': 'Lead deleted!'})
    
    data = request.get_json()
    lead.status = data.get('status', lead.status)
    lead.notes = data.get('notes', lead.notes)
    db.session.commit()
    return jsonify({'message': 'Lead updated!'})

# Interaction Routes
@routes.route('/interactions', methods=['GET'])
@token_required
def get_interactions(current_user):
    interactions = Interaction.query.order_by(Interaction.date.desc()).limit(50).all()
    output = []
    for i in interactions:
        output.append({
            'id': i.id,
            'lead_name': i.lead.customer.name,
            'interaction_type': i.interaction_type,
            'description': i.description,
            'date': i.date.strftime('%Y-%m-%d %H:%M:%S')
        })
    return jsonify({'interactions': output})

@routes.route('/interactions', methods=['POST'])
@token_required
def add_interaction(current_user):
    data = request.get_json()
    new_interaction = Interaction(lead_id=data['lead_id'], interaction_type=data['interaction_type'], description=data.get('description')) # type: ignore
    db.session.add(new_interaction)
    db.session.commit()
    return jsonify({'message': 'Interaction logged!'}), 201

# Profile & Settings Routes
@routes.route('/me', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'username': current_user.username,
        'email': current_user.email,
        'role': current_user.role,
        'photo_url': current_user.photo_url,
        'created_at': current_user.created_at.strftime('%Y-%m-%d')
    })

@routes.route('/me/update', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    if 'username' in data:
        current_user.username = data['username']
    if 'email' in data:
        current_user.email = data['email']
    if 'photo_url' in data:
        current_user.photo_url = data['photo_url']
    if 'password' in data:
        current_user.password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    try:
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully!'})
    except:
        db.session.rollback()
        return jsonify({'message': 'Update failed!'}), 500

@routes.route('/me/photo', methods=['POST'])
@token_required
def upload_photo(current_user):
    if 'photo' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['photo']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        ext = os.path.splitext(filename)[1]
        new_filename = f"user_{current_user.id}_{int(datetime.datetime.now().timestamp())}{ext}"
        upload_folder = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'uploads')
        filepath = os.path.join(upload_folder, new_filename)
        file.save(filepath)
        
        current_user.photo_url = f"/uploads/{new_filename}"
        db.session.commit()
        return jsonify({'message': 'Photo uploaded successfully', 'photo_url': current_user.photo_url})

# Dashboard Stats
@routes.route('/dashboard', methods=['GET'])
@token_required
def get_dashboard(current_user):
    customer_count = Customer.query.count()
    lead_count = Lead.query.count()
    open_leads = Lead.query.filter(Lead.status != 'Lost').count()
    interaction_count = Interaction.query.count()
    
    leads_by_status = db.session.query(Lead.status, db.func.count(Lead.id)).group_by(Lead.status).all()
    status_counts = {status: count for status, count in leads_by_status}
    
    recent_interactions = Interaction.query.order_by(Interaction.date.desc()).limit(5).all()
    recent_output = []
    for i in recent_interactions:
        recent_output.append({
            'id': i.id,
            'lead_name': i.lead.customer.name,
            'interaction_type': i.interaction_type,
            'description': i.description,
            'date': i.date.strftime('%b %d, %Y %I:%M %p')
        })

    total_closed_won = Lead.query.filter_by(status='Closed Won').count()
    conversion_rate = (total_closed_won / lead_count * 100) if lead_count > 0 else 0
    
    # Mock data for Leads over time (last 5 days)
    leads_over_time = [
        {'date': 'May 1', 'count': 18},
        {'date': 'May 5', 'count': 22},
        {'date': 'May 10', 'count': 35},
        {'date': 'May 15', 'count': 32},
        {'date': 'May 20', 'count': 45}
    ]

    return jsonify({
        'total_customers': customer_count,
        'total_leads': lead_count,
        'open_leads': open_leads,
        'total_interactions': interaction_count,
        'closed_won': total_closed_won,
        'conversion_rate': round(conversion_rate, 2),
        'leads_by_status': status_counts,
        'recent_interactions': recent_output,
        'leads_over_time': leads_over_time
    })

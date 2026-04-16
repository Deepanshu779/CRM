from flask import Flask, send_from_directory
from flask_cors import CORS
from models import db
from routes import routes
import os

# Configure paths for static files (React build)
# The frontend/dist folder will contain the bundled assets
frontend_folder = os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'frontend', 'dist')

app = Flask(__name__, static_folder=frontend_folder, template_folder=frontend_folder)
CORS(app)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# Register API routes
app.register_blueprint(routes, url_prefix='/api')

# Serve React App for any other route (SPA fallback)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)

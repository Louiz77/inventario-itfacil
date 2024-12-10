from flask import Flask
from app.routes import setup_routes
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    CORS(app)
    app.config.from_object('config.Config')
    setup_routes(app)

    return app

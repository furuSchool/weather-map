from flask import Flask, request
from app.static import static_blueprint
from .fetchWeather import fetchThreeDaysForecast
from flask_cors import CORS


app = Flask(__name__, static_folder='../dist', static_url_path='/')
cors = CORS(app, resources={r'/*': {'origins': 'http://localhost:5173'}})

@app.route('/')
def index():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    forecast = fetchThreeDaysForecast(lat, lon)
    return forecast


app.register_blueprint(static_blueprint)

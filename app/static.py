from flask import Blueprint

static_blueprint = Blueprint(
    'static', __name__,
    static_folder='../dist/assets'
)

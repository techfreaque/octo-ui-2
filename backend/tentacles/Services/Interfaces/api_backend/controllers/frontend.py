from flask_cors import cross_origin
import tentacles.Services.Interfaces.web_interface.login as login
import os
from flask import send_from_directory


def register_frontend_route(plugin):
    @plugin.blueprint.route('/home')
    @plugin.blueprint.route('/home/')
    @plugin.blueprint.route('/home/<url_path>')
    @cross_origin(origins="*")
    @login.login_required_when_activated
    def home(url_path=None):
        os_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        return send_from_directory(os.path.join(os_path, 'static'), 'index.html')
# from flask_cors import cross_origin
import tentacles.Services.Interfaces.web_interface.login as login
import os
from flask import send_from_directory
from tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 import (
    import_cross_origin_if_enabled,
)


def register_frontend_route(plugin):
    route = "/<url_path>"
    if cross_origin := import_cross_origin_if_enabled():

        @plugin.blueprint.route(route)
        @cross_origin(origins="*")
        @login.login_required_when_activated
        def any_page(url_path=None):
            return _home(url_path)

    else:

        @plugin.blueprint.route(route)
        @login.login_required_when_activated
        def any_page(url_path=None):
            return _home(url_path)

    route = "/home"
    if cross_origin := import_cross_origin_if_enabled():

        @plugin.blueprint.route(route)
        @cross_origin(origins="*")
        @login.login_required_when_activated
        def home(url_path=None):
            return _home(url_path)

    else:

        @plugin.blueprint.route(route)
        @login.login_required_when_activated
        def home(url_path=None):
            return _home(url_path)

    def _home(url_path):
        os_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../"))
        return send_from_directory(os.path.join(os_path, "static"), "index.html")

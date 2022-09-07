import flask
import tentacles.Services.Interfaces.web_interface.login as login
import tentacles.Services.Interfaces.web_interface.models as models
from tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 import import_cross_origin_if_enabled


def register_commands_routes(plugin):
    route = "/commands/<cmd>"
    methods = ['GET', 'POST']
    if cross_origin := import_cross_origin_if_enabled():
        @plugin.blueprint.route(route, methods=methods)
        @cross_origin(origins="*")
        @login.login_required_when_activated
        def commands():
            return _commands()
    else:
        @plugin.blueprint.route(route, methods=methods)
        @login.login_required_when_activated
        def commands():
            return _commands()

    def _commands(cmd=None):
        if cmd == "restart":
            models.restart_bot()
            return flask.jsonify("Success")

        elif cmd == "stop":
            models.stop_bot()
            return flask.jsonify("Success")

        elif cmd == "update":
            models.schedule_delayed_command(models.update_bot())
            return flask.jsonify("Update started")

        else:
            raise RuntimeError("Unknown command")

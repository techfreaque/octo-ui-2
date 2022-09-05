import flask
from flask_cors import cross_origin

import tentacles.Services.Interfaces.web_interface.login as login
import tentacles.Services.Interfaces.web_interface.models as models


def register_commands_routes(plugin):
    @plugin.blueprint.route('/commands/<cmd>', methods=['GET', 'POST'])
    @cross_origin(origins="*")
    @login.login_required_when_activated
    def commands(cmd=None):
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

import flask
from flask_cors import cross_origin
import tentacles.Services.Interfaces.web_interface.login as login


def register_bot_config_routes(plugin):
    @plugin.blueprint.route("/bot-config")
    @cross_origin(origins="*")
    @login.login_required_when_activated
    def bot_config():
        if flask.request.method == "GET":
            requested_config_keys = flask.request.args['config_keys'].split(",")
            configs = {
                "frontendSettings": {
                    "schema": {
                        "title": "frontendSettings",
                        "type": "object",
                        "required": ["title"],
                        "properties": {
                            "title": {"type": "string", "title": "Title",
                                      "default": "A new task"},
                            "done": {"type": "boolean", "title": "Done?", "default": False}
                        },
                    },
                    "data": {
                        "done": True,
                        "title": "A new vxcvxc task reeeeee"
                    }
                }
            }
            configs_to_send = {}
            for key in requested_config_keys:
                try:
                    configs_to_send[key] = configs[key]
                except KeyError:
                    configs_to_send[key] = {}
            return configs_to_send

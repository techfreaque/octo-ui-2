import flask
from tentacles.Services.Interfaces.web_interface import models
import tentacles.Services.Interfaces.web_interface.login as login
from tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 import (
    dev_mode_is_on,
    get_logger,
    import_cross_origin_if_enabled,
)
from tentacles.Services.Interfaces.web_interface.models.configuration import (
    send_command_to_activated_tentacles,
)


def register_semi_auto_trade_routes(plugin):
    route = "/trading_mode_command/<command>"
    methods = ["POST"]
    if cross_origin := import_cross_origin_if_enabled():
        if dev_mode_is_on():

            @plugin.blueprint.route(route, methods=methods)
            @cross_origin(origins="*")
            def reload_activated_tentacles_config(command):
                return _reload_activated_tentacles_config(command)

        else:

            @plugin.blueprint.route(route, methods=methods)
            @cross_origin(origins="*")
            @login.login_required_when_activated
            def reload_activated_tentacles_config(command):
                return _reload_activated_tentacles_config(command)

    else:

        @plugin.blueprint.route(route, methods=methods)
        @login.login_required_when_activated
        def reload_activated_tentacles_config(command):
            return _reload_activated_tentacles_config(command)

    def _reload_activated_tentacles_config(command):
        if flask.request.method == "POST":
            action = flask.request.args.get("action")
            success = True
            response = ""
            if action == "update":
                request_data = flask.request.get_json()
                responses = []
                for tentacle, config in request_data.items():
                    update_success, update_response = models.update_tentacle_config(
                        tentacle, config
                    )
                    success = update_success and success
                    responses.append(update_response)
                response = ", ".join(responses)
            try:
                send_command_to_activated_tentacles(command)
                return {"success": True, "message": response}
            except Exception as error:
                get_logger().exception(error, True, f"Failed to execute trades")
                raise

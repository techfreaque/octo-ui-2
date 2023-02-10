import flask
import tentacles.Services.Interfaces.octo_ui2.models.optimizer as optimizer_models
import tentacles.Services.Interfaces.octo_ui2.utils.basic_utils as basic_utils
import tentacles.Services.Interfaces.octo_ui2.models as octo_ui2_models
import tentacles.Services.Interfaces.web_interface.login as login
import tentacles.Services.Interfaces.web_interface.models as models


def register_optimizer_routes(plugin):
    route = "/optimizer/<command>"
    methods = ["POST", "GET"]
    if cross_origin := octo_ui2_models.import_cross_origin_if_enabled():

        @plugin.blueprint.route(route, methods=methods)
        @cross_origin(origins="*")
        @login.login_required_when_activated
        def optimizer(command):
            return _optimizer(command)

    else:

        @plugin.blueprint.route(route, methods=methods)
        @login.login_required_when_activated
        def optimizer(command):
            return _optimizer(command)


def _optimizer(command):
    trading_mode = models.get_config_activated_trading_mode()
    if flask.request.method == "POST":
        try:
            request_data = flask.request.get_json()
            if command == "add":
                return optimizer_models.add_to_optimizer_queue(
                    request_data, trading_mode
                )
            if command == "update":
                return optimizer_models.update_optimizer_queue(
                    request_data, trading_mode
                )
        except Exception as error:
            return optimizer_models.handle_queue_update_fail(error)
    else:
        try:
            return optimizer_models.get_optimizer_queue(trading_mode)
        except Exception as error:
            octo_ui2_models.get_octo_ui_2_logger().exception(
                error, True, "Failed to get optimizer queue"
            )
            return basic_utils.get_response(
                success=False, message=f"Failed to get optimizer queue, error: {error}"
            )

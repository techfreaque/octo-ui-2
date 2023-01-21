import flask
from tentacles.Services.Interfaces.octo_ui2.models import octo_ui2
import tentacles.Services.Interfaces.web_interface.login as login
from tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 import (
    dev_mode_is_on,
    import_cross_origin_if_enabled,
)
import tentacles.Services.Interfaces.web_interface.util as util
import tentacles.Services.Interfaces.octo_ui2.models.run_data as run_data_models


def register_run_data_routes(plugin):
    route = "/backtesting_runs"
    methods = ["POST"]
    if cross_origin := import_cross_origin_if_enabled():
        if dev_mode_is_on():

            @plugin.blueprint.route(route, methods=methods)
            @cross_origin(origins="*")
            def run_data():
                return _run_data()

        else:

            @plugin.blueprint.route(route, methods=methods)
            @cross_origin(origins="*")
            @login.login_required_when_activated
            def run_data():
                return _run_data()

    else:

        @plugin.blueprint.route(route, methods=methods)
        @login.login_required_when_activated
        def run_data():
            return _run_data()

    def _run_data():
        request_data = flask.request.get_json()
        try:
            return util.get_rest_reply(
                {
                    "success": True,
                    "message": "Successfully fetched run data",
                    "data": run_data_models.get_backtesting_run_data(request_data),
                },
                200,
            )
        except Exception as error:
            octo_ui2.get_octo_ui_2_logger("run_data").exception(error)
            return util.get_rest_reply(str(error), 500)

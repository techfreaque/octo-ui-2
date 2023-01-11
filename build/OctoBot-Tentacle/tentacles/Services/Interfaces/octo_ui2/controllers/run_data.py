import flask
import tentacles.Services.Interfaces.web_interface.login as login
from tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 import (
    dev_mode_is_on,
    import_cross_origin_if_enabled,
)
import tentacles.Services.Interfaces.web_interface.util as util
import octobot_commons.logging as commons_logging
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
                run_data_models.get_backtesting_run_data(request_data), 200
            )
        except Exception as e:
            commons_logging.get_logger("run_data").exception(e)
            return util.get_rest_reply(str(e), 500)


    # route = "/live_run_data"
    # methods = ["POST"]
    # if cross_origin := import_cross_origin_if_enabled():
    #     if dev_mode_is_on():

    #         @plugin.blueprint.route(route, methods=methods)
    #         @cross_origin(origins="*")
    #         def live_run_data():
    #             return _live_run_data()

    #     else:

    #         @plugin.blueprint.route(route, methods=methods)
    #         @cross_origin(origins="*")
    #         @login.login_required_when_activated
    #         def live_run_data():
    #             return _live_run_data()

    # else:

    #     @plugin.blueprint.route(route, methods=methods)
    #     @login.login_required_when_activated
    #     def live_run_data():
    #         return _live_run_data()

    # def _live_run_data():
    #     request_data = flask.request.get_json()
    #     try:
    #         return util.get_rest_reply(
    #             run_data_models.get_live_run_data(request_data["live_id"]), 200
    #         )
    #     except Exception as e:
    #         commons_logging.get_logger("run_data").exception(e)
    #         return util.get_rest_reply(str(e), 500)

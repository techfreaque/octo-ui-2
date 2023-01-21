import flask
from tentacles.Services.Interfaces.octo_ui2.models import octo_ui2
import tentacles.Services.Interfaces.octo_ui2.models.plots as plots_models
import tentacles.Services.Interfaces.web_interface.login as login
import tentacles.Services.Interfaces.web_interface.models as models
import tentacles.Services.Interfaces.web_interface.util as util
import octobot_commons.logging as commons_logging
import octobot_commons.symbols.symbol_util as symbol_util
from tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 import (
    import_cross_origin_if_enabled,
)


def register_plot_data_routes(plugin):
    route = "/plotted_run_data"
    methods = ["POST"]
    if cross_origin := import_cross_origin_if_enabled():

        @plugin.blueprint.route(route, methods=methods)
        @cross_origin(origins="*")
        @login.login_required_when_activated
        def run_plotted_data():
            return _run_plotted_data()

    else:

        @plugin.blueprint.route(route, methods=methods)
        @login.login_required_when_activated
        def run_plotted_data():
            return _run_plotted_data()

    def _run_plotted_data():
        try:
            request_data = flask.request.get_json()
            trading_mode = models.get_config_activated_trading_mode()
            symbol = symbol_util.convert_symbol(request_data["symbol"], "|")
            optimizer_id = None
            backtesting_id = None
            if not (live_id := int(request_data.get("live_id", 0)) or None):
                optimizer_id = int(request_data.get("optimizer_id", 0)) or None
                backtesting_id = int(request_data.get("backtesting_id", 0))
            optimization_campaign = request_data.get("campaign_name", None)
            exchange_id = request_data.get("exchange_id", None)
            time_frame = request_data.get("time_frame", None)
            exchange = request_data.get("exchange", None)
            analysis_settings = request_data.get("analysis_settings", {})
            return util.get_rest_reply(
                {
                    "success": True,
                    "message": "Successfully fetched plotted data",
                    "data": plots_models.get_plotted_data(
                        trading_mode=trading_mode,
                        exchange_name=exchange,
                        symbol=symbol,
                        time_frame=time_frame,
                        optimizer_id=optimizer_id,
                        exchange_id=exchange_id,
                        backtesting_id=backtesting_id,
                        live_id=live_id,
                        optimization_campaign_name=optimization_campaign,
                        analysis_settings=analysis_settings,
                    ),
                },
                200,
            )
        except Exception as error:
            octo_ui2.get_octo_ui_2_logger("run_analysis_plotted_data").exception(error)
            return util.get_rest_reply(str(error), 500)

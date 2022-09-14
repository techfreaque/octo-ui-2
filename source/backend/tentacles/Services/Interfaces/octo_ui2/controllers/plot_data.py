import flask
import tentacles.Services.Interfaces.web_interface.login as login
import tentacles.Services.Interfaces.web_interface.models as models
import tentacles.Services.Interfaces.octo_ui2.models as local_models
import tentacles.Services.Interfaces.web_interface.util as util
import octobot_commons.logging as commons_logging
import octobot_commons.symbols.symbol_util as symbol_util
from tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 import import_cross_origin_if_enabled
import octobot_commons.constants as commons_constants


def register_plot_data_routes(plugin):
    route = "/plotted_data"
    methods = ['POST']
    if cross_origin := import_cross_origin_if_enabled():
        @plugin.blueprint.route(route, methods=methods)
        @cross_origin(origins="*")
        @login.login_required_when_activated
        def _plotted_data():
            return plotted_data()
    else:
        @plugin.blueprint.route(route, methods=methods)
        @login.login_required_when_activated
        def _plotted_data():
            return plotted_data()

    def plotted_data():
        try:
            request = flask.request.get_json()
            trading_mode = models.get_config_activated_trading_mode()
            live_id = int(flask.request.args.get('bot_current_live_id', commons_constants.DEFAULT_CURRENT_LIVE_ID))
            return util.get_rest_reply(local_models.get_plotted_data(
                trading_mode=trading_mode, symbol=symbol_util.convert_symbol(request["symbol"], "|"),
                time_frame=request["time_frame"], exchange_id=request["exchange_id"], backtesting_id=None,
                bot_recording_id=live_id, optimizer_id=None, campaign_name=None), 200)
        except Exception as e:
            commons_logging.get_logger("plotted_data").exception(e)
            return util.get_rest_reply(str(e), 500)

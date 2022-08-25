import flask
from flask_cors import cross_origin

import tentacles.Services.Interfaces.web_interface.login as login
import tentacles.Services.Interfaces.web_interface.models as models
import tentacles.Services.Interfaces.api_backend.models as local_models
import tentacles.Services.Interfaces.web_interface.util as util
import octobot_commons.logging as commons_logging
import octobot_commons.symbols.symbol_util as symbol_util
from octobot_trading.util import config_util as config_util


def register_plot_data_routes(plugin):
    @plugin.blueprint.route("/plotted_data")
    @cross_origin(origins="*")
    @login.login_required_when_activated
    def plotted_data():
        try:
            exchange_id = flask.request.args.get('exchange_id')
            symbol = flask.request.args.get('symbol')
            time_frame = flask.request.args.get('time_frame')
            trading_mode = models.get_config_activated_trading_mode()
            bot_recording_id = config_util.get_current_bot_recording_id()
            return util.get_rest_reply(local_models.get_plotted_data(
                trading_mode=trading_mode, symbol=symbol_util.convert_symbol(symbol, "|"),
                time_frame=time_frame, exchange_id=exchange_id, backtesting_id=None,
                bot_recording_id=bot_recording_id, optimizer_id=None, campaign_name=None), 200)
        except Exception as e:
            commons_logging.get_logger("plotted_data").exception(e)
            return util.get_rest_reply(str(e), 500)

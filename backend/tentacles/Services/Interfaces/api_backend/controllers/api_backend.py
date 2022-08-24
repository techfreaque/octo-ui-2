import flask
from flask_cors import cross_origin

import tentacles.Services.Interfaces.web_interface.login as login
import tentacles.Services.Interfaces.web_interface.models as models
import tentacles.Services.Interfaces.api_backend.models as local_models
import tentacles.Services.Interfaces.web_interface.util as util
import octobot_commons.logging as commons_logging
import octobot_commons.enums as commons_enums
import octobot_commons.symbols.symbol_util as symbol_util
from octobot_trading.util import config_util as config_util
import octobot_commons


def register_api_backend_routes(plugin):
    @plugin.blueprint.route("/bot-info")
    @cross_origin(origins="*")
    @login.login_required_when_activated
    def bot_info():
        is_starting = False
        config_candles_count = 0
        trading_mode = trading_mode_name = activated_strategy = exchange_name = exchange_id = None
        symbols = traded_time_frames = enabled_time_frames = activated_evaluators = []
        timeframes_dict = {}
        try:
            trading_mode = models.get_config_activated_trading_mode()
            trading_mode_name = trading_mode.get_name()
            exchange_manager, exchange_name, exchange_id = models.get_first_exchange_data()
            symbols = models.get_enabled_trading_pairs()
            activated_evaluators = models.get_config_activated_evaluators()
            strategies = models.get_config_activated_strategies()
            activated_strategy = strategies[0] if strategies else None

            enabled_time_frames = models.get_strategy_required_time_frames(activated_strategy) \
                if activated_strategy else []
            traded_time_frames = [tf.value for tf in models.get_traded_time_frames(exchange_manager)]
            for tf in commons_enums.TimeFrames:
                timeframes_dict[tf.value] = {"enabled": True if tf.value in traded_time_frames else False}

            config_candles_count = models.get_config_required_candles_count(exchange_manager)
        except KeyError:
            is_starting = True
        return {
            "is_starting": is_starting,
            "trading_mode_name": trading_mode_name,
            "tentacle_class": None,  #util.get_rest_reply(trading_mode),
            "exchange_id": exchange_id,
            "exchange_name": exchange_name,
            "symbols": sorted([symbol_util.convert_symbol(s, octobot_commons.MARKET_SEPARATOR, "|") for s in symbols]),
            "time_frames": timeframes_dict,
            # "activated_evaluators": activated_evaluators,
            # "activated_strategy": activated_strategy,
            # "config_candles_count": config_candles_count,
            "data_files": models.get_data_files_with_description(),
        }

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

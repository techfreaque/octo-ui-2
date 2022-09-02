from flask_cors import cross_origin

import tentacles.Services.Interfaces.web_interface.login as login
import tentacles.Services.Interfaces.web_interface.models as models
import octobot_commons.enums as commons_enums
import octobot_commons.symbols.symbol_util as symbol_util
import octobot_commons


def register_bot_info_routes(plugin):
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
            "tentacle_class": None,  # util.get_rest_reply(trading_mode),
            "exchange_id": exchange_id,
            "exchange_name": exchange_name,
            "symbols": sorted([symbol_util.convert_symbol(s, octobot_commons.MARKET_SEPARATOR, "|") for s in symbols]),
            "time_frames": timeframes_dict,
            # "enabled_time_frames": enabled_time_frames,
            "traded_time_frames": traded_time_frames,

            # "activated_evaluators": activated_evaluators,
            # "activated_strategy": activated_strategy,
            # "config_candles_count": config_candles_count,
            "data_files": models.get_data_files_with_description(),
        }

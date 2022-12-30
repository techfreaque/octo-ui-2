import os
import octobot_commons.logging as bot_logging
# import octobot_services.interfaces.util as interfaces_util
# import octobot_trading.api as trading_api
# import octobot_commons.databases as databases
# import octobot_commons.display as display
# import octobot_commons.errors as commons_errors
# import octobot_commons.enums as commons_enums
# import octobot_commons.optimization_campaign as optimization_campaign
# import tentacles.Services.Interfaces.web_interface.models.trading as trading_model
# import tentacles.Services.Interfaces.web_interface.models as models


def get_logger(_=None):
    return bot_logging.get_logger("OctoUi2Plugin")


CORS_ENABLED = os.getenv("CORS_MODE_ENABLED") or False
DEV_MODE_ENABLED = os.getenv("API_DEV_MODE_ENABLED") or False


def dev_mode_is_on():
    return DEV_MODE_ENABLED


def import_cross_origin_if_enabled():
    if CORS_ENABLED:
        try:
            from flask_cors import cross_origin

            return cross_origin
        except (ImportError, ModuleNotFoundError):
            get_logger().info("install flask_cors to expose your api for dev mode")
            return


# def get_portfolio_history():
#     exchange_manager, exchange_name, exchange_id = models.get_first_exchange_data()
#     try:
#         return exchange_manager.exchange_personal_data.portfolio_manager.historical_portfolio_value_manager.get_historical_values(
#             "USDT",
#             commons_enums.TimeFrames.ONE_DAY,
#             from_timestamp=0,
#             to_timestamp=None,
#         )
#     except AttributeError:
#         return {}


# def get_plotted_data(
#     trading_mode,
#     symbol,
#     time_frame,
#     exchange_id,
#     backtesting_id=None,
#     bot_recording_id=None,
#     optimizer_id=None,
#     campaign_name=None,
# ):
#     trading_model.ensure_valid_exchange_id(exchange_id)
#     elements = display.display_translator_factory()
#     campaign_name = (
#         campaign_name or optimization_campaign.OptimizationCampaign.get_campaign_name()
#     )
#     database_manager = databases.RunDatabasesIdentifier(
#         trading_mode,
#         optimization_campaign_name=campaign_name,
#         backtesting_id=backtesting_id,
#         live_id=bot_recording_id,
#         optimizer_id=optimizer_id,
#     )
#     try:
#         exchange_name = trading_api.get_exchange_name(
#             trading_api.get_exchange_manager_from_exchange_id(exchange_id)
#         )
#     except KeyError:
#         raise KeyError("Can't load exchange data, OctoBot might be initializing.")
#     try:
#         interfaces_util.run_in_bot_async_executor(
#             elements.fill_from_database(
#                 trading_mode,
#                 database_manager,
#                 exchange_name,
#                 symbol,
#                 time_frame,
#                 exchange_id,
#                 with_inputs=backtesting_id is None,
#             )
#         )
#     except commons_errors.DatabaseNotFoundError as e:
#         get_logger().exception(e, True, f"Error when opening database: {e}")
#     except commons_errors.MissingExchangeDataError as e:
#         get_logger().exception(e, True, f"Error when opening database: {e}")
#         raise
#     timestamps_dict = {}
#     plot_sources = {"main-chart": [], "sub-chart": []}
#     user_inputs = None
#     for section in elements.nested_elements:
#         if section == "inputs":
#             continue
#         for plotted_element in elements.nested_elements[section].elements:

#             if plotted_element.low:
#                 plot_sources[section].append(
#                     {
#                         "title": plotted_element.title,
#                         "type": plotted_element.kind,
#                         "y_type": plotted_element.y_type,
#                     }
#                 )
#                 for index, timestamp in enumerate(plotted_element.x):
#                     if timestamp in timestamps_dict:
#                         timestamps_dict[timestamp]["data"][plotted_element.title] = {
#                             "open": plotted_element.open[index],
#                             "high": plotted_element.high[index],
#                             "low": plotted_element.low[index],
#                             "close": plotted_element.close[index],
#                             "volume": plotted_element.volume[index],
#                         }
#                     else:
#                         timestamps_dict[timestamp] = {
#                             "x": timestamp,
#                             "data": {
#                                 plotted_element.title: {
#                                     "open": plotted_element.open[index],
#                                     "high": plotted_element.high[index],
#                                     "low": plotted_element.low[index],
#                                     "close": plotted_element.close[index],
#                                     "volume": plotted_element.volume[index],
#                                 }
#                             },
#                         }

#             elif plotted_element.x:
#                 plot_sources[section].append(
#                     {
#                         "title": plotted_element.title,
#                         "type": plotted_element.kind,
#                         "y_type": plotted_element.y_type,
#                         "mode": plotted_element.mode,
#                     }
#                 )
#                 for index, timestamp in enumerate(plotted_element.x):
#                     if timestamp in timestamps_dict:
#                         timestamps_dict[timestamp]["data"][plotted_element.title] = {
#                             "y": plotted_element.y[index]
#                         }
#                     else:
#                         timestamps_dict[timestamp] = {
#                             "x": timestamp,
#                             "data": {
#                                 plotted_element.title: {"y": plotted_element.y[index]}
#                             },
#                         }

#     portfolio_history = get_portfolio_history()
#     for timestamp in portfolio_history:
#         adapted_timestamp = float(timestamp * 1000)
#         if adapted_timestamp in timestamps_dict:
#             timestamps_dict[adapted_timestamp]["data"]["Portfolio Value"] = {
#                 "y": float(portfolio_history[timestamp])
#             }
#         else:
#             timestamps_dict[adapted_timestamp] = {
#                 "x": adapted_timestamp,
#                 "data": {"Portfolio Value": {"y": float(portfolio_history[timestamp])}},
#             }
#     plot_sources["sub-chart"].append(
#         {
#             "title": "Portfolio Value",
#             "type": "scattergl",
#             "y_type": "log",
#             "mode": "markers",
#         }
#     )

#     return {
#         "plot_data": sorted(list(timestamps_dict.values()), key=lambda d: d["x"]),
#         "plot_sources": plot_sources,
#         "user_inputs": elements.nested_elements["inputs"].to_json(),
#     }

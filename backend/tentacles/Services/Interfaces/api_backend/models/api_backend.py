import octobot_services.interfaces.util as interfaces_util
import octobot_trading.api as trading_api
import octobot_commons.logging as bot_logging
import octobot_commons.databases as databases
import octobot_commons.display as display
import octobot_commons.errors as commons_errors
import octobot_commons.optimization_campaign as optimization_campaign
import tentacles.Services.Interfaces.web_interface.models.trading as trading_model


def _get_logger():
    return bot_logging.get_logger("ApiBackend")


def get_plotted_data(trading_mode, symbol, time_frame, exchange_id, backtesting_id=None,
                     bot_recording_id=None, optimizer_id=None, campaign_name=None):
    trading_model.ensure_valid_exchange_id(exchange_id)
    elements = display.display_translator_factory()
    campaign_name = campaign_name or optimization_campaign.OptimizationCampaign.get_campaign_name()
    database_manager = databases.RunDatabasesIdentifier(trading_mode,
                                                        optimization_campaign_name=campaign_name,
                                                        backtesting_id=backtesting_id,
                                                        bot_recording_id=bot_recording_id,
                                                        optimizer_id=optimizer_id)
    try:
        exchange_name = trading_api.get_exchange_name(trading_api.get_exchange_manager_from_exchange_id(exchange_id))
    except KeyError:
        raise KeyError("Can't load exchange data, OctoBot might be initializing.")
    try:
        interfaces_util.run_in_bot_async_executor(
            elements.fill_from_database(trading_mode, database_manager, exchange_name, symbol, time_frame,
                                        exchange_id, with_inputs=backtesting_id is None)
        )
    except commons_errors.DatabaseNotFoundError as e:
        _get_logger().exception(e, True, f"Error when opening database: {e}")
    except commons_errors.MissingExchangeDataError as e:
        _get_logger().exception(e, True, f"Error when opening database: {e}")
        raise
    timestamps_dict = {}
    plot_sources = {"main-chart": [], "sub-chart": []}
    user_inputs = None
    for section in elements.nested_elements:
        if section == "inputs":
            continue
        for plotted_element in elements.nested_elements[section].elements:

            if plotted_element.low:
                plot_sources[section].append({"title": plotted_element.title, "type": plotted_element.kind,
                                                   "y_type": plotted_element.y_type})
                for index, timestamp in enumerate(plotted_element.x):
                    if timestamp in timestamps_dict:
                        timestamps_dict[timestamp]["data"][plotted_element.title] = \
                            {"open": plotted_element.open[index], "high": plotted_element.high[index],
                             "low": plotted_element.low[index], "close": plotted_element.close[index],
                             "volume": plotted_element.volume[index]}
                    else:
                        timestamps_dict[timestamp] = {
                            "x": timestamp,
                            "data": {plotted_element.title:
                                         {"open": plotted_element.open[index], "high": plotted_element.high[index],
                                          "low": plotted_element.low[index], "close": plotted_element.close[index],
                                          "volume": plotted_element.volume[index]
                                          }
                                     }
                        }

            elif plotted_element.x:
                plot_sources[section].append({"title": plotted_element.title, "type": plotted_element.kind,
                                                   "y_type": plotted_element.y_type, "mode": plotted_element.mode})
                for index, timestamp in enumerate(plotted_element.x):
                    if timestamp in timestamps_dict:
                        timestamps_dict[timestamp]["data"][plotted_element.title] = {"y": plotted_element.y[index]}
                    else:
                        timestamps_dict[timestamp] = {"x": timestamp, "data": {plotted_element.title:
                                                                                   {"y": plotted_element.y[index]}}}



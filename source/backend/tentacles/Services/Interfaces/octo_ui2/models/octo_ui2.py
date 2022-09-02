import octobot_services.interfaces.util as interfaces_util
import octobot_trading.api as trading_api
import octobot_commons.logging as bot_logging
import octobot_commons.databases as databases
import octobot_commons.display as display
import octobot_commons.errors as commons_errors
import octobot_commons.optimization_campaign as optimization_campaign
import tentacles.Services.Interfaces.web_interface.models.trading as trading_model


def _get_logger():
    return bot_logging.get_logger("OctoUi2Plugin")


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

    # new_element = elements.to_json()
    # for element in new_element:

    # new_element['data']['sub_elements'][0]['data']['elements'] = {"data": list(timestamps_dict.values()), "plot_sources": plot_sources}
    # return new_element
    return {"plot_data": list(timestamps_dict.values()), "plot_sources": plot_sources,
            "user_inputs": elements.nested_elements['inputs'].to_json()}

# def get_backtesting_run_plotted_data(trading_mode, exchange, symbol, run_id, optimizer_id,
#                                      campaign_name, backtesting_analysis_settings):
#     try:
#         elements = interfaces_util.run_in_bot_async_executor(
#             trading_mode.get_backtesting_plot(exchange, symbol, run_id, optimizer_id,
#                                               campaign_name, backtesting_analysis_settings)
#         )
#         return elements.to_json()
#     except commons_errors.MissingExchangeDataError as e:
#         _get_logger().exception(e, True, f"Error when opening database: {e}")
#         raise
#
#
# def get_run_data(runs_to_load_settings, trading_mode, include_optimizer_runs=True):
#     campaign_names, metadata = interfaces_util.run_in_bot_async_executor(
#         scripting_library.read_metadata(runs_to_load_settings, trading_mode,
#                                         include_optimizer_runs=include_optimizer_runs))
#     return {
#         "data": metadata, "campaigns": campaign_names
#     }
#
#
# def get_live_run_data(trading_mode):
#     return {
#         "data": interfaces_util.run_in_bot_async_executor(
#             scripting_library.read_bot_recording_runs_metadata(trading_mode)
#         )
#     }
#
#
# def delete_run_data(trading_mode, run_data_identifiers):
#     for run_data_identifier in run_data_identifiers:
#         databases.RunDatabasesIdentifier(
#             trading_mode,
#             optimization_campaign_name=run_data_identifier["campaign_name"],
#             backtesting_id=run_data_identifier["backtesting_id"],
#             optimizer_id=run_data_identifier["optimizer_id"] or None,
#         ).remove_all()
#     interfaces_util.run_in_bot_async_executor(
#         _update_backtesting_metadata(trading_mode, run_data_identifiers)
#     )
#     return {"title": f"{len(run_data_identifiers)} runs deleted"}
#
#
# async def _update_backtesting_metadata(trading_mode, run_data_identifiers):
#     backtesting_by_optimizer_by_campaign = {}
#     for run_data_identifier in run_data_identifiers:
#         campaign_name = run_data_identifier["campaign_name"]
#         backtesting_id = run_data_identifier["backtesting_id"]
#         optimizer_id = run_data_identifier["optimizer_id"] or None
#         try:
#             backtesting_by_optimizer_by_campaign[campaign_name][optimizer_id].add(backtesting_id)
#         except KeyError:
#             if campaign_name not in backtesting_by_optimizer_by_campaign:
#                 backtesting_by_optimizer_by_campaign[campaign_name] = {}
#             if optimizer_id not in backtesting_by_optimizer_by_campaign[campaign_name]:
#                 backtesting_by_optimizer_by_campaign[campaign_name][optimizer_id] = {backtesting_id}
#     for campaign_name, backtesting_by_optimizer in backtesting_by_optimizer_by_campaign.items():
#         for optimizer_id, backtests in backtesting_by_optimizer.items():
#             run_db_identifier = databases.RunDatabasesIdentifier(
#                 trading_mode,
#                 optimization_campaign_name=campaign_name,
#                 backtesting_id=next(iter(backtests)),
#                 optimizer_id=optimizer_id
#             )
#             async with databases.DBWriterReader.database(run_db_identifier.get_backtesting_metadata_identifier()) \
#                     as reader_writer:
#                 metadata = [
#                     run
#                     for run in await reader_writer.all(commons_enums.DBTables.METADATA.value)
#                     if run[commons_enums.BacktestingMetadata.ID.value] not in backtests
#                 ]
#                 await reader_writer.replace_all(commons_enums.DBTables.METADATA.value, metadata)
#
#
# def save_strategy_design_config(config_update):
#     if not config_update[octobot_constants.OPTIMIZATION_CAMPAIGN_KEY][commons_constants.CONFIG_NAME]:
#         raise RuntimeError("An optimization campaign name is required")
#     tentacles_manager_api.update_tentacle_config(interfaces_util.get_edited_tentacles_config(),
#                                                  strategy_designer_plugin.StrategyDesignerPlugin,
#                                                  config_update)
#     return f"Strategy designer configuration updated"
#
#
# def get_strategy_design_config():
#     return strategy_designer_plugin.StrategyDesignerPlugin.get_strategy_design_config(default_name=None)
#
#
# def generate_and_save_optimizer_run(trading_mode, config, exchange_id, optimizer_id, queue_size):
#     trading_model.ensure_valid_exchange_id(exchange_id)
#     runs = interfaces_util.run_in_bot_async_executor(
#         octobot_api.generate_and_save_strategy_optimizer_runs(
#             trading_mode,
#             interfaces_util.get_bot_api().get_edited_tentacles_config(),
#             config,
#             optimizer_id,
#             queue_size
#         )
#     )
#     optimizer = web_interface_root.WebInterface.tools[constants.BOT_TOOLS_STRATEGY_OPTIMIZER]
#     if optimizer is not None and octobot_api.is_optimizer_computing(optimizer):
#         octobot_api.update_strategy_optimizer_total_runs(optimizer, runs)
#     return f"Success: {'' if runs is None else len(runs)} runs saved"
#
#
# def start_strategy_design_optimizer(trading_mode, config, exchange_id, randomly_chose_runs, data_source,
#                                     start_timestamp=None, end_timestamp=None, required_idle_cores=0, exchange_type=None,
#                                     notify_when_complete=False, collector_start_callback=None, start_callback=None):
#     trading_model.ensure_valid_exchange_id(exchange_id)
#     tools = web_interface_root.WebInterface.tools
#     optimizer = tools[constants.BOT_TOOLS_STRATEGY_OPTIMIZER]
#     if optimizer is not None and octobot_api.is_optimizer_computing(optimizer):
#         return False, "Optimizer already running"
#     current_collector = tools[constants.BOT_TOOLS_DATA_COLLECTOR]
#     if current_collector:
#         return False, "A data collector is already running"
#     previous_independent_backtesting = tools[constants.BOT_TOOLS_BACKTESTING]
#     has_backtesting = previous_independent_backtesting and \
#                       octobot_api.is_independent_backtesting_in_progress(previous_independent_backtesting)
#     if data_source == backtesting_model.CURRENT_BOT_DATA:
#         files = None
#         if has_backtesting:
#             files = [backtesting_model.get_data_files_from_current_bot(exchange_id, start_timestamp, end_timestamp,
#                                                                        collect=False)]
#         else:
#             web_interface_root.WebInterface.tools[constants.BOT_TOOLS_DATA_COLLECTOR] = \
#                 backtesting_model.create_snapshot_data_collector(exchange_id, start_timestamp, end_timestamp)
#     else:
#         files = [data_source]
#     thread = threading.Thread(
#         target=asyncio.run,
#         args=(_collect_initialize_and_run_strategy_design_optimizer(
#             trading_mode, config, randomly_chose_runs,
#             start_timestamp, end_timestamp, required_idle_cores, exchange_type,
#             notify_when_complete, files, collector_start_callback, start_callback),),
#         name=f"{octobot_strategy_optimizer.StrategyDesignOptimizer.__name__}-WebInterface-runner")
#     thread.start()
#     return True, f"Success: the strategy optimizer is about to start"
#
#
# async def _collect_initialize_and_run_strategy_design_optimizer(trading_mode, config, randomly_chose_runs,
#                                                                 start_timestamp, end_timestamp, required_idle_cores,
#                                                                 exchange_type, notify_when_complete, data_files,
#                                                                 collector_start_callback, start_callback):
#     try:
#         # run in bot main loop to use the existing exchange connection
#         if not data_files:
#             collector_start_callback()
#             data_files = [
#                 interfaces_util.run_in_bot_main_loop(backtesting_api.initialize_and_run_data_collector(
#                     web_interface_root.WebInterface.tools[constants.BOT_TOOLS_DATA_COLLECTOR]
#                 ))]
#         try:
#             temp_independent_backtesting = octobot_api.create_independent_backtesting(
#                 interfaces_util.get_edited_config(), None, [])
#             temp_independent_backtesting.backtesting_config[commons_constants.CONFIG_EXCHANGE_TYPE] = exchange_type
#             optimizer_config = await octobot_api.initialize_independent_backtesting_config(temp_independent_backtesting)
#             optimizer = octobot_api.create_design_strategy_optimizer(
#                 trading_mode,
#                 optimizer_config,
#                 interfaces_util.get_bot_api().get_edited_tentacles_config(),
#                 config)
#             web_interface_root.WebInterface.tools[constants.BOT_TOOLS_STRATEGY_OPTIMIZER] = optimizer
#             # release data collector
#             web_interface_root.WebInterface.tools[constants.BOT_TOOLS_DATA_COLLECTOR] = None
#             start_timestamp = start_timestamp / 1000 if start_timestamp else None
#             end_timestamp = end_timestamp / 1000 if end_timestamp else None
#             if start_callback:
#                 start_callback()
#             await octobot_api.resume_design_strategy_optimizer(
#                 optimizer, data_files, randomly_chose_runs, start_timestamp, end_timestamp, required_idle_cores,
#                 notify_when_complete
#             )
#         except Exception as e:
#             bot_logging.get_logger("StartStrategyOptimizerModel").exception(
#                 e, True, f"Error when initializing strategy optimizer: {e}")
#         finally:
#             web_interface_root.WebInterface.tools[constants.BOT_TOOLS_STRATEGY_OPTIMIZER] = None
#     except Exception as e:
#         bot_logging.get_logger("DataCollectorModel").exception(
#             e, True, f"Error when collecting historical data: {e}")
#         return
#     finally:
#         web_interface_root.WebInterface.tools[constants.BOT_TOOLS_DATA_COLLECTOR] = None
#
#
# def get_strategy_optimizer_queue(trading_mode):
#     return {
#         "queue": interfaces_util.run_in_bot_async_executor(
#             octobot_api.get_design_strategy_optimizer_queue(trading_mode)
#         )
#     }
#
#
# def update_strategy_optimizer_queue(trading_mode, updated_queue):
#     return {
#         "queue": interfaces_util.run_in_bot_async_executor(
#             octobot_api.update_design_strategy_optimizer_queue(trading_mode, updated_queue)
#         )
#     }
#
#
# def _send_clear_command(command, message):
#     try:
#         configuration.send_command_to_activated_tentacles(command)
#         return {"title": message}
#     except Exception as e:
#         _get_logger().exception(e, True, f"Failed to reload scripts: {e}")
#         raise
#
#
# def clear_simulated_orders_cache():
#     return _send_clear_command(commons_enums.UserCommands.CLEAR_SIMULATED_ORDERS_CACHE.value,
#                                "Cleared simulated orders cache")
#
#
# def clear_simulated_trades_cache():
#     return _send_clear_command(commons_enums.UserCommands.CLEAR_SIMULATED_TRADES_CACHE.value,
#                                "Cleared simulated trades cache")
#
#
# def clear_plotted_cache():
#     return _send_clear_command(commons_enums.UserCommands.CLEAR_PLOTTING_CACHE.value, "Cleared plotting cache")
#
#
# def clear_all_cache():
#     interfaces_util.run_in_bot_main_loop(databases.CacheManager().clear_cache(
#         commons_constants.UNPROVIDED_CACHE_IDENTIFIER)
#     )
#     return {"title": "Cleared all cache"}

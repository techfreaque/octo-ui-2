import octobot_commons.databases as databases
import tentacles.Services.Interfaces.web_interface.models.trading as trading_model
import octobot_commons.errors as commons_errors
import octobot_services.interfaces.util as interfaces_util
import tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 as octo_ui2
import octobot_commons.display as commons_display


# def get_run_plotted_data(
#     trading_mode,
#     exchange,
#     symbol,
#     time_frame,
#     exchange_id,
#     optimizer_id,
#     backtesting_id,
#     live_id,
#     optimization_campaign,
#     backtesting_analysis_settings,
# ):
#     try:
#         elements = interfaces_util.run_in_bot_async_executor(
#             trading_mode.get_backtesting_plot(
#                 exchange,
#                 symbol,
#                 backtesting_id=backtesting_id,
#                 optimizer_id=optimizer_id,
#                 optimization_campaign=optimization_campaign,
#                 backtesting_analysis_settings=backtesting_analysis_settings,
#             )
#         )
#         return elements.to_json()
#     except commons_errors.MissingExchangeDataError as e:
#         octo_ui2.get_logger().exception(e, True, f"Error when opening database: {e}")
#         raise


def get_plotted_data(
    trading_mode,
    symbol,
    time_frame,
    exchange_name,
    exchange_id,
    backtesting_id=None,
    live_id=None,
    optimizer_id=None,
    optimization_campaign_name=None,
    analysis_settings={}
):
    trading_model.ensure_valid_exchange_id(exchange_id)
    elements = commons_display.display_translator_factory()
    database_manager = databases.RunDatabasesIdentifier(
        trading_mode,
        optimization_campaign_name=optimization_campaign_name,
        backtesting_id=backtesting_id,
        live_id=live_id,
        optimizer_id=optimizer_id,
    )
    try:
        interfaces_util.run_in_bot_async_executor(
            elements.fill_from_database(
                trading_mode,
                database_manager,
                exchange_name,
                symbol,
                time_frame,
                exchange_id,
                with_inputs=backtesting_id is None,
            )
        )
    except commons_errors.DatabaseNotFoundError as e:
        octo_ui2.get_logger().exception(e, True, f"Error when opening database: {e}")
    except commons_errors.MissingExchangeDataError as e:
        octo_ui2.get_logger().exception(e, True, f"Error when opening database: {e}")
        raise
    elements2 = interfaces_util.run_in_bot_async_executor(
    trading_mode.get_backtesting_plot(
        exchange_name,
        symbol,
        backtesting_id=backtesting_id,
        optimizer_id=optimizer_id,
        optimization_campaign=optimization_campaign_name if not live_id else None,
        backtesting_analysis_settings=analysis_settings,
        live_id=live_id
    )
    )
    elements2 = elements2.to_json()
    elements = elements.to_json()
    elements["data"]["sub_elements"] += elements2["data"]["sub_elements"]
    return elements

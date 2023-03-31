import octobot_commons.logging as logging
import octobot_commons.databases as databases
import octobot_commons.display as commons_display
import octobot_commons.errors as commons_errors
import octobot_trading.api as trading_api
import octobot_services.interfaces.util as interfaces_util
import tentacles.Services.Interfaces.web_interface.models.trading as trading_model
import tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 as octo_ui2


from tentacles.Services.Interfaces.run_analysis_mode.run_analysis_modes_plugin import (
    RunAnalysisModePlugin,
)


def get_plots(
    trading_mode,
    symbol,
    time_frame,
    exchange_name,
    exchange_id,
    backtesting_id=None,
    live_id=None,
    optimizer_id=None,
    optimization_campaign_name=None,
    analysis_settings={},
):

    # elements = interfaces_util.run_in_bot_async_executor(
    #     get_base_data(
    #         exchange_id,
    #         trading_mode,
    #         exchange_name,
    #         symbol,
    #         time_frame,
    #         optimization_campaign_name,
    #         backtesting_id,
    #         live_id,
    #         optimizer_id,
    #     )
    # )
    
    return RunAnalysisModePlugin.get_and_execute_run_analysis_mode(
        trading_mode_class=trading_mode,
        exchange_name=exchange_name,
        exchange_id=exchange_id,
        symbol=symbol,
        time_frame=time_frame,
        backtesting_id=backtesting_id,
        optimizer_id=optimizer_id,
        optimization_campaign=optimization_campaign_name if not live_id else None,
        live_id=live_id,
    )

    #     elements2 = elements2.to_json()
    #     elements["data"]["sub_elements"] += elements2["data"]["sub_elements"]

    # return elements


async def get_base_data(
    exchange_id,
    trading_mode,
    exchange_name,
    symbol,
    time_frame,
    optimization_campaign_name,
    backtesting_id,
    live_id,
    optimizer_id,
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
        exchange_manager = trading_api.get_exchange_manager_from_exchange_id(
            exchange_id
        )
        if not exchange_manager.storage_manager.candles_storage.enabled:
            exchange_manager.storage_manager.candles_storage.enabled = True
            await exchange_manager.storage_manager.candles_storage.start()
        await elements.fill_from_database(
            trading_mode,
            database_manager,
            exchange_name,
            symbol,
            time_frame,
            exchange_id,
            with_inputs=backtesting_id is None,
        )
    except commons_errors.DatabaseNotFoundError as error:
        octo_ui2.get_octo_ui_2_logger().exception(
            error, True, f"Error when opening database: {error}"
        )
        raise error
    except commons_errors.MissingExchangeDataError as error:
        octo_ui2.get_octo_ui_2_logger().exception(
            error, True, f"Error when opening database: {error}"
        )
        raise error
    return elements.to_json()

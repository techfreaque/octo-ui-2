import octobot_commons.logging as logging
import octobot_commons.databases as databases
import tentacles.Meta.Keywords.matrix_library.RunAnalysis.BaseDataProvider.custom_context as custom_context
import tentacles.Services.Interfaces.web_interface.models.trading as trading_model
import octobot_commons.errors as commons_errors
import octobot_services.interfaces.util as interfaces_util
import tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 as octo_ui2
import octobot_commons.display as commons_display
import octobot_trading.api as trading_api

try:
    from tentacles.Meta.Keywords.matrix_library.RunAnalysis.BaseDataProvider.default_base_data_provider.base_data_provider import (
        CandlesLoadingError,
    )
    from tentacles.Meta.Keywords.matrix_library.RunAnalysis.BaseDataProvider.default_base_data_provider.init_base_data import (
        LiveMetaDataNotInitializedError,
    )
except (ImportError, ModuleNotFoundError):

    class LiveMetaDataNotInitializedError(Exception):
        pass

    class CandlesLoadingError(Exception):
        pass


DEBUG_PLOTS = False


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
    analysis_settings={},
):

    elements = interfaces_util.run_in_bot_async_executor(
        get_base_data(
            exchange_id,
            trading_mode,
            exchange_name,
            symbol,
            time_frame,
            optimization_campaign_name,
            backtesting_id,
            live_id,
            optimizer_id,
        )
    )

    try:
        elements2 = interfaces_util.run_in_bot_async_executor(
            get_run_analysis_plots(
                trading_mode,
                exchange_name,
                symbol,
                time_frame,
                backtesting_id=backtesting_id,
                optimizer_id=optimizer_id,
                optimization_campaign=optimization_campaign_name
                if not live_id
                else None,
                analysis_settings=analysis_settings,
                live_id=live_id,
            )
        )
        elements2 = elements2.to_json()
        elements["data"]["sub_elements"] += elements2["data"]["sub_elements"]
    except CandlesLoadingError as error:
        if DEBUG_PLOTS:
            octo_ui2.get_octo_ui_2_logger().exception(
                error, True, f"Failed to load run analysis plots - error: {error}"
            )
    except LiveMetaDataNotInitializedError as error:
        if DEBUG_PLOTS:
            octo_ui2.get_octo_ui_2_logger().exception(
                error, True, f"Failed to load run analysis plots - error: {error}"
            )
    except (ImportError, ModuleNotFoundError) as error:
        if DEBUG_PLOTS:
            octo_ui2.get_octo_ui_2_logger().exception(
                error, True, f"Failed to load run analysis plots - error: {error}"
            )
    except Exception as error:
        if DEBUG_PLOTS:
            octo_ui2.get_octo_ui_2_logger().exception(
                error, True, f"Failed to load run analysis plots - error: {error}"
            )
    return elements


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


async def get_run_analysis_plots(
    trading_mode,
    exchange,
    symbol,
    time_frame,
    analysis_settings,
    backtesting_id=None,
    optimizer_id=None,
    live_id=None,
    optimization_campaign=None,
):
    ctx = custom_context.Context.minimal(
        trading_mode,
        logging.get_logger(trading_mode.get_name()),
        exchange,
        symbol,
        backtesting_id,
        optimizer_id,
        optimization_campaign,
        analysis_settings,
        live_id=live_id,
    )
    ctx.time_frame = time_frame
    # TODO: replace with RunAnalysis Mode/Evaluators Factory
    # TODO add scripted RunAnalysis Mode which should be compatible with all trading modes
    if (
        hasattr(trading_mode, "BACKTESTING_SCRIPT_MODULE")
        and trading_mode.BACKTESTING_SCRIPT_MODULE
    ):
        return await trading_mode.get_script_from_module(
            trading_mode.BACKTESTING_SCRIPT_MODULE
        )(ctx)
    import tentacles.Meta.Keywords.matrix_library.RunAnalysis.AnalysisMode.default_run_analysis_mode.run_analysis_mode as run_analysis_mode

    return await run_analysis_mode.DefaultRunAnalysisMode().run_analysis_script(ctx)

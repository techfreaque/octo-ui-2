import octobot_commons.databases as databases
import tentacles.Services.Interfaces.web_interface.models.trading as trading_model
import octobot_commons.errors as commons_errors
import octobot_services.interfaces.util as interfaces_util
import tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 as octo_ui2
import octobot_commons.display as commons_display

try:
    from tentacles.RunAnalysis.BaseDataProvider.default_base_data_provider.base_data_provider import (
        CandlesLoadingError,
    )
    from tentacles.RunAnalysis.BaseDataProvider.default_base_data_provider.init_base_data import (
        LiveMetaDataNotInitializedError,
    )
except (ImportError, ModuleNotFoundError):

    class LiveMetaDataNotInitializedError(Exception):
        pass

    class CandlesLoadingError(Exception):
        pass


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
    except commons_errors.DatabaseNotFoundError as error:
        octo_ui2.get_octo_ui_2_logger().exception(
            error, True, f"Error when opening database: {error}"
        )
    except commons_errors.MissingExchangeDataError as error:
        octo_ui2.get_octo_ui_2_logger().exception(
            error, True, f"Error when opening database: {error}"
        )
        raise
    elements = elements.to_json()
    try:
        from octobot_trading.api.modes import get_run_analysis_plots

        elements2 = interfaces_util.run_in_bot_async_executor(
            get_run_analysis_plots(
                trading_mode,
                exchange_name,
                symbol,
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
        octo_ui2.get_octo_ui_2_logger().exception(
            error, True, f"Failed to load run analysis plots - error: {error}"
        )
    except LiveMetaDataNotInitializedError as error:
        octo_ui2.get_octo_ui_2_logger().exception(
            error, True, f"Failed to load run analysis plots - error: {error}"
        )
    except (ImportError, ModuleNotFoundError) as error:
        octo_ui2.get_octo_ui_2_logger().exception(
            error, True, f"Failed to load run analysis plots - error: {error}"
        )
    except Exception as error:
        octo_ui2.get_octo_ui_2_logger().exception(
            error, True, f"Failed to load run analysis plots - error: {error}"
        )
    return elements

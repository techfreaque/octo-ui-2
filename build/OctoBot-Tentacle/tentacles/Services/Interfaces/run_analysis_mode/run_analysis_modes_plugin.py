import os
import typing
import octobot_commons.logging as logging
import octobot_services.interfaces.util as interfaces_util
import tentacles.Meta.Keywords.matrix_library.RunAnalysis.AnalysisModes.default_run_analysis_mode.run_analysis_mode as run_analysis_mode
import tentacles.Meta.Keywords.matrix_library.RunAnalysis.RunAnalysisFactory.analysis_errors as analysis_errors
import tentacles.Services.Interfaces.web_interface.plugins as plugins
import tentacles.Services.Interfaces.run_analysis_mode.controllers.plotted_data as plotted_data
import octobot_commons.databases as databases
import octobot_commons.display as commons_display
import octobot_commons.errors as commons_errors
import octobot_trading.api as trading_api
import tentacles.Services.Interfaces.web_interface.models.trading as trading_model
import tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 as octo_ui2


class RunAnalysisModePlugin(plugins.AbstractWebInterfacePlugin):
    NAME = "run_analysis_modes"
    PLUGIN_ROOT_FOLDER = os.path.dirname(os.path.abspath(__file__))
    DEBUG_PLOTS = True
    RUN_ANALYSIS_MODE: run_analysis_mode.DefaultRunAnalysisMode = (
        run_analysis_mode.DefaultRunAnalysisMode
    )
    logger: logging.BotLogger = logging.get_logger("RunAnalysisModePlugin")

    def register_routes(self):
        plotted_data.register_plot_routes(self)

    @classmethod
    def is_configureable(cls):
        return True

    @classmethod
    def init_user_inputs_from_class(cls, inputs: dict) -> None:
        cls.RUN_ANALYSIS_MODE.init_user_inputs(
            cls=cls.RUN_ANALYSIS_MODE, analysis_mode_plugin=cls, inputs=inputs
        )

    @classmethod
    def get_and_execute_run_analysis_mode(
        cls,
        trading_mode_class,
        exchange_name: str,
        exchange_id: str,
        symbol: str,
        time_frame: str,
        backtesting_id: typing.Optional[int] = None,
        optimizer_id: typing.Optional[int] = None,
        live_id: typing.Optional[int] = None,
        optimization_campaign: typing.Optional[str] = None,
    ):
        config: dict = cls.get_tentacle_config()  # use bt or live settings
        try:
            return interfaces_util.run_in_bot_async_executor(
                cls.RUN_ANALYSIS_MODE.get_and_execute_run_analysis_mode(
                    trading_mode_class=trading_mode_class,
                    config=config,
                    exchange_name=exchange_name,
                    exchange_id=exchange_id,
                    symbol=symbol,
                    time_frame=time_frame,
                    backtesting_id=backtesting_id,
                    optimizer_id=optimizer_id,
                    live_id=live_id,
                    optimization_campaign=optimization_campaign,
                )
            )
        except Exception as error:
            if cls.DEBUG_PLOTS:
                cls.log_exception(error)
                # TODO remove at some point
            return interfaces_util.run_in_bot_async_executor(
                cls.get_old_version_plot_data(
                    exchange_id=exchange_id,
                    trading_mode=trading_mode_class,
                    exchange_name=exchange_name,
                    symbol=symbol,
                    time_frame=time_frame,
                    optimization_campaign_name=optimization_campaign,
                    backtesting_id=backtesting_id,
                    live_id=live_id,
                    optimizer_id=optimizer_id,
                )
            )
        return {}

    def get_tabs(self):
        return []

    @classmethod
    def log_exception(
        cls,
        exception,
        message="Failed to load run analysis plots",
    ):
        cls.logger.exception(exception, True, message + " - error: {error}")

    @classmethod
    async def get_old_version_plot_data(
        cls,
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
        try:
            trading_model.ensure_valid_exchange_id(exchange_id)
            elements = commons_display.display_translator_factory()
            database_manager = databases.RunDatabasesIdentifier(
                trading_mode,
                optimization_campaign_name=optimization_campaign_name,
                backtesting_id=backtesting_id,
                live_id=live_id,
                optimizer_id=optimizer_id,
            )
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
            cls.logger.exception(error, True, f"Error when opening database: {error}")
            return {}
        except commons_errors.MissingExchangeDataError as error:
            cls.logger.exception(error, True, f"Error when opening database: {error}")
            return {}
        return elements.to_json()

import os
import typing
import octobot_commons.logging as logging
import octobot_services.interfaces.util as interfaces_util
import tentacles.Meta.Keywords.matrix_library.basic_tentacles.RunAnalysis.AnalysisModes.default_run_analysis_mode.run_analysis_mode as run_analysis_mode
import tentacles.Meta.Keywords.matrix_library.basic_tentacles.RunAnalysis.RunAnalysisFactory.analysis_errors as analysis_errors
import tentacles.Services.Interfaces.web_interface.plugins as plugins
import tentacles.Services.Interfaces.run_analysis_mode.controllers.plotted_data as plotted_data


class RunAnalysisModePlugin(plugins.AbstractWebInterfacePlugin):
    NAME = "run_analysis_modes"
    PLUGIN_ROOT_FOLDER = os.path.dirname(os.path.abspath(__file__))
    DEBUG_PLOTS = True
    RUN_ANALYSIS_MODE: run_analysis_mode.DefaultRunAnalysisMode = (
        run_analysis_mode.DefaultRunAnalysisMode
    )

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
        except analysis_errors.CandlesLoadingError as error:
            if cls.DEBUG_PLOTS:
                cls.log_exception(error)

        except analysis_errors.LiveMetaDataNotInitializedError as error:
            if cls.DEBUG_PLOTS:
                cls.log_exception(error)

        except (ImportError, ModuleNotFoundError) as error:
            if cls.DEBUG_PLOTS:
                cls.log_exception(error)

        except Exception as error:
            if cls.DEBUG_PLOTS:
                cls.log_exception(error)
        return {}

    def get_tabs(self):
        return []

    @classmethod
    def log_exception(
        cls,
        exception,
        message="Failed to load run analysis plots",
    ):
        cls.get_logger().exception(exception, True, message + " - error: {error}")

    @staticmethod
    def get_logger(logger_name="RunAnalysisModePlugin"):
        return logging.get_logger(logger_name)

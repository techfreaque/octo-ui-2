import tentacles.Services.Interfaces.octo_ui2.utils.basic_utils as basic_utils
import octobot.strategy_optimizer.optimizer_settings as optimizer_settings
import tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 as octo_ui2_models
import octobot.api as octobot_api
import octobot_services.interfaces.util as interfaces_util
import tentacles.Services.Interfaces.web_interface.constants as web_interface_constants
import tentacles.Services.Interfaces.web_interface as web_interface_root


def get_optimizer_queue(trading_mode):
    return basic_utils.get_response(
        data=_get_optimizer_queue(trading_mode),
        message=f"Successfully fetched optimizer queue",
    )


def _get_optimizer_queue(trading_mode):
    return interfaces_util.run_in_bot_async_executor(
        octobot_api.get_design_strategy_optimizer_queue(trading_mode)
    )


def handle_queue_update_fail(error):
    octo_ui2_models.get_octo_ui_2_logger().exception(
        error, True, "Failed to update the optimizer queue"
    )
    return basic_utils.get_response(
        success=False, message=f"Failed to update optimizer queue, error: {error}"
    )


def update_optimizer_queue(request_data, trading_mode):
    interfaces_util.run_in_bot_async_executor(
        octobot_api.update_design_strategy_optimizer_queue(
            trading_mode, request_data["updatedQueue"]
        )
    )
    return basic_utils.get_response(
        message="Successfully updated the optimizer queue",
    )


def add_to_optimizer_queue(request_data, trading_mode):
    runs = interfaces_util.run_in_bot_async_executor(
        octobot_api.generate_and_save_strategy_optimizer_runs(
            trading_mode,
            interfaces_util.get_bot_api().get_edited_tentacles_config(),
            optimizer_settings.OptimizerSettings(request_data),
        )
    )
    if (
        optimizer := get_optimizer()
    ) is not None and octobot_api.is_optimizer_computing(optimizer):
        octobot_api.update_strategy_optimizer_total_runs(optimizer, runs)
    return basic_utils.get_response(
        message=f"Successfully added {len(runs) if runs else ''} runs"
    )


def get_optimizer():
    return web_interface_root.WebInterface.tools[
        web_interface_constants.BOT_TOOLS_STRATEGY_OPTIMIZER
    ]

import tentacles.Meta.Keywords.scripting_library.backtesting as backtesting
import octobot_services.interfaces.util as interfaces_util
import tentacles.Services.Interfaces.web_interface.models as models


def get_backtesting_run_data(campaigns_to_load):
    trading_mode = models.get_config_activated_trading_mode()
    campaign_names, metadata = interfaces_util.run_in_bot_async_executor(
        backtesting.read_metadata(
            runs_to_load_settings=campaigns_to_load,
            trading_mode=trading_mode,
            include_optimizer_runs=True,
        )
    )
    return {"data": metadata, "campaigns": campaign_names}


# def get_live_run_data(live_id):
#     trading_mode = models.get_config_activated_trading_mode()
#     metadata = interfaces_util.run_in_bot_async_executor(
#         backtesting.read_bot_recording_runs_metadata(
#             trading_mode=trading_mode,
#             live_id=live_id,
#         )
#     )
#     return {"data": metadata}

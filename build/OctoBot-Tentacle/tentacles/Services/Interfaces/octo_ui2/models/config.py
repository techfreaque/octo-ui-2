import tentacles.Services.Interfaces.octo_ui2.octo_ui2_plugin as octo_ui2_plugin
import octobot_services.interfaces.util as interfaces_util
import octobot_tentacles_manager.api as tentacles_manager_api


def save_ui_config(config_update):
    tentacles_manager_api.update_tentacle_config(
        interfaces_util.get_edited_tentacles_config(),
        octo_ui2_plugin.OctoUi2Plugin,
        config_update,
    )
    return {"success": "UI configuration updated"}

def get_ui_config():
    return octo_ui2_plugin.OctoUi2Plugin.get_ui_config()
    
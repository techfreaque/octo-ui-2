import tentacles.Services.Interfaces.octo_ui2.octo_ui2_plugin as octo_ui2_plugin
import octobot_services.interfaces.util as interfaces_util
import octobot_tentacles_manager.api as tentacles_manager_api


def save_ui_config(config_update):
    try:
        tentacles_manager_api.update_tentacle_config(
            interfaces_util.get_edited_tentacles_config(),
            octo_ui2_plugin.OctoUi2Plugin,
            config_update,
            keep_existing=False,
        )
    except:
        # TODO remove when octoboto supports keep_existing
        tentacles_manager_api.update_tentacle_config(
            interfaces_util.get_edited_tentacles_config(),
            octo_ui2_plugin.OctoUi2Plugin,
            config_update,
        )
    return {"success": "UI configuration updated"}


def get_ui_config():
    return octo_ui2_plugin.OctoUi2Plugin.get_ui_config()

def update_profile(profile_id, json_profile):
    config = interfaces_util.get_edited_config(dict_only=False)
    profile = config.profile_by_id[profile_id]
    new_name = json_profile.get("name", profile.name)
    renamed = profile.name != new_name
    profile.name = new_name
    profile.description = json_profile.get("description", profile.description)
    profile.avatar = json_profile.get("avatar", profile.avatar)
    profile.validate_and_save_config()
    if renamed:
        profile.rename_folder(new_name.replace(" ", "_"), False)
    return True, "Profile updated"
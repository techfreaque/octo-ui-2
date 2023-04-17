import octobot_services.interfaces.util as interfaces_util
import octobot_tentacles_manager.api as tentacles_manager_api


def save_ui_config(config_update, plugin_class, keep_existing=False):
    tentacles_manager_api.update_tentacle_config(
        interfaces_util.get_edited_tentacles_config(),
        plugin_class,
        config_update,
        keep_existing=keep_existing,
    )

    return {"success": "UI configuration updated"}


def get_ui_config(plugin_class):
    return plugin_class.get_ui_config()

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
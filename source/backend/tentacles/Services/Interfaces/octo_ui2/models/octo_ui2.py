import octobot_commons.os_util as os_util


CORS_ENABLED = os_util.parse_boolean_environment_var("CORS_MODE_ENABLED", "False")
DEV_MODE_ENABLED = os_util.parse_boolean_environment_var(
    "API_DEV_MODE_ENABLED", "False"
)
SHARE_YOUR_OCOBOT = os_util.parse_boolean_environment_var(
    "SHARE_YOUR_OCOBOT", "False"
)


def dev_mode_is_on():
    return DEV_MODE_ENABLED


def import_cross_origin_if_enabled():
    if CORS_ENABLED:
        from flask_cors import cross_origin

        return cross_origin

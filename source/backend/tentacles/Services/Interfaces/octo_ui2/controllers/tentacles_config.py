import flask
import re
import tentacles.Services.Interfaces.octo_ui2.models.config as config
import tentacles.Services.Interfaces.web_interface.login as login
import tentacles.Services.Interfaces.octo_ui2.utils.basic_utils as basic_utils
import tentacles.Services.Interfaces.web_interface.util as util

import tentacles.Services.Interfaces.web_interface.models as models
from tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 import SHARE_YOUR_OCOBOT
from tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 import (
    import_cross_origin_if_enabled,
)


def register_tentacles_config_routes(plugin):
    route = "/tentacles_config"
    methods = ["POST"]

    cross_origin = import_cross_origin_if_enabled()
    if SHARE_YOUR_OCOBOT:

        @plugin.blueprint.route(route, methods=methods)
        @cross_origin(origins="*")
        def tentacles_config():
            return _tentacles_config()

    elif cross_origin:

        @plugin.blueprint.route(route, methods=methods)
        @cross_origin(origins="*")
        @login.login_required_when_activated
        def tentacles_config():
            return _tentacles_config()

    else:

        @plugin.blueprint.route(route, methods=methods)
        @login.login_required_when_activated
        def tentacles_config():
            return _tentacles_config()

    def _tentacles_config():
        request_data = flask.request.get_json()
        tentacle_configs = {}
        error = ""
        for dirty_tentacle_name in request_data.get("tentacles", []):
            clean_tentacle_name = re.sub(
                r"[/\\?%*:|\"<>\x7F\x00-\x1F]", "-", dirty_tentacle_name
            )
            try:
                this_tentacle = models.get_tentacle_config_and_edit_display(
                    clean_tentacle_name
                )
                tentacle_configs[clean_tentacle_name] = this_tentacle[
                    "displayed_elements"
                ]["data"]["elements"][0]
                if not tentacle_configs[clean_tentacle_name]["config"]:
                    tentacle_configs[clean_tentacle_name]["config"] = this_tentacle[
                        "config"
                    ]
            except IndexError:
                basic_utils.get_octo_ui_2_logger().error(
                    f"Failed to load config for {clean_tentacle_name}"
                )
            except Exception as error:
                basic_utils.get_octo_ui_2_logger().exception(
                    error, True, f"Failed to load config for {clean_tentacle_name}"
                )
        return basic_utils.get_response(
            success=True,
            data=tentacle_configs,
            message="Successfully fetched tentacles config",
        )

    route = "/update_profile_info"
    methods = ["POST"]
    if cross_origin := import_cross_origin_if_enabled():

        @plugin.blueprint.route(route, methods=methods)
        @cross_origin(origins="*")
        @login.login_required_when_activated
        def update_profiles_info():
            return _update_profiles_info()

    else:

        @plugin.blueprint.route(route, methods=methods)
        @login.login_required_when_activated
        def update_profiles_info():
            return _update_profiles_info()

    def _update_profiles_info():
        data = flask.request.get_json()
        success, err = config.update_profile(flask.request.get_json()["id"], data)
        if not success:
            return util.get_rest_reply(flask.jsonify(str(err)), code=400)
        return util.get_rest_reply(flask.jsonify(data))

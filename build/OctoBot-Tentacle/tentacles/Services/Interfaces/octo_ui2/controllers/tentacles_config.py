import flask
import tentacles.Services.Interfaces.web_interface.login as login
import tentacles.Services.Interfaces.octo_ui2.utils.basic_utils as basic_utils
import tentacles.Services.Interfaces.octo_ui2.models as octo_ui2_models

import tentacles.Services.Interfaces.web_interface.models as models
from tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 import (
    import_cross_origin_if_enabled,
)


def register_tentacles_config_routes(plugin):
    route = "/tentacles_config"
    methods = ["POST"]
    if cross_origin := import_cross_origin_if_enabled():

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
        for tentacle_name in request_data.get("tentacles", []):
            try:
                this_tentacle = models.get_tentacle_config_and_edit_display(
                    tentacle_name
                )
                tentacle_configs[tentacle_name] = this_tentacle['displayed_elements']['data']['elements'][0]
            except IndexError:
                octo_ui2_models.get_octo_ui_2_logger().error(
                    f"Failed to load config for {tentacle_name}"
                )
            except Exception as error:
                octo_ui2_models.get_octo_ui_2_logger().exception(
                    error, True, f"Failed to load config for {tentacle_name}"
                )
        return basic_utils.get_response(
            success=True,
            data=tentacle_configs,
            message="Successfully fetched tentacles config",
        )

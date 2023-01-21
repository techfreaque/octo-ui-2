from tentacles.Services.Interfaces.octo_ui2.models import app_store as app_store_models
import tentacles.Services.Interfaces.web_interface.login as login
from tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 import (
    import_cross_origin_if_enabled,
    dev_mode_is_on,
)


def register_appstore_routes(plugin):
    route = "/app-store"
    if cross_origin := import_cross_origin_if_enabled():
        if dev_mode_is_on:

            @plugin.blueprint.route(route)
            @cross_origin(origins="*")
            def app_store():
                return _app_store()

        else:

            @plugin.blueprint.route(route)
            @cross_origin(origins="*")
            @login.login_required_when_activated
            def app_store():
                return _app_store()

    else:

        @plugin.blueprint.route(route)
        @login.login_required_when_activated
        def app_store():
            return _app_store()

    def _app_store():
        return {
            "success": True,
            "message": "Successfully fetched package manager data",
            "data": {
                "tentacles": app_store_models.get_installed_tentacles_modules_dict(),
                "available_apps": app_store_models.fetch_available_apps_from_repos(),
            },
        }

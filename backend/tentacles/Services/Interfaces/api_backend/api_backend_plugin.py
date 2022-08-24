import os
import tentacles.Services.Interfaces.web_interface.plugins as plugins
import tentacles.Services.Interfaces.web_interface.models as models
import tentacles.Services.Interfaces.web_interface.enums as web_enums
import tentacles.Services.Interfaces.api_backend.controllers as controllers


class ApiBackendPlugin(plugins.AbstractWebInterfacePlugin):
    NAME = "api_backend"
    PLUGIN_ROOT_FOLDER = os.path.dirname(os.path.abspath(__file__))

    def register_routes(self):
        controllers.register_api_backend_routes(self)

    def get_tabs(self):
        return [
            models.WebInterfaceTab(
                "api_backend",
                "api_backend.bot_info",
                "API Backend",
                web_enums.TabsLocation.START
            )
        ]

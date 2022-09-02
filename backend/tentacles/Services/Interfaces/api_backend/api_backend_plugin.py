import os

import tentacles.Services.Interfaces.web_interface.plugins as plugins
import tentacles.Services.Interfaces.api_backend.controllers as controllers
import tentacles.Services.Interfaces.web_interface.models as models
import tentacles.Services.Interfaces.web_interface.enums as web_enums


class ApiBackendPlugin(plugins.AbstractWebInterfacePlugin):
    NAME = "api_backend"
    PLUGIN_ROOT_FOLDER = os.path.dirname(os.path.abspath(__file__))

    def register_routes(self):
        controllers.frontend.register_frontend_route(self)
        controllers.bot_info.register_bot_info_routes(self)
        controllers.commands.register_commands_routes(self)
        controllers.plot_data.register_plot_data_routes(self)
        controllers.configuration.register_bot_config_routes(self)
        controllers.portfolio.register_portfolio_routes(self)

    def get_tabs(self):
        return [
            models.WebInterfaceTab(
                "api_backend",
                "api_backend.home",
                "Experimental",
                web_enums.TabsLocation.START
            )

import os
import tentacles.Services.Interfaces.web_interface.plugins as plugins
import tentacles.Services.Interfaces.api_backend.controllers as controllers


class ApiBackendPlugin(plugins.AbstractWebInterfacePlugin):
    NAME = "api_backend"
    PLUGIN_ROOT_FOLDER = os.path.dirname(os.path.abspath(__file__))

    def register_routes(self):
        controllers.bot_info.register_bot_info_routes(self)
        controllers.commands.register_commands_routes(self)
        controllers.plot_data.register_plot_data_routes(self)
        controllers.configuration.register_bot_config_routes(self)


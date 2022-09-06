import os

import tentacles.Services.Interfaces.web_interface.plugins as plugins
import tentacles.Services.Interfaces.web_interface.models as models
import tentacles.Services.Interfaces.web_interface.enums as web_enums
from .controllers import frontend, configuration, portfolio, plot_data, commands, bot_info, app_store


class OctoUi2Plugin(plugins.AbstractWebInterfacePlugin):
    NAME = "octo_ui2"
    PLUGIN_ROOT_FOLDER = os.path.dirname(os.path.abspath(__file__))

    def register_routes(self):
        frontend.register_frontend_route(self)
        bot_info.register_bot_info_routes(self)
        commands.register_commands_routes(self)
        plot_data.register_plot_data_routes(self)
        configuration.register_bot_config_routes(self)
        portfolio.register_portfolio_routes(self)
        app_store.register_appstore_routes(self)

    def get_tabs(self):
        return [
            models.WebInterfaceTab(
                "octo_ui2",
                "octo_ui2.home",
                "Experimental",
                web_enums.TabsLocation.START
            )
        ]

#     @classmethod
#     def get_strategy_design_config(cls, tentacles_setup_config=None,
#                                    default_name=commons_constants.DEFAULT_CAMPAIGN):
#         config = tentacles_manager_api.get_tentacle_config(tentacles_setup_config or
#                                                            interfaces_util.get_edited_tentacles_config(), cls)
#         # set default values
#         campaign_config = config.get(octobot_constants.OPTIMIZATION_CAMPAIGN_KEY, {})
#         # use profile name as default campaign name if unset
#         profile_name = default_name or interfaces_util.get_edited_config(dict_only=False).profile.name
#         campaign_config[commons_constants.CONFIG_NAME] = campaign_config.get(commons_constants.CONFIG_NAME, profile_name)
#         config[octobot_constants.OPTIMIZATION_CAMPAIGN_KEY] = campaign_config
#         config[octobot_constants.CURRENT_BOT_RECORDING_ID] = config.get(octobot_constants.CURRENT_BOT_RECORDING_ID, 1)
#         return config
# #
#     @classmethod
#     def optimization_campaign_name_proxy(cls, tentacles_setup_config=None):
#         return cls.get_strategy_design_config(tentacles_setup_config)[octobot_constants.OPTIMIZATION_CAMPAIGN_KEY] \
#              [commons_constants.CONFIG_NAME]
#
#
# # when loaded, use this plugin optimization campaign name for campaign names
# optimization_campaign.register_optimization_campaign_name_proxy(
#     ApiBackendPlugin.optimization_campaign_name_proxy
# )

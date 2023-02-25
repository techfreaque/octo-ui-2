import os
import tentacles.Services.Interfaces.web_interface.plugins as plugins
import tentacles.Services.Interfaces.web_interface.models as models
import tentacles.Services.Interfaces.web_interface.enums as web_enums
from .controllers import (
    frontend,
    configuration,
    portfolio,
    plot_data,
    bot_info,
    app_store,
    run_data,
    optimizer,
    semi_auto_trade,
    trading,
    daemons,
    tentacles_config,
)
import octobot_services.interfaces.util as interfaces_util
import octobot_trading.util as trading_util
import octobot_tentacles_manager.api as tentacles_manager_api
import octobot_commons.constants as commons_constants


class OctoUi2Plugin(plugins.AbstractWebInterfacePlugin):
    NAME = "octo_ui2"
    PLUGIN_ROOT_FOLDER = os.path.dirname(os.path.abspath(__file__))

    def register_routes(self):
        frontend.register_frontend_route(self)
        bot_info.register_bot_info_routes(self)
        plot_data.register_plot_data_routes(self)
        configuration.register_bot_config_routes(self)
        portfolio.register_portfolio_routes(self)
        app_store.register_appstore_routes(self)
        run_data.register_run_data_routes(self)
        semi_auto_trade.register_semi_auto_trade_routes(self)
        optimizer.register_optimizer_routes(self)
        trading.register_cancel_orders_routes(self)
        tentacles_config.register_tentacles_config_routes(self)
        daemons.register_daemons_routes(self)

    def get_tabs(self):
        return [
            models.WebInterfaceTab(
                "octo_ui2",
                "octo_ui2.home",
                "Octo UI 2",
                web_enums.TabsLocation.START,
            )
        ]

    @classmethod
    def get_ui_config(
        cls,
        tentacles_setup_config=None,
    ):
        config = tentacles_manager_api.get_tentacle_config(
            tentacles_setup_config or interfaces_util.get_edited_tentacles_config(), cls
        )
        config[
            commons_constants.CONFIG_CURRENT_LIVE_ID
        ] = trading_util.get_current_bot_live_id(interfaces_util.get_edited_config())
        return config

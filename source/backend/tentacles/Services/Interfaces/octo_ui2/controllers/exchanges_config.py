import flask
from tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 import (
    import_cross_origin_if_enabled,
)

import octobot_commons.constants as commons_constants
import tentacles.Services.Interfaces.web_interface.login as login
import tentacles.Services.Interfaces.web_interface.models as models
import octobot_trading.api as trading_api
import octobot_services.interfaces.util as interfaces_util

from tentacles.Services.Interfaces.octo_ui2.utils import basic_utils


def register_exchanges_routes(plugin):
    route = "/exchanges-info"
    if cross_origin := import_cross_origin_if_enabled():

        @plugin.blueprint.route(route)
        @cross_origin(origins="*")
        @login.login_required_when_activated
        def exchanges_info():
            return _exchanges_info()

    else:

        @plugin.blueprint.route(route)
        @login.login_required_when_activated
        def exchanges_info():
            return _exchanges_info()

    def _exchanges_info():
        selected_profile = flask.request.args.get("select", None)
        next_url = flask.request.args.get("next", None)
        if (
            selected_profile is not None
            and selected_profile != models.get_current_profile().profile_id
        ):
            models.select_profile(selected_profile)
            current_profile = models.get_current_profile()
            flask.flash(f"Switched to {current_profile.name} profile", "success")
        else:
            current_profile = models.get_current_profile()
        if next_url is not None:
            return flask.redirect(next_url)
        display_config = interfaces_util.get_edited_config()

        config_exchanges = display_config[commons_constants.CONFIG_EXCHANGES]
        enabled_exchanges = trading_api.get_enabled_exchanges_names(display_config)
        # exchange_details = models.get_exchanges_details(config_exchanges)

        symbols_by_exchanges = {
            exchange: sorted(models.get_symbol_list([exchange]))
            for exchange in (enabled_exchanges or config_exchanges)
        }

        return basic_utils.get_response(
            data={
                "config_exchanges": config_exchanges,
                "config_symbols": models.format_config_symbols(display_config),
                "symbols_by_exchanges": symbols_by_exchanges,
                # "symbol_list": sorted(
                #     models.get_symbol_list(enabled_exchanges or config_exchanges)
                # ),
                "full_symbol_list": models.get_all_symbols_list(),
                # "exchanges_details": exchange_details,
            },
        )

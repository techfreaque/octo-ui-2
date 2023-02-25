import octobot_services.interfaces as interfaces
from tentacles.Meta.Keywords.matrix_library.matrix_pro_keywords.managed_order_pro.daemons.ping_pong.ping_pong_storage import (
    get_all_ping_pong_data_as_dict,
)
from tentacles.Meta.Keywords.matrix_library.matrix_pro_keywords.managed_order_pro.daemons.ping_pong.ping_pong_storage.storage import reset_all_ping_pong_data
from tentacles.Services.Interfaces.octo_ui2.utils import basic_utils

import tentacles.Services.Interfaces.web_interface.login as login
from tentacles.Services.Interfaces.octo_ui2.models.octo_ui2 import (
    import_cross_origin_if_enabled,
)


def register_daemons_routes(plugin):
    route = "/daemons"
    methods = ["POST", "GET"]

    if cross_origin := import_cross_origin_if_enabled():

        @plugin.blueprint.route(route, methods=methods)
        @cross_origin(origins="*")
        @login.login_required_when_activated
        def daemons():
            return _daemons()

    else:

        @plugin.blueprint.route(route, methods=methods)
        @login.login_required_when_activated
        def daemons():
            return _daemons()


    def _daemons():
        daemons_data = {}
        exchange_managers = interfaces.AbstractInterface.get_exchange_managers()
        for exchange_manager in exchange_managers:
            if exchange_manager.id not in daemons_data:
                daemons_data[exchange_manager.id] = {}
            daemons_data[exchange_manager.id]["ping_pong"] = get_all_ping_pong_data_as_dict(
                exchange_manager
            )
        return basic_utils.get_response(
                success=True, data=daemons_data
            )

    route = "/daemons/reset"
    methods = ["POST", "GET"]

    if cross_origin := import_cross_origin_if_enabled():

        @plugin.blueprint.route(route, methods=methods)
        @cross_origin(origins="*")
        @login.login_required_when_activated
        def reset_daemons():
            return _reset_daemons()

    else:

        @plugin.blueprint.route(route, methods=methods)
        @login.login_required_when_activated
        def reset_daemons():
            return _reset_daemons()


    def _reset_daemons():
        exchange_managers = interfaces.AbstractInterface.get_exchange_managers()
        for exchange_manager in exchange_managers:
            reset_all_ping_pong_data(exchange_manager)
        return basic_utils.get_response(
                success=True,
            )
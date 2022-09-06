from flask_cors import cross_origin
import tentacles.Services.Interfaces.web_interface.models as models
from tentacles.Services.Interfaces.octo_ui2.models import app_store as app_store_models
from tentacles.Services.Interfaces.web_interface.login import login_required_when_activated


def register_appstore_routes(plugin):
    @plugin.blueprint.route("/app-store")

    @cross_origin(origins="*")
    @login_required_when_activated
    def app_store():
        return {"tentacles": models.get_tentacles_dict(),
                "available_apps": app_store_models.fetch_available_apps_from_repos()}

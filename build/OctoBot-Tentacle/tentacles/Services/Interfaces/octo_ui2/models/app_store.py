import json

import octobot_tentacles_manager.loaders as loaders
import requests


app_store_repos = [
    {
        "name": "Matrix-Repo",
        "description": "This is a repo full of OctoBot apps",
        "url": "https://raw.githubusercontent.com/techfreaque/octo-ui-2/main/releases/octo_repo.json",
    },
    # {
    #     "name": "Another Package without a Repo",
    #     "description": "This is a repo full of OctoBot apps",
    #     "apps": [
    #         {
    #             "name": "Sample Octobot Tentacle",
    #             "description": "This is a sample OctoBot app that cant be installed",
    #             "versions": [{"version": "1.0.0", "url": "https://google.com"}],
    #             "categories": ["UI", "Strategies"],
    #             "tentacle_package_name": "TentaclePackageName",
    #         },
    #     ]
    # },
]


def fetch_app_list_from_repo(repo):
    try:
        request = requests.get(repo["url"])
        repo_content = json.loads(request.text)
        apps = repo_content.get("apps", [])
        return apps
    except:
        print(f"Invalid URL or unsupported format for repo {str(repo)}")
        return []


def fetch_available_apps_from_repos():
    app_store_data = {"categories": {}, "apps": []}
    for repo in app_store_repos:
        app_list = fetch_app_list_from_repo(repo) if "url" in repo else repo["apps"]
        for app in app_list:
            try:
                app_store_data["apps"].append({
                    "name": app["name"],
                    "tentacle_package_name": app["tentacle_package_name"],
                    "description": app["description"],
                    "versions": app["versions"],
                    "categories": app["categories"],
                    "installed": True,
                    "repo": repo["name"]
                })
                for category in app["categories"]:
                    if category not in app_store_data["categories"]:
                        app_store_data["categories"][category] = {"title": category}
            except KeyError:
                print(f"App Store Error: The app "
                                  f"({app['name'] if 'name' in app else 'no name provided'}) "
                                  f"in the repo ({repo['name']}) has missing informations")
                pass
    return app_store_data


def get_installed_tentacles_modules_dict() -> dict:
    return {_tentacle.name: {
        "name": _tentacle.name,
        "in_dev_mode": _tentacle.in_dev_mode,
        "ARTIFACT_NAME": _tentacle.ARTIFACT_NAME,
        "metadata": _tentacle.metadata,
        "origin_package": _tentacle.origin_package,
        "origin_repository": _tentacle.origin_repository,
        "tentacle_class_names": _tentacle.tentacle_class_names,
        "tentacle_group": _tentacle.tentacle_group,
        "tentacle_module_path": _tentacle.tentacle_module_path,
        "tentacle_path": _tentacle.tentacle_path,
        "tentacle_root_path": _tentacle.tentacle_root_path,
        "tentacle_root_type": _tentacle.tentacle_root_type,
        # "tentacle_type": _tentacle.tentacle_type,
        "tentacles_requirements": _tentacle.tentacles_requirements,
        "version": _tentacle.version
    } for _tentacle in loaders.get_tentacle_classes().values()}

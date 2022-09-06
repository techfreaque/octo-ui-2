app_store_repos = [
    {
        "name": "Matrix-Repo",
        "description": "This is a repo full of OctoBot apps",
        "url": "https://github.com/techfreaque/OctoBot-Tentacles/blob/master/okteto-stack.yaml?raw=true",
    },
    {
        "name": "Another Repo without a server",
        "description": "This is a repo full of OctoBot apps",
        "apps": [
            {
                "name": "Sample Octobot Tentacle",
                "description": "This is a sample OctoBot app",
                "url": "https://github.com/techfreaque/OctoBot-Tentacles/blob/master/okteto-stack.yaml?raw=true",
                "categories": ["UI", "Strategies"],
                "tentacle_package_name": "TentaclePackageName",
            },
            {
                "name": "A nice Sample 2 Octobot Tentacle",
                "description": "This is a sample OctoBot app",
                "url": "https://github.com/techfreaque/OctoBot-Tentacles/blob/master/okteto-stack.yaml?raw=true",
                "categories": ["UI", "Strategies"],
                "tentacle_package_name": "TentaclePackageName",
            },
            {
                "name": "Sample Octobot Tentacle",
                "description": "This is a sample OctoBot app",
                "url": "https://github.com/techfreaque/OctoBot-Tentacles/blob/master/okteto-stack.yaml?raw=true",
                "categories": ["UI", "Strategies"],
                "tentacle_package_name": "TentaclePackageName",
            },
            {
                "name": "Sample Octobot Tentacle",
                "description": "This is a sample OctoBot app",
                "url": "https://github.com/techfreaque/OctoBot-Tentacles/blob/master/okteto-stack.yaml?raw=true",
                "categories": ["Stuff", "Things"],
                "tentacle_package_name": "TentaclePackageName",
            },
        ]
    },
]


def fetch_app_list_from_repo(repo):
    apps = [
        {
            "name": "Another Sample Octobot Tentacle",
            "description": "This is a sample OctoBot app",
            "url": "https://github.com/techfreaque/OctoBot-Tentacles/blob/master/okteto-stack.yaml?raw=true",
            "categories": ["UI", "Strategies"],
            "tentacle_package_name": "TentaclePackageName",
        },
        {
            "name": "Sample Octobot Tentacle",
            "description": "This is a sample OctoBot app",
            "url": "https://github.com/techfreaque/OctoBot-Tentacles/blob/master/okteto-stack.yaml?raw=true",
            "categories": ["UI", "Strategies"],
            "tentacle_package_name": "TentaclePackageName",
        },
        {
            "name": "Sample Octobot Tentacle",
            "description": "This is a sample OctoBot app",
            "url": "https://github.com/techfreaque/OctoBot-Tentacles/blob/master/okteto-stack.yaml?raw=true",
            "categories": ["UI", "Strategies"],
            "tentacle_package_name": "TentaclePackageName",
        },
        {
            "name": "Sample Octobot Tentacle",
            "description": "This is a sample OctoBot app",
            "url": "https://github.com/techfreaque/OctoBot-Tentacles/blob/master/okteto-stack.yaml?raw=true",
            "categories": ["Stuff", "Things"],
            "tentacle_package_name": "TentaclePackageName",
        },
    ]
    return apps


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
                    "url": app["url"],
                    "categories": app["categories"],
                    "installed": True,
                    "repo": repo["name"]
                })
                for category in app["categories"]:
                    if category not in app_store_data["categories"]:
                        app_store_data["categories"][category] = {"title": category}
            except KeyError:
                # log.error(f"App Store Error: The app "
                #                   f"({app['name'] if 'name' in app else 'no name provided'}) "
                #                   f"in the repo ({repo['name']}) has missing informations")
                pass
    return app_store_data

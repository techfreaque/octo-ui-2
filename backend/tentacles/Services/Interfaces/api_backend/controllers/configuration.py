import flask
from flask_cors import cross_origin
import tentacles.Services.Interfaces.web_interface.login as login
import octobot_services.interfaces.util as interfaces_util
import tentacles.Services.Interfaces.web_interface.models as models


def register_bot_config_routes(plugin):
    @plugin.blueprint.route("/bot-config")
    @cross_origin(origins="*")
    @login.login_required_when_activated
    def bot_config():
        if flask.request.method == "GET":
            display_config = interfaces_util.get_edited_config()
            current_profile = models.get_current_profile()

            profiles = models.get_profiles()

            requested_config_keys = flask.request.args['config_keys'].split(",")
            configs = {
                "profile": {
                    "profile_info": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "id": {
                                    "type": "string"
                                },
                                "name": {
                                    "type": "string"
                                },
                                "description": {
                                    "type": "string"
                                },
                                "avatar": {
                                    "type": "string"
                                },
                                "read_only": {
                                    "type": "boolean"
                                }
                            }
                        },
                        "data": {
                            "profile": {
                                "avatar": current_profile.avatar,
                                "avatar_path": current_profile.avatar,
                                "description": current_profile.description,
                                "name": current_profile.name,
                                "path": current_profile.path,
                                "read_only": current_profile.read_only,
                                "profile_id": current_profile.profile_id,
                            },
                        }
                    },
                    "crypto-currencies": {
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "object",
                                "properties": {
                                    "enabled": {
                                        "type": "boolean"
                                    },
                                    "pairs": {
                                        "type": "array",
                                        "uniqueItems": True,
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "quote": {
                                        "type": "string"
                                    },
                                    "add": {
                                        "type": "array",
                                        "uniqueItems": True,
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }

                            }
                        },
                        "data": current_profile.config["crypto-currencies"],
                    },
                    "exchanges": {
                        "schema": {
                            "type": "object",
                            "additionalProperties": {

                                "type": "object",
                                "properties": {
                                    "enabled": {
                                        "type": "boolean"
                                    },
                                    "exchange-type": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "enabled"
                                ]

                            }
                        },
                        "data": current_profile.config["exchanges"],
                    },
                    "trader": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "enabled": {
                                    "type": "boolean"
                                },
                                "load-trade-history": {
                                    "type": "boolean"
                                }
                            },
                            "required": [
                                "enabled"
                            ]
                        },
                        "data": current_profile.config["trader"],
                    },
                    "trader-simulator": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "enabled": {
                                    "type": "boolean"
                                },
                                "fees": {
                                    "type": "object",
                                    "properties": {
                                        "maker": {
                                            "type": "number",
                                            "minimum": -100,
                                            "maximum": 100
                                        },
                                        "taker": {
                                            "type": "number",
                                            "minimum": -100,
                                            "maximum": 100
                                        }
                                    },
                                    "required": [
                                        "maker",
                                        "taker"
                                    ]
                                },
                                "starting-portfolio": {
                                    "type": "object",
                                    "additionalProperties": {"type": "number", "minimum": 0},
                                }
                            },
                            "required": [
                                "fees",
                                "starting-portfolio"
                            ]
                        },
                        "data": current_profile.config["trader-simulator"],
                    },
                    "trading": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "reference-market": {
                                    "type": "string"
                                },
                                "risk": {
                                    "type": "number",
                                    "minimum": 0,
                                    "maximum": 1
                                },
                                "current-bot-recording-id": {
                                    "type": "integer",
                                    "minimum": 1
                                }
                            },
                            "required": [
                                "reference-market",
                                "risk"
                            ]
                        },
                        "data": current_profile.config["trading"],
                    }
                },
            }
            configs_to_send = {}
            for key in requested_config_keys:
                try:
                    configs_to_send[key] = configs[key]
                except KeyError:
                    configs_to_send[key] = {}
            return configs_to_send

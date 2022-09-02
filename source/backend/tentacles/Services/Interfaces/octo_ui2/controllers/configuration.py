from flask_cors import cross_origin
import flask
import octobot_commons.constants as commons_constants
import tentacles.Services.Interfaces.web_interface.login as login
import tentacles.Services.Interfaces.web_interface.models as models
import tentacles.Services.Interfaces.web_interface.util as util
import octobot_backtesting.api as backtesting_api
import octobot_services.interfaces.util as interfaces_util


def register_bot_config_routes(plugin):
    @plugin.blueprint.route("/bot-config")
    @cross_origin(origins="*")
    @login.login_required_when_activated
    def bot_config():
        if flask.request.method == "GET":
            display_config = interfaces_util.get_edited_config()
            current_profile = models.get_current_profile()
            profiles = models.get_profiles()
            active_tentacles = models.get_profiles_activated_tentacles({"current_profile": current_profile})

            requested_config_keys = flask.request.args['config_keys'].split(",")
            configs = {
                "configs": {
                    "type": "object",
                    "Title": "Bot Config",
                    "properties": {
                        "profile": {
                            "type": "object",
                            "title": "profile",
                            "properties": {
                                "profile_info": {
                                    "type": "object",
                                    "title": "Profile Info",
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
                                    },

                                },
                                "crypto-currencies": {
                                    "type": "object",
                                    "title": "Crypto Currencies",
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

                                    },
                                },
                                "exchanges": {
                                    "type": "object",
                                    "title": "Exchanges",
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

                                    },
                                },
                                "trader": {
                                    "type": "object",
                                    "title": "Trader",
                                    "properties": {
                                        "enabled": {
                                            "type": "boolean"
                                        },
                                        "load-trade-history": {
                                            "type": "boolean"
                                        }
                                    }
                                },
                                "trader-simulator": {
                                    "type": "object",
                                    "title": "Trader Simulator",
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
                                    ],
                                },
                                "trading": {
                                    "type": "object",
                                    "title": "Trading",
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
                                    ],
                                }
                            }
                        },
                        "evaluator_config": {},
                        "tentacle_configs": {},
                    },
                },
                "data": {
                    "profile": {
                        "profile_info": {
                            "avatar": current_profile.avatar,
                            "avatar_path": current_profile.avatar,
                            "description": current_profile.description,
                            "name": current_profile.name,
                            "path": current_profile.path,
                            "read_only": current_profile.read_only,
                            "profile_id": current_profile.profile_id,
                        },
                        "crypto-currencies": current_profile.config["crypto-currencies"],
                        "exchanges": current_profile.config["exchanges"],
                        "trader": current_profile.config["trader"],
                        "trader-simulator": current_profile.config["trader-simulator"],
                        "trading": current_profile.config["trading"],
                    }
                }
            }
            configs_to_send = {}
            # for key in requested_config_keys:
            #     try:
            #         paths = key.split("/")
            #         configs_to_send[paths[0]] = configs[paths[0]]
            #     except KeyError:
            #         configs_to_send[key] = {}
            media_url = flask.url_for("tentacle_media", _external=True)

            display_config = interfaces_util.get_edited_config()

            missing_tentacles = set()
            profiles = models.get_profiles()
            config_exchanges = display_config[commons_constants.CONFIG_EXCHANGES]

            profiles_activated_tentacles = models.get_profiles_activated_tentacles(profiles),

            config_trading = display_config[commons_constants.CONFIG_TRADING],
            config_trader = display_config[commons_constants.CONFIG_TRADER],
            config_trader_simulator = display_config[commons_constants.CONFIG_SIMULATOR],
            config_symbols = models.format_config_symbols(display_config),
            config_reference_market = display_config[commons_constants.CONFIG_TRADING][
                                          commons_constants.CONFIG_TRADER_REFERENCE_MARKET],

            real_trader_activated = interfaces_util.has_real_and_or_simulated_traders()[0],

            symbol_list = sorted(models.get_symbol_list([exchange
                                                         for exchange in display_config[
                                                             commons_constants.CONFIG_EXCHANGES]])),
            full_symbol_list = models.get_all_symbols_dict(),
            evaluator_config = models.get_evaluator_detailed_config(media_url, missing_tentacles),
            strategy_config = models.get_strategy_config(media_url, missing_tentacles),
            evaluator_startup_config = models.get_evaluators_tentacles_startup_activation(),
            trading_startup_config = models.get_trading_tentacles_startup_activation(),

            in_backtesting = backtesting_api.is_backtesting_enabled(display_config),

            config_tentacles_by_group = models.get_tentacles_activation_desc_by_group(media_url,
                                                                                      missing_tentacles),

            exchanges_details = models.get_exchanges_details(config_exchanges)


            try:
                return util.get_rest_reply(configs)

            except Exception as e:
                commons_logging.get_logger("plotted_data").exception(e)
                return util.get_rest_reply(str(e), 500)

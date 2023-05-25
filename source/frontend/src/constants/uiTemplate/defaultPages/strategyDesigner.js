export const defaultStrategyDesignerPageLayout =  {
    "layout": [
        {
            "component": "DefaultLayout",
            "footerContent": [
                {
                    "component": "Footer",
                    "rightContent": [
                        {
                            "component": "OptimizerProgress"
                        },
                        {
                            "component": "DataCollectorProgress"
                        },
                        {
                            "component": "BacktestingProgress"
                        },
                        {
                            "component": "RefreshBotData"
                        },
                        {
                            "component": "AppStoreCartModal",
                            "content": [
                                {
                                    "component": "AppStoreCart"
                                }
                            ],
                        },
                        {
                            "antIcon": "noIcon",
                            "component": "ButtonWithModal",
                            "content": [
                                {
                                    "component": "PageBuilder"
                                }
                            ],
                            "displayAsAvatar": false,
                            "faIcon": "wand-magic-sparkles",
                            "iconOnly": true,
                            "title": "UI Editor"
                        },
                        {
                            "antIcon": "NotificationOutlined",
                            "component": "ButtonWithModal",
                            "content": [
                                {
                                    "component": "NotificationCenter"
                                }
                            ],
                            "displayAsAvatar": false,
                            "faIcon": "",
                            "iconOnly": true,
                            "title": "Notification Center"
                        },
                        {
                            "component": "RealTradingSwitch"
                        },
                        {
                            "component": "CurrentPanelPosition",
                            "position": "footerHalf"
                        },
                        {
                            "component": "PowerMenu"
                        }
                    ]
                }
            ],
            "headerContent": [
                {
                    "component": "Header",
                    "leftContent": [
                        {
                            "component": "PairsSelector",
                            "content": [
                                {
                                    "component": "ScrollableTabs",
                                    "rightContent": [
                                        {
                                            "component": "ClosePairSelector"
                                        }
                                    ],
                                    "tabs": [
                                        {
                                            "antIcon": "DollarOutlined",
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "PairsTable"
                                                }
                                            ],
                                            "dontScroll": true,
                                            "faIcon": "",
                                            "title": "Symbols",
                                            "toolBarContent": [
                                                {
                                                    "component": "SavePairSelector"
                                                }
                                            ]
                                        },
                                        {
                                            "antIcon": "BankOutlined",
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "ExchangeSelector"
                                                }
                                            ],
                                            "dontScroll": true,
                                            "faIcon": "",
                                            "title": "Exchanges",
                                            "toolBarContent": [
                                                {
                                                    "component": "SavePairSelector"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "component": "TimeFrameSelector"
                        }
                    ],
                    "rightContent": [
                        {
                            "component": "ChartTypeSelector"
                        },
                        {
                            "antIcon": "UserOutlined",
                            "component": "ButtonWithModal",
                            "content": [
                                {
                                    "component": "LoginManager",
                                }
                            ],
                            "width": "450px",
                            "displayAsAvatar": true,
                            "faIcon": "",
                            "iconOnly": true,
                            "title": "Account Settings"
                        }
                    ]
                }
            ],
            "lowerContent": [
                {
                    "component": "ScrollableTabs",
                    "rightContent": [
                        {
                            "component": "CurrentPanelPosition",
                            "position": "minimized"
                        },
                        {
                            "component": "CurrentPanelPosition",
                            "position": "half"
                        },
                        {
                            "component": "CurrentPanelPosition",
                            "position": "maximized"
                        }
                    ],
                    "tabs": [
                        {
                            "antIcon": "AppstoreAddOutlined",
                            "component": "Tab",
                            "content": [
                                {
                                    "component": "AppStore"
                                }
                            ],
                            "dontScroll": false,
                            "faIcon": "",
                            "title": "Strategy Manager",
                            "toolBarContent": [
                                {
                                    "component": "StopTrainingButton",
                                },
                                {
                                    "component": "SaveTradingModeSettings"
                                },
                                {
                                    "antIcon": "DollarOutlined",
                                    "command": "execute",
                                    "component": "SendActionCommandToTradingMode",
                                    "faIcon": "noIcon",
                                    "title": "Execute trading mode"
                                },
                                {
                                    "component": "ToggleActivateRealTimeStrategy"
                                }
                            ]
                        },
                        {
                            "antIcon": "ExperimentOutlined",
                            "component": "Tab",
                            "content": [
                                {
                                    "component": "Sidebar",
                                    "sideBarContent": [
                                        {
                                            "antIcon": "ExperimentOutlined",
                                            "children": [],
                                            "component": "SidebarMenuItem",
                                            "content": [
                                                {
                                                    "component": "UIConfig",
                                                    "configKeys": [
                                                        "backtesting_run_settings",
                                                        "optimization_campaign",
                                                        "optimizer_campaigns_to_load"
                                                    ]
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "noIcon",
                                            "label": "Backtesting Settings",
                                            "noPadding": false,
                                        },
                                        {
                                            "antIcon": "OrderedListOutlined",
                                            "children": [],
                                            "component": "SidebarMenuItem",
                                            "content": [
                                                {
                                                    "component": "BacktestingRunDataTable"
                                                }
                                            ],
                                            "dontScroll": true,
                                            "faIcon": "noIcon",
                                            "label": "Backtesting Runs",
                                            "noPadding": true,
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": true,
                            "faIcon": "noIcon",
                            "title": "Backtesting",
                            "toolBarContent": [
                                {
                                    "component": "StopTrainingButton",
                                },
                                {
                                    "component": "StopBacktestingButton"
                                },
                                {
                                    "component": "StartBacktestingButton"
                                }
                            ]
                        },
                        {
                            "antIcon": "RocketOutlined",
                            "component": "Tab",
                            "content": [
                                {
                                    "component": "Sidebar",
                                    "sideBarContent": [
                                        {
                                            "antIcon": "ToolOutlined",
                                            "children": [],
                                            "component": "SidebarMenuItem",
                                            "content": [
                                                {
                                                    "component": "UIConfig",
                                                    "configKeys": [
                                                        "optimizer_run_settings",
                                                        "optimization_campaign"
                                                    ]
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "noIcon",
                                            "label": "Optimizer Settings",
                                            "noPadding": false,
                                        },
                                        {
                                            "antIcon": "PlayCircleOutlined",
                                            "children": [],
                                            "component": "SidebarMenuItem",
                                            "content": [
                                                {
                                                    "component": "OptimizerConfigForm"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "noIcon",
                                            "label": "Run Config",
                                            "noPadding": false,
                                        },
                                        {
                                            "antIcon": "OrderedListOutlined",
                                            "children": [],
                                            "component": "SidebarMenuItem",
                                            "content": [
                                                {
                                                    "component": "OptimizerQueueTable"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "label": "Optimizer Queue",
                                            "noPadding": true,
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": true,
                            "faIcon": "noIcon",
                            "title": "Optimizer",
                            "toolBarContent": [
                                {
                                    "component": "OptimizerQueueSize"
                                },
                                {
                                    "component": "OptimizerRunsToBeAdded"
                                },
                                {
                                    "component": "AddToOptimizerQueueButton"
                                },
                                {
                                    "component": "StopOptimizerButton"
                                },
                                {
                                    "component": "StartOptimizerButton"
                                }
                            ]
                        }
                    ]
                }
            ],
            "minHeights": "0, 50",
            "upperContent": [
                {
                    "component": "ChartTablePieCombo",
                    "settingsContent": [
                        {
                            "additionalTabs": [
                                {
                                    "antIcon": "LineChartOutlined",
                                    "component": "Tab",
                                    "content": [
                                        {
                                            "component": "UIConfig",
                                            "configKeys": [
                                                "display_settings"
                                            ]
                                        }
                                    ],
                                    "dontScroll": false,
                                    "faIcon": "",
                                    "title": "Other Display Settings",
                                    "toolBarContent": []
                                },
                                {
                                    "antIcon": "RedoOutlined",
                                    "component": "Tab",
                                    "content": [
                                        {
                                            "component": "ResetConfigs"
                                        }
                                    ],
                                    "dontScroll": false,
                                    "faIcon": "",
                                    "title": "Reset Configs",
                                    "toolBarContent": []
                                }
                            ],
                            "component": "TentaclesConfig",
                            "content": [],
                            "tentacleNames": "RunAnalysisModePlugin"
                        }
                    ]
                }
            ]
        }
    ],
    "path": "/",
    "title": "Strategy Designer"
}
export const defaultStrategyDesignerPageLayout = {
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
                        }, {
                            "antIcon": "SettingOutlined",
                            "component": "ButtonWithModal",
                            "content": [
                                {
                                    "component": "ScrollableTabs",
                                    "rightContent": [],
                                    "tabs": [
                                        {
                                            "antIcon": "noIcon",
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "ColorModeSwitch"
                                                }, {
                                                    "component": "UIConfig",
                                                    "configKeys": ["display_settings"]
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "title": "Display Settings",
                                            "toolBarContent": []
                                        }, {
                                            "antIcon": "noIcon",
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "PageBuilder"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "wand-magic-sparkles",
                                            "title": "UI Editor",
                                            "toolBarContent": []
                                        }, {
                                            "antIcon": "noIcon",
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "ResetConfigs"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "title": "Reset Settings",
                                            "toolBarContent": []
                                        }
                                    ]
                                }
                            ],
                            "faIcon": "",
                            "iconOnly": true,
                            "title": "Bot Settings"
                        }, {
                            "antIcon": "NotificationOutlined",
                            "component": "ButtonWithModal",
                            "content": [
                                {
                                    "component": "NotificationCenter"
                                }
                            ],
                            "faIcon": "",
                            "iconOnly": true,
                            "title": "Notification Center"
                        }, {
                            "component": "RealTradingSwitch"
                        }, {
                            "component": "CurrentPanelPosition",
                            "position": "maximized"
                        }, {
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
                                        }, {
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
                        }, {
                            "component": "TimeFrameSelector"
                        }
                    ],
                    "rightContent": [
                        {
                            "component": "ChartTypeSelector"
                        }, {
                            "component": "ProfileModal"
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
                        }, {
                            "component": "CurrentPanelPosition",
                            "position": "half"
                        }, {
                            "component": "CurrentPanelPosition",
                            "position": "maximized"
                        }
                    ],
                    "tabs": [
                        {
                            "antIcon": "ControlOutlined",
                            "component": "Tab",
                            "content": [
                                {
                                    "component": "TradingConfig",
                                    "content": []
                                }
                            ],
                            "dontScroll": true,
                            "faIcon": "NoIcon",
                            "title": "Strategy Settings",
                            "toolBarContent": [
                                {
                                    "antIcon": "noIcon",
                                    "command": "",
                                    "component": "SendActionCommandToTradingMode",
                                    "faIcon": "",
                                    "title": ""
                                }, {
                                    "component": "ToggleActivateRealTimeStrategy"
                                }
                            ]
                        },
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
                            "title": "Store",
                            "toolBarContent": []
                        },
                        {
                            "antIcon": "LineChartOutlined",
                            "component": "Tab",
                            "content": [
                                {
                                    "component": "ScrollableTabs",
                                    "rightContent": [],
                                    "tabs": [
                                        {
                                            "antIcon": "noIcon",
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "LiveRunMetaData"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "title": "Trading Overview",
                                            "toolBarContent": []
                                        },
                                        {
                                            "antIcon": "noIcon",
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "CurrentPortfolioTable"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "title": "Portfolio",
                                            "toolBarContent": []
                                        },
                                        {
                                            "antIcon": "noIcon",
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "SymbolsInfoTable"
                                                }
                                            ],
                                            "dontScroll": true,
                                            "faIcon": "",
                                            "title": "Symbols Info",
                                            "toolBarContent": []
                                        },
                                        {
                                            "antIcon": "noIcon",
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "DataTable",
                                                    "dataSource": "Open Orders"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "title": "Orders",
                                            "toolBarContent": []
                                        }, {
                                            "antIcon": "noIcon",
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "DataTable",
                                                    "dataSource": "Trades History"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "title": "Trades",
                                            "toolBarContent": []
                                        }, {
                                            "antIcon": "noIcon",
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "DataTable",
                                                    "dataSource": "Open Positions"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "title": "Positions",
                                            "toolBarContent": []
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": true,
                            "faIcon": "noIcon",
                            "title": "Trading",
                            "toolBarContent": [
                                {
                                    "component": "CancelAllOrdersButton"
                                }, {
                                    "component": "CloseAllPositionsButton"
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
                                                    "configKeys": ["backtesting_run_settings", "optimization_campaign", "optimizer_campaigns_to_load"]
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "noIcon",
                                            "label": "Backtesting Settings",
                                            "noPadding": false
                                        }, {
                                            "antIcon": "UnorderedListOutlined",
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
                                            "noPadding": true
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": true,
                            "faIcon": "noIcon",
                            "title": "Backtesting",
                            "toolBarContent": [
                                {
                                    "component": "StopBacktestingButton"
                                }, {
                                    "component": "StartBacktestingButton"
                                }
                            ]
                        }, {
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
                                                    "configKeys": ["optimizer_run_settings", "optimization_campaign"]
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "noIcon",
                                            "label": "Optimizer Settings",
                                            "noPadding": false
                                        }, {
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
                                            "noPadding": false
                                        }, {
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
                                            "noPadding": true
                                        }, {
                                            "antIcon": "UnorderedListOutlined",
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
                                            "noPadding": true
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
                                }, {
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

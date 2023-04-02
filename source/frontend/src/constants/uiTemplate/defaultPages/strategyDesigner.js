export const defaultStrategyDesignerPageLayout = {
    "layout": [
        {
            "component": "DefaultLayout",
            "footerContent": [
                {
                    "component": "Footer",
                    "rightContent": [
                        {
                            "component": "RefreshBotData"
                        },
                        {
                            "antIcon": "noIcon",
                            "component": "ButtonWithModal",
                            "content": [
                                {
                                    "component": "AppStore"
                                }
                            ],
                            "faIcon": "puzzle-piece",
                            "iconOnly": true,
                            "title": "Package Manager"
                        },
                        {
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
                                                    "component": "UIConfig",
                                                    "configKeys": [
                                                        "display_settings"
                                                    ]
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "title": "Display Settings",
                                            "toolBarContent": [
                                                {
                                                    "component": "ColorModeSwitch"
                                                }
                                            ]
                                        },
                                        {
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
                                        },
                                        {
                                            "antIcon": "noIcon",
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "ResetUiConfigButton"
                                                },
                                                {
                                                    "component": "ResetTentaclesPlotCacheButton"
                                                },
                                                {
                                                    "component": "ResetTentaclesConfigsButton"
                                                },
                                                {
                                                    "component": "ResetHistoryStorageButton",
                                                    "storageName": "portfolioHistory"
                                                },
                                                {
                                                    "component": "ResetHistoryStorageButton",
                                                    "storageName": "ordersHistory"
                                                },
                                                {
                                                    "component": "ResetHistoryStorageButton",
                                                    "storageName": "tradesHistory"
                                                },
                                                {
                                                    "component": "ResetHistoryStorageButton",
                                                    "storageName": "transactionsHistory"
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
                        },
                        {
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
                        },
                        {
                            "component": "RealTradingSwitch"
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
                            "component": "Logo"
                        },
                        {
                            "component": "PairsSelector"
                        },
                        {
                            "component": "TimeFrameSelector"
                        },
                        {
                            "component": "ExchangeSelector"
                        }
                    ],
                    "rightContent": [
                        {
                            "component": "ChartTypeSelector"
                        },
                        {
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
                            "component": "CurrentPanelMinimize"
                        },
                        {
                            "component": "CurrentPanelFullscreen"
                        }
                    ],
                    "tabs": [
                        {
                            "antIcon": "noIcon",
                            "component": "Tab",
                            "content": [
                                {
                                    "component": "TradingConfig",
                                    "content": []
                                }
                            ],
                            "dontScroll": true,
                            "faIcon": "gears",
                            "title": "Strategy Settings",
                            "toolBarContent": [
                                {
                                    "antIcon": "noIcon",
                                    "command": "execute",
                                    "component": "SendActionCommandToTradingMode",
                                    "faIcon": "sack-dollar",
                                    "title": "Execute trading mode"
                                },
                                {
                                    "component": "ToggleActivateRealTimeStrategy"
                                }
                            ]
                        },
                        {
                            "antIcon": "noIcon",
                            "component": "Tab",
                            "content": [
                                {
                                    "component": "TentaclesConfig",
                                    "content": [],
                                    "tentacleNames": "RunAnalysisModePlugin"
                                }
                            ],
                            "dontScroll": false,
                            "faIcon": "magnifying-glass-chart",
                            "title": "Run Analysis",
                            "toolBarContent": []
                        },
                        {
                            "antIcon": "noIcon",
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
                                        },
                                        {
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
                                        },
                                        {
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
                            "faIcon": "chart-line",
                            "title": "Trading",
                            "toolBarContent": [
                                {
                                    "component": "CancelAllOrdersButton"
                                },
                                {
                                    "component": "CloseAllPositionsButton"
                                }
                            ]
                        },
                        {
                            "antIcon": "noIcon",
                            "component": "Tab",
                            "content": [
                                {
                                    "component": "Sidebar",
                                    "sideBarContent": [
                                        {
                                            "antIcon": "noIcon",
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
                                            "faIcon": "microscope",
                                            "label": "Backtesting Settings",
                                            "noPadding": false
                                        },
                                        {
                                            "antIcon": "noIcon",
                                            "children": [],
                                            "component": "SidebarMenuItem",
                                            "content": [
                                                {
                                                    "component": "BacktestingRunDataTable"
                                                }
                                            ],
                                            "faIcon": "table-list",
                                            "label": "Backtesting Runs",
                                            "noPadding": true
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": false,
                            "faIcon": "microscope",
                            "title": "Backtesting",
                            "toolBarContent": [
                                {
                                    "component": "StopBacktestingButton"
                                },
                                {
                                    "component": "StartBacktestingButton"
                                }
                            ]
                        },
                        {
                            "antIcon": "noIcon",
                            "component": "Tab",
                            "content": [
                                {
                                    "component": "Sidebar",
                                    "sideBarContent": [
                                        {
                                            "antIcon": "noIcon",
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
                                            "faIcon": "cogs",
                                            "label": "Optimizer Settings",
                                            "noPadding": false
                                        },
                                        {
                                            "antIcon": "noIcon",
                                            "children": [],
                                            "component": "SidebarMenuItem",
                                            "content": [
                                                {
                                                    "component": "OptimizerConfigForm"
                                                }
                                            ],
                                            "faIcon": "road",
                                            "label": "Run Config",
                                            "noPadding": false
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
                                            "faIcon": "",
                                            "label": "Optimizer Queue",
                                            "noPadding": true
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": false,
                            "faIcon": "user-astronaut",
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
                    "component": "ChartTablePieCombo"
                }
            ]
        }
    ],
    "path": "/",
    "title": "O UI"
}

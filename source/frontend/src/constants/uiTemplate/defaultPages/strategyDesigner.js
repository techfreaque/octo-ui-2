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
                            "component": "ButtonWithModal",
                            "content": [
                                {
                                    "component": "ScrollableTabs",
                                    "rightContent": [],
                                    "tabs": [
                                        {
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
                                            "antIcon": "noIcon",
                                            "title": "Display Settings",
                                            "toolBarContent": []
                                        },
                                        {
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
                                            "antIcon": "noIcon",
                                            "title": "Reset Settings",
                                            "toolBarContent": []
                                        }
                                    ]
                                }
                            ],
                            "faIcon": "",
                            "antIcon": "SettingOutlined",
                            "title": ""
                        },
                        {
                            "component": "ButtonWithModal",
                            "content": [
                                {
                                    "component": "NotificationCenter"
                                }
                            ],
                            "faIcon": "",
                            "antIcon": "NotificationOutlined",
                            "title": ""
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
                            "component": "AppDrawerDropdown"
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
                            "component": "ColorModeSwitch"
                        },
                        {
                            "component": "RealTradingSwitch"
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
                            "component": "Tab",
                            "content": [
                                {
                                    "component": "TradingConfig",
                                    "content": []
                                }
                            ],
                            "dontScroll": true,
                            "faIcon": "gears",
                            "antIcon": "noIcon",
                            "title": "Strategy Settings",
                            "toolBarContent": [
                                {
                                    "command": "execute",
                                    "component": "SendActionCommandToTradingMode",
                                    "faIcon": "sack-dollar",
                                    "antIcon": "noIcon",
                                    "title": "Execute Trading Mode"
                                },
                                {
                                    "component": "ToggleActivateRealTimeStrategy"
                                }
                            ]
                        },
                        {
                            "component": "Tab",
                            "content": [
                                {
                                    "component": "ScrollableTabs",
                                    "rightContent": [],
                                    "tabs": [
                                        {
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "UIConfig",
                                                    "configKeys": [
                                                        "live_analysis_settings"
                                                    ]
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "antIcon": "noIcon",
                                            "title": "Analysis Settings",
                                            "toolBarContent": []
                                        },
                                        {
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "LiveRunMetaData"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "antIcon": "noIcon",
                                            "title": "Trading Overview",
                                            "toolBarContent": []
                                        },
                                        {
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "CurrentPortfolioTable"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "antIcon": "noIcon",
                                            "title": "Portfolio",
                                            "toolBarContent": []
                                        },
                                        {
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "SymbolsInfoTable"
                                                }
                                            ],
                                            "dontScroll": true,
                                            "faIcon": "",
                                            "antIcon": "noIcon",
                                            "title": "Symbols Info",
                                            "toolBarContent": []
                                        },
                                        {
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "DataTable",
                                                    "dataSource": "Open Orders"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "antIcon": "noIcon",
                                            "title": "Orders",
                                            "toolBarContent": []
                                        },
                                        {
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "DataTable",
                                                    "dataSource": "Trades History"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "antIcon": "noIcon",
                                            "title": "Trades",
                                            "toolBarContent": []
                                        },
                                        {
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "DataTable",
                                                    "dataSource": "Open Positions"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "faIcon": "",
                                            "antIcon": "noIcon",
                                            "title": "Positions",
                                            "toolBarContent": []
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": true,
                            "faIcon": "chart-line",
                            "antIcon": "noIcon",
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
                            "component": "Tab",
                            "content": [
                                {
                                    "component": "Sidebar",
                                    "sideBarContent": [
                                        {
                                            "children": [],
                                            "component": "SidebarMenuItem",
                                            "content": [
                                                {
                                                    "component": "UIConfig",
                                                    "configKeys": [
                                                        "backtesting_run_settings",
                                                        "backtesting_analysis_settings",
                                                        "optimization_campaign",
                                                        "optimizer_campaigns_to_load"
                                                    ]
                                                }
                                            ],
                                            "faIcon": "microscope",
                                            "antIcon": "noIcon",
                                            "label": "Backtesting Settings"
                                        },
                                        {
                                            "children": [],
                                            "component": "SidebarMenuItem",
                                            "content": [
                                                {
                                                    "component": "BacktestingRunDataTable"
                                                }
                                            ],
                                            "faIcon": "table-list",
                                            "antIcon": "noIcon",
                                            "label": "Backtesting Runs"
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": false,
                            "faIcon": "microscope",
                            "antIcon": "noIcon",
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
                            "component": "Tab",
                            "content": [
                                {
                                    "component": "Sidebar",
                                    "sideBarContent": [
                                        {
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
                                            "faIcon": "",
                                            "antIcon": "noIcon",
                                            "label": "Optimizer Settings"
                                        },
                                        {
                                            "children": [],
                                            "component": "SidebarMenuItem",
                                            "content": [
                                                {
                                                    "component": "OptimizerConfigForm"
                                                }
                                            ],
                                            "faIcon": "",
                                            "antIcon": "noIcon",
                                            "label": "Run Config"
                                        },
                                        {
                                            "children": [],
                                            "component": "SidebarMenuItem",
                                            "content": [
                                                {
                                                    "component": "OptimizerQueueTable"
                                                }
                                            ],
                                            "faIcon": "",
                                            "antIcon": "noIcon",
                                            "label": "Optimizer Queue"
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": false,
                            "faIcon": "user-astronaut",
                            "antIcon": "noIcon",
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
                    "component": "PlotlyDualCharts"
                }
            ]
        }
    ],
    "path": "/",
    "title": "Strategy Designer"
}

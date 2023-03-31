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
                                            "icon": "noIcon",
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
                                            "icon": "noIcon",
                                            "title": "Reset Settings",
                                            "toolBarContent": []
                                        }
                                    ]
                                }
                            ],
                            "faIcon": "",
                            "icon": "SettingOutlined",
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
                            "icon": "NotificationOutlined",
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
                            "Icon": null,
                            "component": "CurrentPanelMinimize"
                        },
                        {
                            "Icon": null,
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
                            "icon": "noIcon",
                            "title": "Strategy Settings",
                            "toolBarContent": [
                                {
                                    "command": "execute",
                                    "component": "SendActionCommandToTradingMode",
                                    "faIcon": "sack-dollar",
                                    "icon": "noIcon",
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
                                            "icon": "noIcon",
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
                                            "icon": "noIcon",
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
                                            "icon": "noIcon",
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
                                            "icon": "noIcon",
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
                                            "icon": "noIcon",
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
                                            "icon": "noIcon",
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
                                            "icon": "noIcon",
                                            "title": "Positions",
                                            "toolBarContent": []
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": true,
                            "faIcon": "chart-line",
                            "icon": "noIcon",
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
                                            "icon": "noIcon",
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
                                            "icon": "noIcon",
                                            "label": "Backtesting Runs"
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": false,
                            "faIcon": "microscope",
                            "icon": "noIcon",
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
                                            "Icon": "AccountBookFilled",
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
                                            "icon": "noIcon",
                                            "label": "Optimizer Settings"
                                        },
                                        {
                                            "Icon": "AccountBookFilled",
                                            "children": [],
                                            "component": "SidebarMenuItem",
                                            "content": [
                                                {
                                                    "component": "OptimizerConfigForm"
                                                }
                                            ],
                                            "faIcon": "",
                                            "icon": "noIcon",
                                            "label": "Run Config"
                                        },
                                        {
                                            "Icon": "AccountBookFilled",
                                            "children": [],
                                            "component": "SidebarMenuItem",
                                            "content": [
                                                {
                                                    "component": "OptimizerQueueTable"
                                                }
                                            ],
                                            "faIcon": "",
                                            "icon": "noIcon",
                                            "label": "Optimizer Queue"
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": false,
                            "faIcon": "user-astronaut",
                            "icon": "noIcon",
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

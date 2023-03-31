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
                                            "title": "Reset Settings",
                                            "toolBarContent": []
                                        }
                                    ]
                                }
                            ],
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
                                            "title": "Positions",
                                            "toolBarContent": []
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": true,
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
                                    "component": "ScrollableTabs",
                                    "rightContent": [],
                                    "tabs": [
                                        {
                                            "component": "Tab",
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
                                            "dontScroll": false,
                                            "title": "Backtesting Settings",
                                            "toolBarContent": []
                                        },
                                        {
                                            "component": "Tab",
                                            "content": [
                                                {
                                                    "component": "BacktestingRunDataTable"
                                                }
                                            ],
                                            "dontScroll": false,
                                            "title": "Backtesting Overview",
                                            "toolBarContent": []
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": true,
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
                                            "icon": "noIcon",
                                            "label": "Optimizer Queue"
                                        }
                                    ]
                                }
                            ],
                            "dontScroll": false,
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

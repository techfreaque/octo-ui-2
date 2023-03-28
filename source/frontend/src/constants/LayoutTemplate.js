export const defaultBotTemplate = {
    isCustom: false, // set to true to keep your changes
    layouts: [
        {
            "layout": [
                {
                    "component": "DefaultLayout",
                    "footerContent": [
                        {
                            "component": "Footer",
                            "rightContent": [
                                {
                                    "component": "PowerMenu"
                                },
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
                                    "component": "CurrentPanelMinimize",
                                    "faIcon": null
                                },
                                {
                                    "Icon": null,
                                    "component": "CurrentPanelFullscreen",
                                    "faIcon": null
                                }
                            ],
                            "tabs": [
                                {
                                    "component": "Tab",
                                    "content": [
                                        {
                                            "component": "TradingConfig",
                                            "content": [
                                                {
                                                    "component": "ToggleActivateRealTimeStrategy"
                                                },
                                                {
                                                    "Icon": "AccountBookFilled",
                                                    "command": "execute",
                                                    "component": "SendActionCommandToTradingMode",
                                                    "faIcon": "sack-dollar",
                                                    "icon": "iconStringNoIcon",
                                                    "title": "Execute Trading Mode"
                                                }
                                            ]
                                        }
                                    ],
                                    "dontScroll": true,
                                    "title": "Strategy Settings",
                                    "toolBarContent": []
                                },
                                {
                                    "component": "Tab",
                                    "content": [
                                        {
                                            "component": "ScrollableTabs",
                                            "rightContent": [
                                                {
                                                    "component": "CancelAllOrdersButton"
                                                },
                                                {
                                                    "component": "CloseAllPositionsButton"
                                                }
                                            ],
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
                                    "toolBarContent": []
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
                                                },
                                                {
                                                    "component": "StartBacktestingButton"
                                                },
                                                {
                                                    "component": "StopBacktestingButton"
                                                }
                                            ]
                                        }
                                    ],
                                    "dontScroll": true,
                                    "title": "Backtesting",
                                    "toolBarContent": []
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
                                                    "icon": "iconStringNoIcon",
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
                                                    "icon": "iconStringNoIcon",
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
                                                    "icon": "iconStringNoIcon",
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
        },
        {
            "layout": [
                {
                    "component": "SimpleLayout",
                    "footerContent": [
                        {
                            "component": "Footer",
                            "rightContent": [
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
                                }
                            ],
                            "rightContent": [
                                {
                                    "component": "ColorModeSwitch"
                                },
                                {
                                    "component": "RealTradingSwitch"
                                }
                            ]
                        }
                    ],
                    "pageContent": [
                        {
                            "component": "AppStore"
                        }
                    ]
                }
            ],
            "path": "/appstore",
            "title": "Package Manager"
        },
        {
            "layout": [
                {
                    "component": "SimpleLayout",
                    "footerContent": [
                        {
                            "component": "Footer",
                            "rightContent": []
                        }
                    ],
                    "headerContent": [
                        {
                            "component": "Header",
                            "leftContent": [
                                {
                                    "component": "AppDrawerDropdown"
                                }
                            ],
                            "rightContent": []
                        }
                    ],
                    "pageContent": [
                        {
                            "component": "PageBuilder"
                        }
                    ]
                }
            ],
            "path": "/page-builder",
            "title": "Page Builder"
        }
    ]
};

// change also in pages.css
export const defaultColors = {
    dark: {
        background: "#131722",
        backgroundSecondary: "rgba(255, 255, 255, 0.04)",
        backgroundHover: "#2a2e39",
        backgroundActive: "#111a2c",
        font: "#b2b5be",
        fontHover: "#fff",
        fontActive: "#1e53e5",
        border: "#2a2e39",
        borderActive: "#1e53e5",
        borderGlow:"#1d1d5f",
        warning: "#fb3",
        success: "#00c851",
        candles: {
            wick: {
                green: "rgb(178, 235, 242)",
                red: "rgb(103, 58, 183)"
            },
            body: {
                green: "rgb(178, 235, 242)",
                red: "rgb(103, 58, 183)"
            },
            border: {
                green: "rgb(178, 235, 242)",
                red: "rgb(103, 58, 183)"
            },
            // wick: {green: "#6BA583", red: "#DB0000"},
            // body: {green: "#6BA583", red: "#DB0000"},
            // border: {green: "#6BA583", red: "#DB0000"},
        }
    },
    light: {
        background: "#131722",
        backgroundSecondary: "rgba(0, 0, 0, 0.02)",
        backgroundHover: "rgba(0,0,0,.06)",
        backgroundActive: "#e6f4ff",
        font: "#000",
        fontHover: "#000",
        fontActive: "#1e53e5",
        border: "#2a2e39",
        borderActive: "#1e53e5",
        borderGlow:"#1d1d5f",
        warning: "#fb3",
        success: "#00c851",
        candles: {
            wick: {
                green: "rgb(178, 235, 242)",
                red: "rgb(103, 58, 183)"
            },
            body: {
                green: "rgb(178, 235, 242)",
                red: "rgb(103, 58, 183)"
            },
            border: {
                green: "rgb(178, 235, 242)",
                red: "rgb(103, 58, 183)"
            },
            // wick: {green: "#6BA583", red: "#DB0000"},
            // body: {green: "#6BA583", red: "#DB0000"},
            // border: {green: "#6BA583", red: "#DB0000"},
        }
    }
};

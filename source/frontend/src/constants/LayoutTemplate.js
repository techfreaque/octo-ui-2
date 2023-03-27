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
                                                    "dontScroll": true,
                                                    "title": "Display Settings"
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
                                                    "dontScroll": true,
                                                    "title": "Reset Settings"
                                                }
                                            ]
                                        }
                                    ],
                                    "faIcon": "cog",
                                    "title": ""
                                },
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
                                            "content": [
                                                {
                                                    "component": "ToggleActivateRealTimeStrategy"
                                                },
                                                {
                                                    "command": "execute",
                                                    "component": "SendActionCommandToTradingMode",
                                                    "faIcon": "sack-dollar",
                                                    "title": "Execute Trading Mode"
                                                }
                                            ]
                                        }
                                    ],
                                    "dontScroll": true,
                                    "title": "Strategy Settings"
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
                                                    "title": "Analysis Settings"
                                                },
                                                {
                                                    "component": "Tab",
                                                    "content": [
                                                        {
                                                            "component": "LiveRunMetaData"
                                                        }
                                                    ],
                                                    "dontScroll": false,
                                                    "title": "Trading Overview"
                                                },
                                                {
                                                    "component": "Tab",
                                                    "content": [
                                                        {
                                                            "component": "CurrentPortfolioTable"
                                                        }
                                                    ],
                                                    "dontScroll": false,
                                                    "title": "Portfolio"
                                                },
                                                {
                                                    "component": "Tab",
                                                    "content": [
                                                        {
                                                            "component": "SymbolsInfoTable"
                                                        }
                                                    ],
                                                    "dontScroll": true,
                                                    "title": "Symbols Info"
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
                                                    "title": "Orders"
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
                                                    "title": "Trades"
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
                                                    "title": "Positions"
                                                }
                                            ]
                                        }
                                    ],
                                    "dontScroll": true,
                                    "title": "Trading"
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
                                                    "title": "Backtesting Settings"
                                                },
                                                {
                                                    "component": "Tab",
                                                    "content": [
                                                        {
                                                            "component": "BacktestingRunDataTable"
                                                        }
                                                    ],
                                                    "dontScroll": false,
                                                    "title": "Backtesting Overview"
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
                                    "title": "Backtesting"
                                },
                                {
                                    "component": "Tab",
                                    "content": [
                                        {
                                            "component": "ScrollableTabs",
                                            "rightContent": [
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
                                            ],
                                            "tabs": [
                                                {
                                                    "component": "Tab",
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
                                                    "title": "Optimizer settings"
                                                },
                                                {
                                                    "component": "Tab",
                                                    "content": [
                                                        {
                                                            "component": "OptimizerConfigForm"
                                                        }
                                                    ],
                                                    "dontScroll": false,
                                                    "title": "Run config"
                                                },
                                                {
                                                    "component": "Tab",
                                                    "content": [
                                                        {
                                                            "component": "OptimizerQueueTable"
                                                        }
                                                    ],
                                                    "dontScroll": false,
                                                    "title": "Queue"
                                                }
                                            ]
                                        }
                                    ],
                                    "dontScroll": false,
                                    "title": "Optimizer"
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

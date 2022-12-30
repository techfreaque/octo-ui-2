export const defaultBotTemplate = [
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
              "lowerContent": [
                  {
                      "component": "ScrollableTabs",
                      "rightContent": [
                          {
                              "component": "ButtonWithModal",
                              "content": [
                                  {
                                      "component": "UIConfig",
                                      "configKeys": [
                                          "display_settings"
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
                                      "component": "TradingConfig"
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
                                              "title": "Analysis Settings"
                                          },
                                          {
                                              "component": "Tab",
                                              "content": [],
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
                                      "rightContent": [],
                                      "tabs": [
                                          {
                                              "component": "Tab",
                                              "content": [
                                                  {
                                                      "component": "UIConfig",
                                                      "configKeys": [
                                                          "optimizer_run_settings"
                                                      ]
                                                  }
                                              ],
                                              "dontScroll": false,
                                              "title": "Optimizer Settings"
                                          },
                                          {
                                              "component": "Tab",
                                              "content": [
                                                  {
                                                      "component": "OptimizerConfigForm"
                                                  }
                                              ],
                                              "dontScroll": false,
                                              "title": "Optimizer"
                                          },
                                          {
                                              "component": "Tab",
                                              "content": [
                                                  {
                                                      "component": "OptimizerQueueTable"
                                                  }
                                              ],
                                              "dontScroll": true,
                                              "title": "Optimizer Queue"
                                          },
                                          {
                                              "component": "OptimizerRunsToBeAdded"
                                          },
                                          {
                                              "component": "StartOptimizerButton"
                                          },
                                          {
                                              "component": "StopOptimizerButton"
                                          },
                                          {
                                              "component": "AddToOptimizerQueueButton"
                                          }
                                      ]
                                  }
                              ],
                              "dontScroll": false,
                              "title": "Strategy Optimizer"
                          }
                      ]
                  }
              ],
              "upperContent": [
                  {
                      "component": "PlotlyChart"
                  }
              ]
          }
      ],
      "path": "/",
      "title": "Home"
  },
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
              "lowerContent": [
                  {
                      "component": "ScrollableTabs",
                      "rightContent": [
                          {
                              "component": "ButtonWithModal",
                              "content": [
                                  {
                                      "component": "UIConfig",
                                      "configKeys": [
                                          "display_settings"
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
                                      "component": "Configuration",
                                      "configKey": "profile/crypto-currencies"
                                  }
                              ],
                              "dontScroll": false,
                              "title": "Currencies"
                          },
                          {
                              "component": "Tab",
                              "content": [
                                  {
                                      "component": "Configuration",
                                      "configKey": "profile/exchanges"
                                  }
                              ],
                              "dontScroll": false,
                              "title": "Exchanges"
                          },
                          {
                              "component": "Tab",
                              "content": [
                                  {
                                      "component": "Configuration",
                                      "configKey": "profile/trading"
                                  },
                                  {
                                      "component": "Configuration",
                                      "configKey": "profile/trader"
                                  },
                                  {
                                      "component": "Configuration",
                                      "configKey": "profile/trader-simulator"
                                  }
                              ],
                              "dontScroll": false,
                              "title": "Trading"
                          }
                      ]
                  }
              ],
              "upperContent": [
                  {
                      "component": "PlotlyChart"
                  }
              ]
          }
      ],
      "path": "/profile",
      "title": "Profiles"
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
      "title": "App Store"
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
];

export const defaultColors = {
  dark: {
    background: "#131722",
    backgroundHover: "#2a2e39",
    font: "#b2b5be",
    fontHover: "#131722",
    fontActive: "#1e53e5",
    border: "#2a2e39",
    borderActive: "#1e53e5",
    warning: "#fb3",
    success: "#00c851",
    candles: {
      wick: { green: "rgb(178, 235, 242)", red: "rgb(103, 58, 183)" },
      body: { green: "rgb(178, 235, 242)", red: "rgb(103, 58, 183)" },
      border: { green: "rgb(178, 235, 242)", red: "rgb(103, 58, 183)" },
      // wick: {green: "#6BA583", red: "#DB0000"},
      // body: {green: "#6BA583", red: "#DB0000"},
      // border: {green: "#6BA583", red: "#DB0000"},
    },
  },
  light: {
    background: "#131722",
    backgroundHover: "#2a2e39",
    font: "#000",
    fontHover: "#131722",
    fontActive: "#1e53e5",
    border: "#2a2e39",
    borderActive: "#1e53e5",
    warning: "#fb3",
    success: "#00c851",
    candles: {
      wick: { green: "rgb(178, 235, 242)", red: "rgb(103, 58, 183)" },
      body: { green: "rgb(178, 235, 242)", red: "rgb(103, 58, 183)" },
      border: { green: "rgb(178, 235, 242)", red: "rgb(103, 58, 183)" },
      // wick: {green: "#6BA583", red: "#DB0000"},
      // body: {green: "#6BA583", red: "#DB0000"},
      // border: {green: "#6BA583", red: "#DB0000"},
    },
  },
};

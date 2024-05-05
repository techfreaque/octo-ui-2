import { UiLayoutPageType } from "../../../context/config/BotLayoutProvider";

export const defaultStrategyDesignerPageLayout: UiLayoutPageType = {
  layout: [
    {
      component: "DefaultLayout",
      footerContent: [
        {
          component: "Footer",
          rightContent: [
            {
              component: "OptimizerProgress",
            },
            {
              component: "DataCollectorProgress",
            },
            {
              component: "BacktestingProgress",
            },
            {
              component: "RefreshBotData",
            },
            {
              component: "AppStoreCartModal",
              content: [
                {
                  component: "AppStoreCart",
                },
              ],
            },
            {
              antIcon: "noIcon",
              component: "ButtonWithModal",
              content: [
                {
                  component: "PageBuilder",
                },
              ],
              displayAsAvatar: false,
              faIcon: "wand-magic-sparkles",
              iconOnly: true,
              title: "UI Editor",
              width: "1000",
            },
            {
              antIcon: "NotificationOutlined",
              component: "ButtonWithModal",
              content: [
                {
                  component: "NotificationCenter",
                },
              ],
              displayAsAvatar: false,
              faIcon: "",
              iconOnly: true,
              title: "Notification Center",
              width: "1000",
            },
            {
              component: "RealTradingSwitch",
            },
            {
              component: "CurrentPanelPosition",
              position: "footerHalf",
            },
            {
              component: "ProjectHomePageModal",
            },
            {
              component: "PowerMenu",
            },
          ],
        },
      ],
      headerContent: [
        {
          component: "Header",
          leftContent: [
            {
              component: "PairsSelector",
              content: [
                {
                  component: "ScrollableTabs",
                  rightContent: [
                    {
                      component: "ClosePairSelector",
                    },
                  ],
                  tabs: [
                    {
                      antIcon: "DollarOutlined",
                      component: "Tab",
                      content: [
                        {
                          component: "PairsTable",
                        },
                      ],
                      dontScroll: true,
                      faIcon: "",
                      title: "Symbols",
                      toolBarContent: [
                        {
                          component: "SavePairSelector",
                        },
                      ],
                    },
                    {
                      antIcon: "BankOutlined",
                      component: "Tab",
                      content: [
                        {
                          component: "ExchangeSelector",
                        },
                      ],
                      dontScroll: true,
                      faIcon: "",
                      title: "Exchanges",
                      toolBarContent: [
                        {
                          component: "SavePairSelector",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              component: "TimeFrameSelector",
            },
          ],
          rightContent: [
            {
              component: "ChartTypeSelector",
            },
            {
              antIcon: "UserOutlined",
              component: "ButtonWithModal",
              content: [
                {
                  component: "LoginManager",
                },
              ],
              displayAsAvatar: true,
              faIcon: "",
              iconOnly: true,
              title: "Account Settings",
              width: "450px",
            },
          ],
        },
      ],
      lowerContent: [
        {
          component: "ScrollableTabs",
          rightContent: [
            {
              component: "CurrentPanelPosition",
              position: "minimized",
            },
            {
              component: "CurrentPanelPosition",
              position: "half",
            },
            {
              component: "CurrentPanelPosition",
              position: "maximized",
            },
          ],
          tabs: [
            {
              antIcon: "AppstoreAddOutlined",
              component: "Tab",
              content: [
                {
                  component: "AppStore",
                },
              ],
              dontScroll: false,
              faIcon: "",
              title: "Strategy Manager",
              toolBarContent: [
                {
                  component: "DemoInfo",
                },
                {
                  component: "StopTrainingButton",
                },
                {
                  component: "SaveTradingModeSettings",
                },
                {
                  antIcon: "DollarOutlined",
                  command: "execute",
                  component: "SendActionCommandToTradingMode",
                  faIcon: "noIcon",
                  title: "Execute trading mode",
                },
                {
                  component: "ToggleActivateRealTimeStrategy",
                },
              ],
            },
            {
              antIcon: "ExperimentOutlined",
              component: "Tab",
              content: [
                {
                  component: "Sidebar",
                  sideBarContent: [
                    {
                      antIcon: "ExperimentOutlined",
                      children: [],
                      component: "SidebarMenuItem",
                      content: [
                        {
                          component: "UIConfig",
                          configKeys: [
                            "backtesting_run_settings",
                            "optimization_campaign",
                            "optimizer_campaigns_to_load",
                          ],
                        },
                      ],
                      dontScroll: false,
                      faIcon: "noIcon",
                      label: "Backtesting Settings",
                      noPadding: false,
                    },
                    {
                      antIcon: "OrderedListOutlined",
                      children: [],
                      component: "SidebarMenuItem",
                      content: [
                        {
                          component: "BacktestingRunDataTable",
                        },
                      ],
                      dontScroll: true,
                      faIcon: "noIcon",
                      label: "Backtesting Runs",
                      noPadding: true,
                    },
                  ],
                },
              ],
              dontScroll: true,
              faIcon: "noIcon",
              title: "Backtesting",
              toolBarContent: [
                {
                  component: "DemoInfo",
                },
                {
                  component: "StopTrainingButton",
                },
                {
                  component: "StopBacktestingButton",
                },
                {
                  component: "StartBacktestingButton",
                },
              ],
            },
            {
              antIcon: "RocketOutlined",
              component: "Tab",
              content: [
                {
                  component: "Sidebar",
                  sideBarContent: [
                    {
                      antIcon: "ToolOutlined",
                      children: [],
                      component: "SidebarMenuItem",
                      content: [
                        {
                          component: "OptimizerNotInstalled",
                        },
                        {
                          component: "UIConfig",
                          configKeys: [
                            "optimizer_run_settings",
                            "optimization_campaign",
                          ],
                        },
                      ],
                      dontScroll: false,
                      faIcon: "noIcon",
                      label: "Optimizer Settings",
                      noPadding: false,
                    },
                    {
                      antIcon: "PlayCircleOutlined",
                      children: [],
                      component: "SidebarMenuItem",
                      content: [
                        {
                          component: "OptimizerConfigForm",
                        },
                      ],
                      dontScroll: false,
                      faIcon: "noIcon",
                      label: "Run Config",
                      noPadding: false,
                    },
                    {
                      antIcon: "OrderedListOutlined",
                      children: [],
                      component: "SidebarMenuItem",
                      content: [
                        {
                          component: "OptimizerQueueTable",
                        },
                      ],
                      dontScroll: false,
                      faIcon: "",
                      label: "Optimizer Queue",
                      noPadding: true,
                    },
                  ],
                },
              ],
              dontScroll: true,
              faIcon: "noIcon",
              title: "Optimizer",
              toolBarContent: [
                {
                  component: "DemoInfo",
                },
                {
                  component: "OptimizerQueueSize",
                },
                {
                  component: "OptimizerRunsToBeAdded",
                },
                {
                  component: "AddToOptimizerQueueButton",
                },
                {
                  component: "StopOptimizerButton",
                },
                {
                  component: "StartOptimizerButton",
                },
              ],
            },
            {
              antIcon: "CloudDownloadOutlined",
              component: "Tab",
              content: [
                {
                  component: "ServicesConfig",
                },
              ],
              dontScroll: true,
              faIcon: "",
              title: "Interfaces",
              toolBarContent: [],
            },
            {
              "antIcon": "DollarOutlined",
              "component": "Tab",
              "content": [
                {
                  "component": "CurrentPortfolioTable"
                }
              ],
              "dontScroll": true,
              "faIcon": "",
              "title": "Portfolio",
              "toolBarContent": []
            }
          ],
        },
      ],
      minHeights: "0, 50",
      upperContent: [
        {
          component: "ChartTablePieCombo",
          settingsContent: [
            {
              additionalTabs: [
                {
                  antIcon: "LineChartOutlined",
                  component: "Tab",
                  content: [
                    {
                      component: "UIConfig",
                      configKeys: ["display_settings"],
                    },
                  ],
                  dontScroll: false,
                  faIcon: "",
                  title: "Other Display Settings",
                  toolBarContent: [],
                },
                {
                  antIcon: "RedoOutlined",
                  component: "Tab",
                  content: [
                    {
                      component: "ResetConfigs",
                    },
                  ],
                  dontScroll: false,
                  faIcon: "",
                  title: "Reset Configs",
                  toolBarContent: [],
                },
              ],
              component: "TentaclesConfig",
              content: [],
              tentacleNames: "RunAnalysisModePlugin",
            },
          ],
        },
      ],
    },
  ],
  path: "/",
  title: "Strategy Designer",
};

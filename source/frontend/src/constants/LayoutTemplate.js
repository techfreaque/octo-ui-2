export const defaultBotTemplate = [
  {
    path: "/",
    title: "Home",
    layout: [
      {
        id: 1,
        component: "DefaultLayout",
        headerContent: [
          {
            id: 1,
            component: "Header",
            leftContent: [
              { component: "AppDrawerDropdown", id: 0 },
              { component: "PairsSelector", id: 1 },
              { component: "TimeFrameSelector", id: 2 },
            ],
            rightContent: [{ component: "ColorModeSwitch", id: 0 }],
          },
        ],

        upperContent: [{ component: "MainCharts", id: 1 }],
        lowerContent: [
          {
            component: "ScrollableTabs",
            id: 0,
            tabs: [
              {
                component: "Tab",
                id: 0,
                title: "Strategy Settings",
                content: [
                  { component: "TradingConfig", id: 0 },
                ],
              },
              {
                component: "Tab",
                id: 1,
                title: "Backtesting",
                content: [{
                  component: "ScrollableTabs",
                  id: 1,
                  tabs: [
                    {
                      component: "Tab",
                      id: 0,
                      title: "Backtesting Settings",
                      content: [
                        { component: "UIConfig", id: 0, configKeys: ["backtesting_run_settings", "backtesting_analysis_settings", "optimizer_campaigns_to_load"] },
                      ],
                    },
                    {
                      component: "Tab",
                      id: 1,
                      title: "Backtesting Overview",
                      content: [
                        { component: "BacktestingRunDataTable", id: 0 },
                      ],
                    },
                    [
                      { component: "StartBacktestingButton", id: 2 },
                      { component: "StopBacktestingButton", id: 3 },
                    ]
                  ],
                }],
                dontScroll: true,
              },
              {
                component: "Tab",
                id: 2,
                title: "Trading",
                content: [{
                  component: "ScrollableTabs",
                  id: 1,
                  tabs: [
                    {
                      component: "Tab",
                      id: 0,
                      title: "Trading Settings",
                      content: [
                        {
                          component: "RestartBotButton", id: 0, 
                        },
                      ],
                    },
                    {
                      component: "Tab",
                      id: 1,
                      title: "Trading Overview",
                      content: [
                        {
                          component: "RestartBotButton", id: 0
                        },
                      ],
                    },
                  ]
                }],
                dontScroll: true,

              },
              {
                component: "Tab",
                id: 3,
                title: "Strategy Optimizer",
                content: [
                  {
                    component: "ScrollableTabs",
                    id: 0,
                    tabs: [
                      {
                        component: "Tab",
                        id: 0,
                        title: "Optimizer Settings",
                        content: [
                          {
                            component: "UIConfig", id: 0, configKeys: [
                              // "optimization_campaign",
                              "optimizer_run_settings"]
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              [{ component: "RestartBotButton", id: 4 }],
            ],
            rightContent: [
              { component: "CurrentPanelMinimize", id: 0 },
              { component: "CurrentPanelFullscreen", id: 1 },
            ],
          },
        ],
        footerContent: [
          {
            component: "Footer",
            id: 3,
          },
        ],
      },
    ],
  },
  {
    path: "/profile",
    title: "Profiles",
    layout: [
      {
        id: 1,
        component: "DefaultLayout",
        headerContent: [
          {
            id: 1,
            component: "Header",
            leftContent: [
              { component: "AppDrawerDropdown", id: 0 },
              { component: "PairsSelector", id: 1 },
              { component: "TimeFrameSelector", id: 2 },
            ],

          },
        ],

        upperContent: [{ component: "MainCharts", id: 1 }],
        lowerContent: [
          {
            component: "ScrollableTabs",
            id: 1,
            tabs: [
              {
                component: "Tab",
                id: 0,
                title: "Currencies",
                content: [
                  {
                    component: "Configuration",
                    id: 0,
                    configKey: "profile/crypto-currencies",
                  },
                ],
              },
              {
                component: "Tab",
                id: 1,
                title: "Exchanges",
                content: [
                  {
                    component: "Configuration",
                    id: 0,
                    configKey: "profile/exchanges",
                  },
                ],
              },
              {
                component: "Tab",
                id: 2,
                title: "Trading",
                content: [
                  {
                    component: "Configuration",
                    id: 0,
                    configKey: "profile/trading",
                  },
                  {
                    component: "Configuration",
                    id: 1,
                    configKey: "profile/trader",
                  },
                  {
                    component: "Configuration",
                    id: 2,
                    configKey: "profile/trader-simulator",
                  },
                ],
              },
              [{ component: "RestartBotButton", id: 3 }],
            ],
            rightContent: [
              { component: "CurrentPanelMinimize", id: 1 },
              { component: "CurrentPanelFullscreen", id: 2 },
            ],
          },
        ],
        footerContent: [
          {
            component: "Footer",
            id: 3,
          },
        ],
      },
    ],
  },
  {
    path: "/portfolio",
    title: "Portfolio",
    layout: [
      {
        id: 1,
        component: "DefaultLayout",
        headerContent: [
          {
            id: 1,
            component: "Header",
            leftContent: [
              { component: "AppDrawerDropdown", id: 0 },
              { component: "PairsSelector", id: 1 },
              { component: "TimeFrameSelector", id: 2 },
            ],
            rightContent: [{ component: "ColorModeSwitch", id: 0 }],
          },
        ],

        upperContent: [{ component: "MainCharts", id: 1 }],
        lowerContent: [
          {
            component: "ScrollableTabs",
            id: 1,
            tabs: [
              {
                component: "Tab",
                id: 0,
                title: "Current Portfolio",
                content: [{ component: "CurrentPortfolioTable", id: 0 }],
              },
            ],
            rightContent: [
              { component: "CurrentPanelMinimize", id: 1 },
              { component: "CurrentPanelFullscreen", id: 2 },
            ],
          },
        ],
        footerContent: [
          {
            component: "Footer",
            id: 3,
          },
        ],
      },
    ],
  },
  {
    path: "/appstore",
    title: "App Store",
    layout: [
      {
        id: 0,
        component: "SimpleLayout",
        headerContent: [
          {
            id: 0,
            component: "Header",
            leftContent: [{ component: "AppDrawerDropdown", id: 0 }],
          },
        ],
        pageContent: [{ component: "AppStore", id: 0 }],
        footerContent: [
          {
            component: "Footer",
            id: 0,
          },
        ],
      },
    ],
  },
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

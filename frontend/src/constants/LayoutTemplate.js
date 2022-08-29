export const defaultBotTemplate = [
    {"path": "/", "title": "Home", "layout": [
        {
            id: 1, 
            component: "DefaultLayout", 
            headerContent: [{
                id: 1,
                component: "Header",
                leftContent: [
                    {component: "AppDrawerDropdown", id: 1},
                    
            ]
            }],
    
            upperContent: [{component: "MainCharts", id: 1}],
            lowerContent: [{
                component: "ScrollableTabs", id: 1, 
                    tabs: [
                        {component: "Tab", id: 0, title: "test", 
                            content: [{component: "Configuration", id:0, configKey: "profile"}],
                        },
                        [{component: "RestartBotButton", id: 1}],
                        {component: "Tab", id: 2, title: "test", 
                            content: [{component: "RestartBotButton", id:1}]},
                        [{component: "RestartBotButton", id: 3}],
                    ],
                    rightContent: [
                        {component: "CurrentPanelMinimize", id: 1},
                        {component: "CurrentPanelFullscreen", id: 2}]
            }],
            footerContent: [{
                component: "Footer",
                id: 3
            },
        ]
        }
    ]},
    {"path": "/profile", "title": "Profiles", "layout": [
        {
            id: 1, 
            component: "DefaultLayout", 
            headerContent: [{
                id: 1,
                component: "Header",
                leftContent: [{component: "AppDrawerDropdown", id: 1}]
            }],
    
            upperContent: [{component: "MainCharts", id: 1}],
            lowerContent: [{
                component: "ScrollableTabs", id: 1, 
                    tabs: [
                        {component: "Tab", id: 0, title: "Trading Mode", 
                            content: [{component: "CurrentPanelFullscreen", id: 0}]
                        },
                        {component: "Tab", id: 1, title: "Currencies",
                            content: [{component: "Configuration", id:0, configKey: "profile/crypto-currencies"}],
                        },
                        {component: "Tab", id: 2, title: "Exchanges", 
                            content: [{component: "Configuration", id:0, configKey: "profile/exchanges"}],
                        },
                        {component: "Tab", id: 3, title: "Trading", 
                            content: [
                                {component: "Configuration", id:0, configKey: "profile/trading"},
                                {component: "Configuration", id:1, configKey: "profile/trader"},
                                {component: "Configuration", id:2, configKey: "profile/trader-simulator"},
                            ],
                        },
                        [{component: "RestartBotButton", id: 4}],
                    ],
                    rightContent: [
                        {component: "CurrentPanelMinimize", id: 1},
                        {component: "CurrentPanelFullscreen", id: 2}]
            }],
            footerContent: [{
                component: "Footer",
                id: 3
            },]
        }
    ]},
    {"path": "/portfolio", "title": "Portfolio", "layout": [
        {
            id: 1, 
            component: "DefaultLayout", 
            headerContent: [{
                id: 1,
                component: "Header",
                leftContent: [{component: "AppDrawerDropdown", id: 1}]
            }],
    
            upperContent: [{component: "MainCharts", id: 1}],
            lowerContent: [{
                component: "ScrollableTabs", id: 1, 
                    tabs: [
                        {component: "Tab", id: 0, title: "Trading Mode", 
                            content: [{component: "CurrentPanelFullscreen", id: 0}]
                        },
                        {component: "Tab", id: 1, title: "Currencies",
                            content: [{component: "Configuration", id:0, configKey: "profile"}],
                        },
                        {component: "Tab", id: 2, title: "Exchanges", 
                            content: [{component: "Configuration", id:0, configKey: "profile/exchanges"}],
                        },
                        {component: "Tab", id: 3, title: "Trading", 
                            content: [
                                {component: "Configuration", id:0, configKey: "profile/trading"},
                                {component: "Configuration", id:0, configKey: "profile/trader"},
                                {component: "Configuration", id:0, configKey: "profile/trader-simulator"},
                            ],
                        },
                        [{component: "RestartBotButton", id: 4}],
                    ],
                    rightContent: [
                        {component: "CurrentPanelMinimize", id: 1},
                        {component: "CurrentPanelFullscreen", id: 2}]
            }],
            footerContent: [{
                component: "Footer",
                id: 3
            },]
        }
    ]},
  ]

export const defaultColors = {
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
        wick: {green: "rgb(178, 235, 242)", red: "rgb(103, 58, 183)"},
        body: {green: "rgb(178, 235, 242)", red: "rgb(103, 58, 183)"},
        border: {green: "rgb(178, 235, 242)", red: "rgb(103, 58, 183)"},
        // wick: {green: "#6BA583", red: "#DB0000"},
        // body: {green: "#6BA583", red: "#DB0000"},
        // border: {green: "#6BA583", red: "#DB0000"},
        }  
}
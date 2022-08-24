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
                            content: [{component: "CurrentPanelFullscreen"}]},
                        [{component: "RestartBotButton", id: 1}],
                        {component: "Tab", id: 2, title: "test", 
                            content: [{component: "RestartBotButton"}]},
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
                            content: [{component: "RestartBotButton", id: 1}]
                        },
                        {component: "Tab", id: 2, title: "Exchanges", 
                            content: [{component: "RestartBotButton", id: 2}]
                        },
                        {component: "Tab", id: 3, title: "Trading", 
                            content: [{component: "RestartBotButton", id: 3}]
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
}
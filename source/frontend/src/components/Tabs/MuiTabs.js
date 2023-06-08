import React from "react";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { useBotColorsContext } from "../../context/config/BotColorsProvider";
import useMediaQuery from '@mui/material/useMediaQuery';

export default function MuiTabs({ tabs, rightContent, defaultTabId }) {
    const botColors = useBotColorsContext();
    const [currentTabId, setCurrentTabId] = React.useState(defaultTabId ? defaultTabId : 0);
    const isBigScreen = useMediaQuery('(min-width:530px)');
    const handleTabChange = (event, newCurrentTabId) => {
        setCurrentTabId(newCurrentTabId);
    };
    return tabs && (
        <div style={{ height: "100%", zIndex:1, backgroundColor: botColors?.background,position: "relative" }}>
            <Box sx={{ borderBottom: `solid 1px ${botColors?.border}`}}>
                <TabsContainer>
                    <TabsElement isRightContent={true} >
                        {rightContent && rightContent}
                    </TabsElement>
                    <TabsElement isBigScreen={isBigScreen} isLeftContent={true}
                        // style={{ marginRight: "auto" }}
                    >
                        <Tabs
                            //  style={{ marginRight: "auto"}}
                            value={currentTabId}
                            onChange={handleTabChange}
                            variant="scrollable"
                            // scrollButtons
                            allowScrollButtonsMobile
                            aria-label="Tabs"
                            className="mx-auto">
                            {tabs.map((tab) => (tab.title))}
                        </Tabs>
                    </TabsElement>
                    <TabsElement isBigScreen={isBigScreen} >
                        {tabs[currentTabId]?.toolBarContent}
                    </TabsElement>
                </TabsContainer>
            </Box>                {
                tabs.map((tab, index) => {
                    const display = {}
                    if (tab?.tabId) {
                        if (tab?.tabId !== currentTabId) {
                            display.display = "none"
                        }
                    } else if (index !== currentTabId) {
                        display.display = "none"
                    }
                    return (<div
                        key={index}
                        style={
                            {
                                // TODO use toolbar height
                                
                                height: tab.dontScroll ? "calc(100% - 54px)" : "calc(100% - 54px)",
                                width: "100%",
                                ...display
                            }
                        }>
                        <div
                            style={
                                {
                                overflowY: tab.dontScroll ? "inherit" : "auto",
                                overflowX: tab.dontScroll ? "unset" : "hidden",
                                    height: "100%",
                                }
                            }>
                            {
                                tab.content
                            }</div>
                    </div>)
                })
            }
        </div>
    );
}

function TabsContainer({ children }) {
    return (<div style={{width: "100%", display:"flow-root"}}>
            {children}
        </div>)
}

function TabsElement({ children, isBigScreen, isRightContent, isLeftContent }) {
    let style = {}
    if (isRightContent) { 
        style = { float: "right", minHeight: "49px", maxWidth: "40%", display: "flex", marginLeft: "10px" }
    } else if (isLeftContent) {
        style = isBigScreen ? { float: "left" } : {}     
    } else {
        style={
            float: "right", maxWidth: "100%", display: "flex", flexWrap: "wrap",
        }
        if (isBigScreen) {
            style.minHeight= "49px"
                    }
    }
    return (
        <div className={isRightContent ? "" : (isLeftContent ? "" : "me-auto")}
        style={style}
        >
            {children}
        </div>
    )
}
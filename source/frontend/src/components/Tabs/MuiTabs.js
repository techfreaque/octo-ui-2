import React from "react";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { useBotColorsContext } from "../../context/config/BotColorsProvider";
import { Grid } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';

export default function MuiTabs({ tabs, rightContent, defaultTabId }) {
    const botColors = useBotColorsContext();
    const [currentTabId, setCurrentTabId] = React.useState(defaultTabId ? defaultTabId : 0);
    const isBigScreen = useMediaQuery('(min-width:800px)');
    const handleTabChange = (event, newCurrentTabId) => {
        setCurrentTabId(newCurrentTabId);
    };
    return tabs && (
        <div style={{ height: "100%" }}>
            <Box sx={{ borderBottom: `solid 1px ${botColors?.border}` }}
                style={{
                    // display: "flex"
                }}>
                <TabsContainer>
                    <TabsElement isBigScreen={isBigScreen} isRightContent={true} >
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
                            scrollButtons
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
                        className="w-100"
                        key={index}
                        style={
                            {
                                overflowY: tab.dontScroll ? "inherit" : "scroll",
                                overflowX: tab.dontScroll ? "unset" : "hidden",
                                height: tab.dontScroll ? "calc(100% - 54px)" : "calc(100% - 54px)",
                                ...display
                            }
                        }>
                        <div
                            style={
                                {
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

function TabsContainer({ children, isBigScreen }) {
    return (<div style={{width: "100%", display:"flow-root"}}>
            {children}
        </div>)
}

function TabsElement({ children, isBigScreen, isRightContent, isLeftContent }) {
    return (<div className={isRightContent ? "" : (isLeftContent ? "":"me-auto")}
            style={isRightContent ? { float: "right", height: "48px", maxWidth:"40%", display: "flex", marginLeft: "10px" } : (isLeftContent ? (isBigScreen?{float: "left"}:{}):{float: "right",  maxWidth: "100%",   minHeight: "48px",display: "flex",flexWrap: "wrap"})}
        >{children}</div>)
        // :   (<div className={isRightContent ?"ms-auto ":"me-auto "} style={isRightContent && { float: "right", maxWidth: "100%", flexWrap: "wrap" }} >{children}</div>)
}
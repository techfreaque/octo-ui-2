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
        <div style={{ height: "calc(100%)" }}>
            <Box sx={{ borderBottom: "solid 1px " + botColors.border }}
                style={{ display: "flex" }}>
                <TabsContainer>
                    <TabsElement isBigScreen={isBigScreen}>
                        <Tabs
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
                    <TabsElement isBigScreen={isBigScreen} isRightContent={true} >
                        {rightContent && rightContent}
                    </TabsElement>
                </TabsContainer>
            </Box>                {
                tabs.map((tab, index) => {
                    const display = {}
                    if (tab?.tabId) {
                        if (tab?.tabId !== currentTabId) {
                            display.display = "none"
                        }
                    } else {
                        if (index !== currentTabId) {
                            display.display = "none"
                        }
                    }
                    return <div
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
                    </div>
                })
            }
        </div>
    );
}

function TabsContainer({ children, isBigScreen }) {
    return isBigScreen
        ? <>{children}</>
        : <Grid container>
            {children}
        </Grid>
}

function TabsElement({ children, isBigScreen, isRightContent }) {
    return isBigScreen
        ? <div className="ms-auto d-flex">{children}</div>
        : <Grid item xs={12} >  <div className="ms-auto d-flex" style={isRightContent && { float: "right" }} >{children}</div> </Grid >
}
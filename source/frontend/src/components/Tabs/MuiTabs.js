import React from "react";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import {useBotColorsContext} from "../../context/BotColorsProvider";

export default function MuiTabs({tabs, rightContent, defaultTabId}) {
    const botColors = useBotColorsContext();
    const [currentTabId, setCurrentTabId] = React.useState(defaultTabId ? defaultTabId : 0);
    if (!tabs[currentTabId]) {
        return
    }
    const handleTabChange = (event, newCurrentTabId) => {
        setCurrentTabId(newCurrentTabId);
    };
    const overflowY = tabs[currentTabId].dontScroll ? "inherit" : "scroll";
    const overflowX = tabs[currentTabId].dontScroll ? "unset" : "hidden";
    const height = tabs[currentTabId].dontScroll ? "calc(100% - 54px)" : "calc(100% - 54px)";
    return (
        <div style={
            {height: "calc(100%)"}
        }>
            <Box sx={
                    {
                        borderBottom: "solid 1px " + botColors.border
                    }
                }
                style={
                    {display: "flex"}
            }>
                <Tabs value={currentTabId}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="Tabs"
                    className="mx-auto">
                    {
                    tabs && tabs.map((tab) => (tab.title))
                } </Tabs>
                <div className="ms-auto d-flex">
                    {
                    rightContent && rightContent
                } </div>
            </Box>
            <div className="w-100"
                style={
                    {
                        overflowY: overflowY,
                        overflowX: overflowX,
                        height: height
                    }
            }>
                {
                tabs.map((tab, index) => (
                    <div style={
                        {
                            display: index !== currentTabId && "none"
                        }
                    }>
                        {
                        tab.content
                    }</div>

                ))
            } </div>
        </div>
    );
}

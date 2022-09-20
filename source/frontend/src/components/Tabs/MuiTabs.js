import React from "react";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { useBotColorsContext } from "../../context/BotColorsProvider";

export default function MuiTabs({ tabs, rightContent, defaultTabId }) {
    const botColors = useBotColorsContext();
    const [currentTabId, setCurrentTabId] = React.useState(defaultTabId ? defaultTabId : 0);
    if (!tabs[currentTabId]) {
        return <></>
    }
    const handleTabChange = (event, newCurrentTabId) => {
        setCurrentTabId(newCurrentTabId);
    };
    const height = tabs[currentTabId].dontScroll ? "calc(100% - 54px)" : "calc(100% - 54px)";
    return (
        <div style={
            { height: "calc(100%)" }
        }>
            <Box sx={
                {
                    borderBottom: "solid 1px " + botColors.border
                }
            }
                style={
                    { display: "flex" }
                }>
                <Tabs
                    value={currentTabId}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="Tabs"
                    className="mx-auto">
                    {
                        tabs.map((tab) => (tab.title))
                    } </Tabs>
                <div className="ms-auto d-flex">
                    {
                        rightContent && rightContent
                    } </div>
            </Box>                {
                tabs.map((tab, index) => (
                    <div
                        className="w-100"
                        key={index}
                        style={
                            {
                                overflowY: tab.dontScroll ? "inherit" : "scroll",
                                overflowX: tab.dontScroll ? "unset" : "hidden",
                                height: height,
                                display: index !== currentTabId && "none"
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
                ))
            }
        </div>
    );
}

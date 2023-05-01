import React from "react";
import {Tab} from "@mui/material";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
import MuiTabs from "../../../components/Tabs/MuiTabs";
import IconFromString from "../../../components/Icons/IconFromString";

export default function ResizableTabs({
    tabs,
    rightContent,
    defaultTabId = 0
}) {
    const tabsData = []
    tabs?.forEach((tab, index) => {
        tabsData[index] = tab.component === "Tab" ? {
            title: (
                <Tab key={index}
                    label={
                        (
                            <TabLabel key={index}
                                tabTitle={
                                    tab.title
                                }
                                faIcon={
                                    tab.faIcon
                                }
                                antIcon={
                                    tab.antIcon
                                }/>
                        )
                    }
                    value={index}
                    sx={tabStyle}/>
            ),
            content: tab.content?.[0] && (
                <AppWidgets layout={
                    tab.content
                }/>
            ),
            toolBarContent: tab.toolBarContent?.[0] && (
                <AppWidgets layout={
                    tab.toolBarContent
                }/>
            ),
            dontScroll: tab.dontScroll
        } : {
            title: (
                <AppWidgets key={
                        tab.title.replace(/ /g, "_")
                    }
                    layout={
                        [tab]
                    }/>
            ),
            content: undefined
        };
    })
    return (
        <MuiTabs tabs={tabsData}
            rightContent={
                rightContent?.[0] && (
                    <AppWidgets layout={rightContent}/>
                )
            }
            defaultTabId={defaultTabId}/>
    )
}

export const tabStyle = {
    textTransform: 'none',
    display: "-webkit-box"
}

export function TabLabel({tabTitle, faIcon, antIcon}) {
    return (
        <>
            <IconFromString faIcon={faIcon}
                antIcon={antIcon}
                marginRight="5px"/>
            <span style={
                {
                    lineHeight: "25px",
                    verticalAlign: "bottom"
                }
            }>
                {tabTitle} </span>
        </>
    )
}

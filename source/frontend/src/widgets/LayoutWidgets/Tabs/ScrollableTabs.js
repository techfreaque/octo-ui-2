import React from "react";
import AppWidgets from "../../AppWidgets";
import {Tab} from "@mui/material";
import MuiTabs from "../../../components/Tabs/MuiTabs";

export default function ResizableTabs(props) {
    const {tabs, rightContent, defaultTabId} = props;

    const tabsData = []
    tabs.forEach((tab, index) => {
        if (tab.component === "Tab") {
            tabsData[index] = {
                title: <Tab key={
                        tab.id
                    }
                    label={
                        tab.title
                    }
                    value={
                        tab.id
                    }
                    sx={
                        {textTransform: 'none'}
                    }/>,
                content: <AppWidgets {...props}
                    layout={
                        tab.content
                    }/>,
                dontScroll: tab.dontScroll
            }
        } else {
            tabsData[index] = {
                title: <AppWidgets key={
                        tab[0].id + 20
                    }
                    {...props}
                    layout={tab}/>,
                content: undefined
            }
        }
    })
    return (
        <MuiTabs tabs={tabsData}
            rightContent={
                (
                    <AppWidgets {...props}
                        layout={rightContent}/>
                )
            }
            defaultTabId={defaultTabId}/>
    )
}

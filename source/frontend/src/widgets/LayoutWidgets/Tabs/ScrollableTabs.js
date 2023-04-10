import React from "react";
import {Tab} from "@mui/material";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
import MuiTabs from "../../../components/Tabs/MuiTabs";
import IconFromString from "../../../components/Icons/IconFromString";

export default function ResizableTabs(props) {
    const {tabs, rightContent, defaultTabId} = props;

    const tabsData = []
    tabs.forEach((tab, index) => {
        tabsData[index] = tab.component === "Tab" ? {
            title: (<Tab key={index}
                label={
                    (<>
                        <IconFromString faIcon={
                                tab.faIcon
                            }
                            antIcon={
                                tab.antIcon
                            }
                            marginRight="5px"/>
                        <span style={
                            {
                                lineHeight: "25px",
                                verticalAlign: "bottom"
                            }
                        }> {
                            tab.title
                        } </span>
                    </>)
                }
                value={index}
                sx={
                    {
                        textTransform: 'none',
                        display: "-webkit-box"
                    }
                }/>),
            content: tab.content?.[0] && (<AppWidgets {...props}
                layout={
                    tab.content
                }/>),
            toolBarContent: tab.toolBarContent?.[0] && (<AppWidgets {...props}
                layout={
                    tab.toolBarContent
                }/>),
            dontScroll: tab.dontScroll
        } : {
            title: (<AppWidgets key={
                    tab.title.replace(/ /g, "_")
                }
                {...props}
                layout={
                    [tab]
                }/>),
            content: undefined
        };
    })
    return (<MuiTabs tabs={tabsData}
        rightContent={
            rightContent?.[0] && (<AppWidgets {...props}
                layout={rightContent}/>)
        }
        defaultTabId={defaultTabId}/>)
}

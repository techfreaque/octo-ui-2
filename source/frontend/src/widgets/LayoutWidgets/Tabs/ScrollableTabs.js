import React from "react";
import { Tab } from "@mui/material";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
import MuiTabs from "../../../components/Tabs/MuiTabs";

export default function ResizableTabs(props) {
    const { tabs, rightContent, defaultTabId } = props;

    const tabsData = []
    tabs.forEach((tab, index) => {
        if (tab.component === "Tab") {
            tabsData[index] = {
                title: <Tab key={index}
                        label={tab.title}
                        value={index}
                        sx={{ textTransform: 'none' }}
                    />,
                content: tab.content && tab.content[0]
                    && <AppWidgets {...props}
                        layout={
                            tab.content
                        } />,
                dontScroll: tab.dontScroll
            }
        } else {
            tabsData[index] = {
                title: <AppWidgets
                    key={index + 20}
                    {...props}
                    layout={[tab]} />,
                content: undefined
            }
        }
    })
    return (
        <MuiTabs
            tabs={tabsData}
            rightContent={
                rightContent && rightContent[0] && (
                    <AppWidgets {...props}
                        layout={rightContent} />
                )
            }
            defaultTabId={defaultTabId} />
    )
}

import { Tab } from "@mui/material";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
import MuiTabs, { MuiTabType } from "../../../components/Tabs/MuiTabs";
import IconFromString from "../../../components/Icons/IconFromString";
import { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";

export default function ResizableTabs({
  tabs,
  rightContent,
  defaultTabId = 0,
}: {
  tabs: UiLayoutPageLayoutType[];
  rightContent: UiLayoutPageLayoutType[];
  defaultTabId?: number;
}) {
  const tabsData: MuiTabType[] = [];
  tabs?.forEach((tab, index) => {
    tabsData[index] =
      tab.component === "Tab"
        ? {
            tabId: index,
            title: (
              <Tab
                key={index}
                label={
                  <TabLabel
                    key={index}
                    tabTitle={tab.title || tab.component}
                    faIcon={tab.faIcon}
                    antIcon={tab.antIcon}
                  />
                }
                value={index}
                sx={tabStyle}
              />
            ),
            content: tab.content ? <AppWidgets layout={tab.content} /> : <></>,
            toolBarContent: tab.toolBarContent?.[0] && (
              <AppWidgets layout={tab.toolBarContent} />
            ),
            dontScroll: tab.dontScroll,
          }
        : {
            tabId: index,
            title: (
              <AppWidgets key={tab.title?.replace(/ /g, "_")} layout={[tab]} />
            ),
            content: tab.content ? <AppWidgets layout={tab.content} /> : <></>,
          };
  });
  return (
    <MuiTabs
      tabs={tabsData}
      rightContent={rightContent?.[0] && <AppWidgets layout={rightContent} />}
      defaultTabId={defaultTabId}
    />
  );
}

export const tabStyle = {
  textTransform: "none",
  display: "-webkit-box",
};

export function TabLabel({
  tabTitle,
  faIcon,
  antIcon,
}: {
  tabTitle: string;
  faIcon?: string;
  antIcon?: string;
}): JSX.Element {
  return (
    <>
      <IconFromString faIcon={faIcon} antIcon={antIcon} marginRight="5px" />
      <span
        style={{
          lineHeight: "25px",
          verticalAlign: "bottom",
        }}
      >
        {tabTitle}
      </span>
    </>
  );
}

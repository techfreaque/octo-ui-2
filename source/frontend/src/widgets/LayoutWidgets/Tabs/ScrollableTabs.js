import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AppWidgets from "../../AppWidgets";
import { useBotColorsContext } from "../../../context/BotColorsProvider";

export default function ResizableTabs(props) {
  const [currentTabId, setCurrentTabId] = React.useState(0); // set the default tab

  const handleTabChange = (event, newCurrentTabId) => {
    setCurrentTabId(newCurrentTabId);
  };
  const overflowY = props.tabs[currentTabId].dontScroll ? "inherit" : "scroll";
  const overflowX = props.tabs[currentTabId].dontScroll ? "unset" : "hidden";
  const height = props.tabs[currentTabId].dontScroll
    ? "calc(100% - 54px)"
    : "calc(100% - 54px)";
  const botColors = useBotColorsContext();

  return (
    <div style={{ height: "calc(100%)" }}>
      <Box
        sx={{
          borderBottom: "solid 1px " + botColors.border,
        }}
        style={{ display: "flex" }}
      >
        <Tabs
          value={currentTabId}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="Tabs"
          className="mx-auto"
        >
          {props.tabs.map((tab) => {
            if (tab.component === "Tab") {
              return <Tab key={tab.id} label={tab.title} value={tab.id} />;
            } else {
              return (
                <AppWidgets key={tab[0].id + 20} {...props} layout={tab} />
              );
            }
          })}
        </Tabs>
        <div className="ms-auto d-flex">
          <AppWidgets {...props} layout={props.rightContent} />
        </div>
      </Box>
      <div
        className="w-100"
        style={{
          overflowY: overflowY,
          overflowX: overflowX,
          height: height,
        }}
      >
        <AppWidgets {...props} layout={props.tabs[currentTabId].content} />
      </div>
    </div>
  );
}

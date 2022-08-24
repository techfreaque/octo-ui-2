import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AppWidgets from "../../AppWidgets";

export default function ResizableTabs(props) {
  const [currentTabId, setCurrentTabId] = React.useState(0); // set the default tab

  const handleTabChange = (event, newCurrentTabId) => {
    setCurrentTabId(newCurrentTabId);
  };

  return (
    <div>
      <Box sx={{ bgcolor: props.botDataManager.colors.background, 
                borderBottom: "solid 1px "+props.botDataManager.colors.border,
              }} 
            style={{display: "flex"}}
            // textColor=  {props.botDataManager.colors.font}

            >
        <Tabs
          value={currentTabId}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example"
          textColor=  "inherit"
        >
          {props.tabs.map(tab => {
            if (tab.component === "Tab") {
              return <Tab key={tab.id} label={tab.title} value={tab.id} />
            } else {
              return <AppWidgets key={tab[0].id} {...props} layout={tab} />
            }
          })}
        </Tabs>
        <div className="ms-auto d-flex" >
          <AppWidgets {...props} layout={props.rightContent} />
        </div>
      </Box>
      <div className="w-100 h-100">
        <AppWidgets {...props} layout={props.tabs[currentTabId].content}/>
      </div>
    </div>
  );
}

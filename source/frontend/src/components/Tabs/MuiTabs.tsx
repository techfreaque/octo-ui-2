import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { useBotColorsContext } from "../../context/config/BotColorsProvider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CSSProperties, SyntheticEvent, useState } from "react";

export interface MuiTabType {
  title: JSX.Element;
  toolBarContent?: JSX.Element;
  tabId: number | string;
  dontScroll?: boolean;
  content: JSX.Element;
  order?: number; // TODO handle
}
export interface MuiTabsProps {
  tabs: MuiTabType[];
  rightContent?: JSX.Element;
  defaultTabId?: number | string;
}

export default function MuiTabs({
  tabs,
  rightContent,
  defaultTabId,
}: MuiTabsProps) {
  const botColors = useBotColorsContext();
  const [currentTabId, setCurrentTabId] = useState<number | string>(
    defaultTabId ? defaultTabId : 0
  );
  const isBigScreen = useMediaQuery("(min-width:530px)");
  const handleTabChange = (
    event: SyntheticEvent<Element, Event>,
    newCurrentTabId: number | string
  ) => {
    setCurrentTabId(newCurrentTabId);
  };
  return (
    tabs && (
      <div
        style={{
          height: "100%",
          zIndex: 1,
          backgroundColor: botColors?.background,
          position: "relative",
        }}
      >
        <Box sx={{ borderBottom: `solid 1px ${botColors?.border}` }}>
          <TabsContainer>
            <>
              <TabsElement isRightContent={true}>
                {rightContent || <></>}
              </TabsElement>
              <TabsElement
                isBigScreen={isBigScreen}
                isLeftContent={true}
                // style={{ marginRight: "auto" }}
              >
                <Tabs
                  //  style={{ marginRight: "auto"}}
                  value={currentTabId}
                  onChange={handleTabChange}
                  variant="scrollable"
                  // scrollButtons
                  allowScrollButtonsMobile
                  aria-label="Tabs"
                  className="mx-auto"
                >
                  {tabs.map((tab) => tab.title)}
                </Tabs>
              </TabsElement>
              <TabsElement isBigScreen={isBigScreen}>
                {tabs.find((tab) => tab.tabId === currentTabId)
                  ?.toolBarContent || <></>}
              </TabsElement>
            </>
          </TabsContainer>
        </Box>
        {tabs.map((tab, index) => {
          const display: CSSProperties = {};
          if (typeof currentTabId === "string") {
            if (tab.tabId !== currentTabId) {
              display.display = "none";
            }
          } else if (index !== currentTabId) {
            display.display = "none";
          }
          return (
            <div
              key={index}
              style={{
                // TODO use toolbar height
                height: tab.dontScroll
                  ? "calc(100% - 54px)"
                  : "calc(100% - 54px)",
                width: "100%",
                ...display,
              }}
            >
              <div
                style={{
                  overflowY: tab.dontScroll ? "inherit" : "auto",
                  overflowX: tab.dontScroll ? "unset" : "hidden",
                  height: "100%",
                }}
              >
                {tab.content}
              </div>
            </div>
          );
        })}
      </div>
    )
  );
}

function TabsContainer({ children }: { children: JSX.Element }) {
  return <div style={{ width: "100%", display: "flow-root" }}>{children}</div>;
}

function TabsElement({
  children,
  isBigScreen,
  isRightContent,
  isLeftContent,
}: {
  children: JSX.Element;
  isBigScreen?: boolean;
  isRightContent?: boolean;
  isLeftContent?: boolean;
}) {
  let style: CSSProperties = {};
  if (isRightContent) {
    style = {
      float: "right",
      minHeight: "49px",
      maxWidth: "40%",
      display: "flex",
      marginLeft: "10px",
    };
  } else if (isLeftContent) {
    style = isBigScreen ? { float: "left" } : {};
  } else {
    style = {
      float: "right",
      maxWidth: "100%",
      display: "flex",
      flexWrap: "wrap",
    };
    if (isBigScreen) {
      style.minHeight = "49px";
    }
  }
  return (
    <div
      className={isRightContent ? "" : isLeftContent ? "" : "me-auto"}
      style={style}
    >
      {children}
    </div>
  );
}

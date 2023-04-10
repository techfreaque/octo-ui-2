import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCurrentPanelContext, useSetCurrentPanelPercent } from "../../../../context/config/MainPanelContext";
import AppWidgets from "../../../WidgetManagement/RenderAppWidgets";
import SplitMainContent from "../../SplitMainContent";

export default function DefaultLayout({ headerContent, upperContent, lowerContent, footerContent }) {
  const setPanelPercent = useSetCurrentPanelPercent()
  const panelPercent = useCurrentPanelContext()
  const headerRef = useRef()
  const footerRef = useRef()
  const [mainHeight, setMainHeight] = useState(window.innerHeight - 108) // ~108 is header + footer
  useEffect(() => {
    window.addEventListener(
      "resize", () => handleWindowResize(
        headerRef?.current?.clientHeight,
        footerRef?.current?.clientHeight, setMainHeight
      ));
  }, []);
  useEffect(() => {
    handleWindowResize(headerRef?.current?.clientHeight, footerRef?.current?.clientHeight, setMainHeight);
  }, [headerRef?.current?.clientHeight, footerRef?.current?.clientHeight]);
  return (
    <div style={{ flex: 1, height: "100vh" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          flex: "1",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 1
        }}
      >
        <div ref={headerRef}>
          <AppWidgets layout={headerContent} />
        </div>
        <div style={{ height: mainHeight }}>
          {useMemo(() => (<SplitMainContent
            upperContent={upperContent}
            lowerContent={lowerContent}
            panelPercent={panelPercent}
            setPanelPercent={setPanelPercent}
          />), [lowerContent, panelPercent, setPanelPercent, upperContent])}
        </div>
        <div ref={footerRef} style={{zIndex: 1}} >
          {useMemo(() => (<AppWidgets layout={footerContent} />), [footerContent])}
        </div>
      </div>
    </div>
  )
}


function handleWindowResize(headerHeight, footerHeight, setMainHeight) {
  headerHeight
    && footerHeight
    && setMainHeight(
      window.innerHeight -
      headerHeight -
      footerHeight,
    );
}
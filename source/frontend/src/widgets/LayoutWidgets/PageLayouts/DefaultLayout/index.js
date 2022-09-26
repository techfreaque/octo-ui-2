import React, { useRef, useState } from "react";
import { useUiDimensionsContext, useUpdateUiDimensionsContext } from "../../../../context/config/BotLayoutProvider";
import AppWidgets from "../../../AppWidgets";
import SplitMainContent from "../../SplitMainContent";

export default function DefaultLayout({headerContent, upperContent, lowerContent, footerContent}) {
  const [dimensions, setDimensions] = useState({main: 0})
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  function handleWindowResize() {
    headerRef.current
      && footerRef.current
      && setDimensions({
        main:
          window.innerHeight -
          headerRef.current.clientHeight -
          footerRef.current.clientHeight,
      });
  }
  React.useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
  }, []);
  return (
    <div style={{ flex: 1, height: "100vh" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          flex: "1",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div ref={headerRef}>
          <AppWidgets layout={headerContent} />
        </div>
        <div style={{ height: dimensions.main }}>
          <SplitMainContent
            upperContent={upperContent}
            lowerContent={lowerContent}
            height={dimensions.main}
          />
        </div>
        <div ref={footerRef}>
          <AppWidgets layout={footerContent} />
        </div>
      </div>
    </div>
  );
}

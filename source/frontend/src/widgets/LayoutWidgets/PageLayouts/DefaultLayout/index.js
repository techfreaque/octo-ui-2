import React, { useEffect, useMemo, useRef, useState } from "react";
import AppWidgets from "../../../AppWidgets";
import SplitMainContent from "../../SplitMainContent";

export default function DefaultLayout({ headerContent, upperContent, lowerContent, footerContent }) {
  const [dimensions, setDimensions] = useState({ main: window.innerHeight - 108}) // ~108 is header + footer
  const headerRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    handleWindowResize(headerRef, footerRef, setDimensions);
    window.addEventListener("resize", () => handleWindowResize(headerRef, footerRef, setDimensions));
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
          {useMemo(() => (<AppWidgets layout={footerContent} />), [footerContent])}
        </div>
      </div>
    </div>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  )
}

function handleWindowResize(headerRef, footerRef, setDimensions) {
  headerRef.current
    && footerRef.current
    && setDimensions({
      main:
        window.innerHeight -
        headerRef.current.clientHeight -
        footerRef.current.clientHeight,
    });
}
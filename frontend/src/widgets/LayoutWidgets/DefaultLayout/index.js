import React, { useRef } from "react";
import AppWidgets from "../../AppWidgets";
import SplitMainContent from "../SplitMainContent";

export default function DefaultLayout(props) {
  const [dimensions, setDimensions] = React.useState({
    header: 50,
    windowHeight: window.innerHeight,
    main: window.innerHeight - 100,
    footer: 50,
  });
  const headerRef = useRef(null);
  const footerRef = useRef(null);

  function handleWindowResize() {
    setDimensions({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      header: headerRef.current.clientHeight,
      footer: footerRef.current.clientHeight,
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
          <AppWidgets {...props} layout={props.headerContent} />
        </div>
        <div style={{ height: dimensions.main }}>
          <SplitMainContent
            {...props}
            height={dimensions.main}
            dimensions={dimensions}
          />
        </div>
        <div ref={footerRef}>
          <AppWidgets {...props} layout={props.footerContent} />
        </div>
      </div>
    </div>
  );
}

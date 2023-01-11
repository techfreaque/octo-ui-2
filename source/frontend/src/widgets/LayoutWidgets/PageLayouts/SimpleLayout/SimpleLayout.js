import React, { useRef } from "react";
import AppWidgets from "../../../WidgetManagement/RenderAppWidgets";

export default function SimpleLayout(props) {
  const footerRef = useRef(50);
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <div>
        <AppWidgets {...props} layout={props.headerContent} />
      </div>
      <div style={{ marginBottom: footerRef.current.clientHeight }}>
        <AppWidgets {...props} layout={props.pageContent} />
      </div>
      <div
        ref={footerRef}
        style={{ position: "fixed", width: "100%", bottom: 0 }}
      >
        <AppWidgets {...props} layout={props.footerContent} />
      </div>
    </div>
  );
}

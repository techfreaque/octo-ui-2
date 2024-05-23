import { useRef } from "react";

import { UiLayoutPageLayoutType } from "../../../../context/config/BotLayoutProvider";
import AppWidgets from "../../../WidgetManagement/RenderAppWidgets";

export default function SimpleLayout({
  headerContent,
  pageContent,
  footerContent,
}: UiLayoutPageLayoutType) {
  const footerRef = useRef<HTMLInputElement>(null);
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <div>{headerContent && <AppWidgets layout={headerContent} />}</div>
      <div style={{ marginBottom: footerRef?.current?.clientHeight || 50 }}>
        {pageContent && <AppWidgets layout={pageContent} />}
      </div>
      <div
        ref={footerRef}
        style={{ position: "fixed", width: "100%", bottom: 0 }}
      >
        {footerContent && <AppWidgets layout={footerContent} />}
      </div>
    </div>
  );
}

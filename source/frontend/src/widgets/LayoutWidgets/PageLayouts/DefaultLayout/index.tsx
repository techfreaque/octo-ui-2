import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AppWidgets from "../../../WidgetManagement/RenderAppWidgets";
import SplitMainContent from "../../SplitMainContent";
import { UiLayoutPageLayoutType } from "../../../../context/config/BotLayoutProvider";

export default function DefaultLayout({
  headerContent,
  upperContent,
  lowerContent,
  footerContent,
}: UiLayoutPageLayoutType) {
  const headerRef = useRef<HTMLInputElement>(null);
  const footerRef = useRef<HTMLInputElement>(null);
  const [mainHeight, setMainHeight] = useState<number>(
    window.innerHeight - 108,
  ); // ~108 is header + footer
  useEffect(() => {
    window.addEventListener("resize", () =>
      handleWindowResize(
        headerRef?.current?.clientHeight,
        footerRef?.current?.clientHeight,
        setMainHeight,
      ),
    );
  }, []);
  useEffect(() => {
    handleWindowResize(
      headerRef?.current?.clientHeight,
      footerRef?.current?.clientHeight,
      setMainHeight,
    );
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
          zIndex: 1,
        }}
      >
        <div ref={headerRef}>
          {useMemo(
            () => headerContent && <AppWidgets layout={headerContent} />,
            [headerContent],
          )}
        </div>
        <div style={{ height: mainHeight }}>
          {useMemo(
            () => (
              <SplitMainContent
                upperContent={upperContent}
                lowerContent={lowerContent}
              />
            ),
            [lowerContent, upperContent],
          )}
        </div>
        <div ref={footerRef} style={{ zIndex: 1 }}>
          {useMemo(
            () => footerContent && <AppWidgets layout={footerContent} />,
            [footerContent],
          )}
        </div>
      </div>
    </div>
  );
}

function handleWindowResize(
  headerHeight: number | undefined,
  footerHeight: number | undefined,
  setMainHeight: Dispatch<SetStateAction<number>>,
) {
  if (headerHeight && footerHeight) {
    setMainHeight(window.innerHeight - headerHeight - footerHeight);
  }
}

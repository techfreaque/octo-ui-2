import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
import Splitter, { SplitDirection } from "@devbookhq/splitter";
import { useColorModeContext } from "../../../context/config/ColorModeProvider";
import { useMemo } from "react";
import { useSetCurrentPanelPercent } from "../../../context/config/MainPanelContext";
import { useCurrentPanelContext } from "../../../context/config/MainPanelContext";
import "./index.css";
import { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import { ColorModeType } from "../../../constants/uiTemplate/defaultColors";

export default function SplitMainContent({
  upperContent,
  lowerContent,
}: {
  upperContent?: UiLayoutPageLayoutType[];
  lowerContent?: UiLayoutPageLayoutType[];
}) {
  const currentPanel = useCurrentPanelContext();
  const botColorMode = useColorModeContext();
  const setPanelPercent = useSetCurrentPanelPercent();
  const gutterClassName = Math.random().toString(36).slice(2, 7);
  return (
    <Splitter
      direction={SplitDirection.Vertical}
      minHeights={[0, 0]}
      initialSizes={[currentPanel?.percent || 0, 100 - currentPanel.percent]}
      classes={getSplitterClasses(botColorMode)}
      onResizeFinished={(_, newSizes) =>
        handleResize(gutterClassName, setPanelPercent, newSizes)
      }
      onResizeStarted={() => onResizeStarted(gutterClassName)}
      gutterClassName={gutterClassName}
    >
      <div style={{ height: "100%" }}>
        {useMemo(
          () => upperContent && <AppWidgets layout={upperContent} />,
          [upperContent],
        )}
      </div>
      <div style={{ height: "100%" }}>
        {useMemo(
          () => lowerContent && <AppWidgets layout={lowerContent} />,
          [lowerContent],
        )}
      </div>
    </Splitter>
  );
}

function handleResize(
  gutterClassName: string,
  setPanelPercent: (percent: number) => void,
  newSizes: number[],
) {
  const gutter = document.getElementsByClassName(gutterClassName)[0];
  gutter?.classList?.remove("is-resizing");
  const newPercent =
    newSizes[0] < 100 ? (newSizes[0] > 0 ? newSizes[0] : 0) : 100;
  setPanelPercent(newPercent);
}

export function getSplitterClasses(botColorMode: ColorModeType) {
  return botColorMode === "dark"
    ? ["resize-content-dark", "resize-content-dark"]
    : ["resize-content-light", "resize-content-light"];
}
function onResizeStarted(gutterClassName: string) {
  const gutter = document.getElementsByClassName(gutterClassName)[0];
  gutter?.classList?.add("is-resizing");
}

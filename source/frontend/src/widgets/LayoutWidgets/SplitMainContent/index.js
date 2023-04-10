import { useEffect, useState } from "react";
import "./index.css";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
import Splitter, { SplitDirection } from '@devbookhq/splitter'
import { useColorModeContext } from "../../../context/config/ColorModeProvider";
import { useMemo } from "react";

export default function SplitMainContent(
  { panelPercent = { percent: 60, shouldUpdate: false, },
    setPanelPercent, upperContent, lowerContent, minHeights = "0, 48" }
) {
  return <SplitResizableContent
    panelPercent={panelPercent}
    setPanelPercent={setPanelPercent}
    upperContent={<AppWidgets layout={upperContent} />}
    lowerContent={<AppWidgets layout={lowerContent} />}
    minHeights={minHeights}
  />
}

export function SplitResizableContent({
  panelPercent = { percent: 60, shouldUpdate: false, },
  setPanelPercent, upperContent, lowerContent, minHeights = "0, 48"
}) {
  const [panelSizes, setPanelSize] = useState([panelPercent.percent, 100 - panelPercent.percent]);
  const _minHeights = minHeights.split(',').map(Number);
  const [thispanelPercent, thisSetPanelPercent] = useState(panelPercent)
  const _panelPercent = setPanelPercent ? panelPercent : thispanelPercent
  const _setPanelPercent = setPanelPercent ? setPanelPercent : thisSetPanelPercent
  useEffect(() => {
    _panelPercent.shouldUpdate && setPanelSize(() => (
      _panelPercent.percent === 0
        ? [_panelPercent.percent + 0.1, 100 - _panelPercent.percent - 0.1]
        : [_panelPercent.percent, 100 - _panelPercent.percent]
    ));
  }, [_panelPercent]);
  const botColorMode = useColorModeContext();
  return useMemo(() => {
    const gutterClassName = Math.random().toString(36).slice(2, 7)
    return (
      <Splitter
        direction={SplitDirection.Vertical}
        minHeights={_minHeights} initialSizes={panelSizes}
        classes={getSplitterClasses(botColorMode)}
        onResizeFinished={
          ((_, newSizes) => handleResize(
            gutterClassName, _setPanelPercent, newSizes, setPanelSize
          ))}
        onResizeStarted={() => onResizeStarted(gutterClassName)}
        gutterClassName={gutterClassName}
      >
        {upperContent}
        {lowerContent}
      </Splitter>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_minHeights, botColorMode, lowerContent, panelSizes, upperContent])
}

function handleResize(gutterClassName, setPanelPercent, newSizes, setPanelSize) {
  const total = newSizes[0] + newSizes[1]
  const gutter = document.getElementsByClassName(gutterClassName)[0]
  gutter?.classList?.remove("is-resizing")
  const newPercent = newSizes[0] * 100 / total
  setPanelPercent({ percent: newPercent, shouldUpdate: false, })
  setPanelSize(
    newPercent === 0
      ? [newPercent + 0.1, 100 - newPercent - 0.1]
      : [newPercent, 100 - newPercent]
  );
}

function getSplitterClasses(botColorMode) {
  return botColorMode === 'dark'
    ? ["resize-content-dark", "resize-content-dark"]
    : ["resize-content-light", "resize-content-light"]
}
function onResizeStarted(gutterClassName) {
  const gutter = document.getElementsByClassName(gutterClassName)[0]
  gutter?.classList?.add("is-resizing")
}
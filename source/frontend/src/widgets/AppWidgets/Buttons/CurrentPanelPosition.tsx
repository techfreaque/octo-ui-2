import { Tooltip } from "antd";
import { t } from "i18next";
import { useMemo } from "react";

import AntButton from "../../../components/Buttons/AntButton";
import {
  useCurrentPanelContext,
  useSetCurrentPanelPercent,
} from "../../../context/config/MainPanelContext";

export type PanelPositionType =
  | "maximized"
  | "minimized"
  | "half"
  | "footerHalf";

export const availablePanelPositions: {
  [key in PanelPositionType]: PanelPositionType;
} = {
  maximized: "maximized",
  minimized: "minimized",
  half: "half",
  footerHalf: "footerHalf",
};
export const availablePanelPositionsArray = [
  availablePanelPositions.maximized,
  availablePanelPositions.minimized,
  availablePanelPositions.half,
  availablePanelPositions.footerHalf,
];

export default function CurrentPanelPosition({
  position,
}: {
  position: PanelPositionType;
}) {
  const currentPanel = useCurrentPanelContext();
  const props = {
    title:
      position === availablePanelPositions.maximized
        ? t("footer.maximize-panel")
        : position === availablePanelPositions.minimized
        ? t("footer.minimize-panel")
        : t("footer.restore-panel"),
    icon:
      position === availablePanelPositions.maximized
        ? "VerticalAlignTopOutlined"
        : position === availablePanelPositions.minimized
        ? "VerticalAlignBottomOutlined"
        : "VerticalAlignMiddleOutlined",
    panelPercent:
      position === availablePanelPositions.maximized
        ? 0
        : position === availablePanelPositions.minimized
        ? 100
        : 50,
  };
  if (position === availablePanelPositions.maximized) {
    return currentPanel?.percent > 0.1 && <PanelSize {...props} />;
  } else if (position === availablePanelPositions.minimized) {
    return currentPanel?.percent !== 100 && <PanelSize {...props} />;
  } else if (position === availablePanelPositions.half) {
    return (
      !(30 <= currentPanel?.percent && currentPanel?.percent <= 70) && (
        <PanelSize {...props} />
      )
    );
  } else if (position === availablePanelPositions.footerHalf) {
    return currentPanel?.percent > 98 && <PanelSize {...props} />;
  }
  return <></>;
}

function PanelSize({
  title,
  icon,
  panelPercent,
}: {
  title: string;
  icon: string;
  panelPercent: number;
}) {
  const setPanelPercent = useSetCurrentPanelPercent();
  return useMemo(() => {
    return (
      <div
        style={{
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        <Tooltip placement="topRight" title={title} arrow={false}>
          <div>
            <AntButton
              onClick={() => setPanelPercent(panelPercent)}
              buttonVariant="text"
              antIcon={icon}
              style={{ fontSize: "22px" }}
            />
          </div>
        </Tooltip>
      </div>
    );
  }, [icon, panelPercent, title, setPanelPercent]);
}

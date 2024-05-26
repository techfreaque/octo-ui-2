import { Layout } from "antd";

import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import Logo from "../../AppWidgets/other/Logo";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";

const { Header: AntHeader } = Layout;

export default function Header({
  leftContent,
  rightContent,
}: UiLayoutPageLayoutType) {
  const botColors = useBotColorsContext();
  return (
    <div
      style={{
        borderBottom: `solid 2px ${botColors?.border}`,
      }}
    >
      <AntHeader
        style={{
          display: "flex",
          padding: 0,
          height: "50px",
          lineHeight: "unset",
          background: "transparent",
        }}
      >
        <Logo />
        <div style={{ display: "flex", marginRight: "auto" }}>
          {leftContent && <AppWidgets layout={leftContent} />}
        </div>
        <div style={{ display: "flex", marginLeft: "auto" }}>
          {rightContent && <AppWidgets layout={rightContent} />}
        </div>
      </AntHeader>
    </div>
  );
}

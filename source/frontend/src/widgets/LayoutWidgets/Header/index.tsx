import "./header.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import Logo from "../../AppWidgets/other/Logo";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";

export default function Header({
  leftContent,
  rightContent,
}: {
  leftContent: UiLayoutPageLayoutType[];
  rightContent: UiLayoutPageLayoutType[];
}) {
  const botColors = useBotColorsContext();
  return (
    <div
      style={{
        borderBottom: `solid 2px ${botColors?.border}`,
      }}
    >
      <Navbar id="header" style={{ overflowX: "hidden" }}>
        <Logo />
        <Container
          id="header-content"
          fluid
          style={{
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        >
          <Nav style={{ marginRight: "auto" }}>
            {leftContent && <AppWidgets layout={leftContent} />}
          </Nav>
          <Nav> {rightContent && <AppWidgets layout={rightContent} />} </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

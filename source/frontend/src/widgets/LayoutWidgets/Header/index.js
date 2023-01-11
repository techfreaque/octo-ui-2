import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";

export default function Header(props) {
  const botColors = useBotColorsContext();
  return (
    <div style={{ borderBottom: "solid 2px " + botColors.border }}>
      <Navbar id="header">
        <Container fluid>
          <Nav className="me-auto">
            {props.leftContent && (
              <AppWidgets layout={props.leftContent} />
            )}
          </Nav>
          <Nav>
            {props.rightContent && (
              <AppWidgets layout={props.rightContent} />
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

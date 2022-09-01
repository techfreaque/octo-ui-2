import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useBotColorsContext } from "../../../context/BotColorsProvider";
import AppWidgets from "../../AppWidgets";

export default function Header(props) {
  const botColors = useBotColorsContext();

  return (
    <div style={{ borderBottom: "solid 2px " + botColors.border }}>
      <Navbar id="header">
        <Container fluid>
          <Nav className="me-auto">
            <AppWidgets {...props} layout={props.leftContent} />
          </Nav>
          <Nav>
            <AppWidgets {...props} layout={props.rightContent} />
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

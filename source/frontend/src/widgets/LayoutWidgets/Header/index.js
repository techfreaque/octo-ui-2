import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import AppWidgets from "../../AppWidgets";

export default function Header(props) {
  const botColors = useBotColorsContext();

  return (
    <div style={{ borderBottom: "solid 2px " + botColors.border }}>
      <Navbar id="header">
        <Container fluid>
          <Nav className="me-auto">
            {props.leftContent && (
              <AppWidgets {...props} layout={props.leftContent} />
            )}
          </Nav>
          <Nav>
            {props.rightContent && (
              <AppWidgets {...props} layout={props.rightContent} />
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

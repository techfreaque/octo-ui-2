import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {useBotColorsContext} from "../../../context/config/BotColorsProvider";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";

export default function Header({leftContent, rightContent}) {
    const botColors = useBotColorsContext();
    return (<div style={
        {
            borderBottom: "solid 2px " + botColors?.border
        }
    }>
        <Navbar id="header">
            <Container fluid>
                <Nav className="me-auto"> {
                    leftContent && (<AppWidgets layout={leftContent}/>)
                } </Nav>
                <Nav> {
                    rightContent && (<AppWidgets layout={rightContent}/>)
                } </Nav>
            </Container>
        </Navbar>
    </div>);
}

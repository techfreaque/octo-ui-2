import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, Menu, MenuItem} from "@mui/material";
import React, {useMemo, useState} from "react";
import {LinkContainer} from "react-router-bootstrap";
import {backendRoutes} from "../../../constants/backendConstants";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {useBotLayoutContext} from "../../../context/config/BotLayoutProvider";
import {colorModes, useColorModeContext} from "../../../context/config/ColorModeProvider";

export default function AppDrawerDropdown() {
    const botLayout = useBotLayoutContext();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const botDomain = useBotDomainContext()
    const colorMode = useColorModeContext()
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return useMemo(() => {
        return (
            <div className="my-auto">
                <Button id="appdrawer-button"
                    aria-controls={
                        open ? "appdrawer-menu" : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={
                        open ? "true" : undefined
                    }
                    onClick={handleClick}>
                    <FontAwesomeIcon icon={faBars}
                        size="xl"/>
                </Button>
                <Menu id="appdrawer-menu" aria-labelledby="appdrawer-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={
                        {
                            vertical: "bottom",
                            horizontal: "left"
                        }
                    }
                    transformOrigin={
                        {
                            vertical: "top",
                            horizontal: "left"
                        }
                }>
                    {
                    botLayout.map((page) => {
                        return (
                            <LinkContainer key={
                                    page.path
                                }
                                to={
                                    backendRoutes.frontendEntry + page.path
                            }>
                                <MenuItem onClick={handleClose}>
                                    {
                                    page.title
                                }</MenuItem>
                            </LinkContainer>
                        );
                    })
                }
                    <a href={botDomain}
                        style={
                            {
                                color: colorMode === colorModes.dark ? "#fff" : "#000"
                            }
                    }>
                        <li>
                            <MenuItem onClick={handleClose}>back to OctoBot</MenuItem>
                        </li>
                    </a>
                </Menu>
            </div>
        );
    }, [
        open,
        anchorEl,
        botLayout,
        botDomain,
        colorMode
    ])
}

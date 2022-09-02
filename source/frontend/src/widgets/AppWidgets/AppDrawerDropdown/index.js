import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { backendRoutes } from "../../../constants/backendConstants";
import { useBotLayoutContext } from "../../../context/BotLayoutProvider";

export default function AppDrawerDropdown() {
  const botLayout = useBotLayoutContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="my-auto">
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faBars} size="xl" />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {botLayout.map((page) => {
          return (
            <LinkContainer
              key={page.path}
              to={backendRoutes.frontendEntry + page.path}
            >
              <MenuItem onClick={handleClose}>{page.title}</MenuItem>
            </LinkContainer>
          );
        })}
      </Menu>

      {/* <NavDropdown.Divider /> */}
    </div>
  );
}

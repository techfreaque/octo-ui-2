import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Menu, MenuItem } from "@mui/material";
import { useMemo, useState } from "react";
import { backendRoutes } from "../../../constants/backendConstants";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useBotLayoutContext } from "../../../context/config/BotLayoutProvider";
import {
  colorModes,
  useColorModeContext,
} from "../../../context/config/ColorModeProvider";
import Link from "antd/es/typography/Link";

export default function AppDrawerDropdown() {
  const botLayout = useBotLayoutContext();
  const [open, setOpen] = useState<boolean>(false);
  const botDomain = useBotDomainContext();
  const colorMode = useColorModeContext();
  const toggleOpen = () => {
    setOpen((prevState) => !prevState);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return useMemo(() => {
    return (
      <div className="my-auto">
        <Button
          id="appdrawer-button"
          aria-controls={open ? "appdrawer-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={toggleOpen}
        >
          <FontAwesomeIcon icon={faBars} size="xl" />
        </Button>
        <Menu
          id="appdrawer-menu"
          aria-labelledby="appdrawer-button"
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
          {botLayout?.map((page) => {
            return (
              <Link
                key={page.path}
                href={backendRoutes.frontendEntry + page.path}
              >
                <MenuItem onClick={handleClose}>{page.title}</MenuItem>
              </Link>
            );
          })}
          <a
            href={botDomain}
            style={{
              color: colorMode === colorModes.dark ? "#fff" : "#000",
            }}
          >
            <li>
              <MenuItem onClick={handleClose}>back to OctoBot</MenuItem>
            </li>
          </a>
        </Menu>
      </div>
    );
  }, [open, botLayout, botDomain, colorMode]);
}

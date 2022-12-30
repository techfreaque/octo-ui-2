import * as React from "react";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useToggleColorModeContext } from "../../../context/config/ColorModeProvider";

export default function ColorModeSwitch() {
  const theme = useTheme();
  const colorMode = useToggleColorModeContext();
  return React.useMemo(() => {
    return (
      <IconButton
        sx={{ ml: 1 }}
        onClick={colorMode.toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode === "dark" ? (
          <FontAwesomeIcon icon={faMoon} />
        ) : (
          <FontAwesomeIcon icon={faSun} />
        )}
      </IconButton>
    );
  }, [theme, colorMode])
}

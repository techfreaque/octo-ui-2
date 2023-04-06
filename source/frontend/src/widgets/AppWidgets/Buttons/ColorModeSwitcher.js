import * as React from "react";
import IconButton from "@mui/material/IconButton";
import {useTheme} from "@mui/material/styles";
import {faMoon, faSun} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {colorModes, useToggleColorModeContext} from "../../../context/config/ColorModeProvider";
import Moon from "../../../components/Icons/Moon";

export default function ColorModeSwitch() {
    const theme = useTheme();
    const colorMode = useToggleColorModeContext();
    return React.useMemo(() => {
        return (<IconButton sx={
                {ml: 1}
            }
            onClick={
                colorMode.toggleColorMode
            }
            color="inherit"> {
            theme.palette.mode === colorModes.dark ? (<Moon height='24px' width='24px'/>) : (<FontAwesomeIcon icon={faSun}/>)
        } </IconButton>);
    }, [theme, colorMode])
}

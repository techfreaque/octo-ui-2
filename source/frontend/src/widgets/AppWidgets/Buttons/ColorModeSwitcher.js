import * as React from "react";
import {useTheme} from "@mui/material/styles";
import {colorModes, useToggleColorModeContext} from "../../../context/config/ColorModeProvider";
import Moon from "../../../components/Icons/Moon";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";

export default function ColorModeSwitch() {
    const theme = useTheme();
    const colorMode = useToggleColorModeContext();
    return React.useMemo(() => {
        return (
        <AntButton
            text="Toggle Dark Mode"
            icon={theme.palette.mode === colorModes.dark ? (<Moon height='24px' width='24px' color="white"/>) : (<Moon height='24px' width='24px' color="black"/>)}
            onClick={colorMode.toggleColorMode}
            buttonType={theme.palette.mode === colorModes.dark ? buttonTypes.white : buttonTypes.black}
            style={{margin:"20px 0 20px 0"}}
        />);
    }, [theme, colorMode])
}

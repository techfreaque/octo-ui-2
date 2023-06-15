import {ThemeProvider, createTheme} from "@mui/material/styles";
import React, {createContext, useContext, useMemo, useState} from "react";
import { useBotColorsContext } from "./BotColorsProvider";

const ToggleColorModeContext = createContext({
    toggleColorMode: () => {}
});
const ColorModeContext = createContext();

export const useToggleColorModeContext = () => {
    return useContext(ToggleColorModeContext);
};

export const useColorModeContext = () => {
    return useContext(ColorModeContext);
};

export const colorModes = {
    light: "light",
    dark: "dark"
}

export function ColorModeProvider({children}) {
    const [mode, setMode] = useState(colorModes.dark);
    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevMode) => (prevMode === colorModes.light ? colorModes.dark : colorModes.light));
        }
    }), []);
    return (<ToggleColorModeContext.Provider value={colorMode}>
        <ColorModeContext.Provider value={mode}>
                {children}
        </ColorModeContext.Provider>
    </ToggleColorModeContext.Provider>);
}

import React, {useState, useContext, createContext, useEffect, useMemo} from "react";
import {defaultColors} from "../../constants/uiTemplate/defaultColors";
import {colorModes, useColorModeContext} from "./ColorModeProvider";
import { ThemeProvider, createTheme } from "@mui/material";

const BotColorsContext = createContext();
const UpdateBotColorsContext = createContext();

export const useBotColorsContext = () => {
    return useContext(BotColorsContext);
};

export const useUpdateBotColorsContext = () => {
    return useContext(UpdateBotColorsContext);
};

export const BotColorsProvider = ({children}) => {
    const botColorMode = useColorModeContext();
    const [botColors, setBotColors] = useState(defaultColors.dark);
    const mode = useColorModeContext()
    useEffect(() => {
        if (botColorMode) {
            setBotColors(defaultColors[botColorMode]);
        }
    }, [botColorMode]);
    const theme = useMemo(() => {
        document.body.classList.remove(mode === colorModes.dark ? colorModes.light : colorModes.dark);
        document.body.classList.add(mode);
        return createTheme({palette: {
            mode,
            primary: {
                main: botColors?.fontActive,
              },
            }})
    }, [botColors?.fontActive, mode]);
    return (
        <BotColorsContext.Provider value={botColors}>
            <UpdateBotColorsContext.Provider value={setBotColors}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
            </UpdateBotColorsContext.Provider>
        </BotColorsContext.Provider>
    );
};

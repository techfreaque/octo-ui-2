import React, {useState, useContext, createContext, useEffect} from "react";
import {defaultColors} from "../../constants/uiTemplate/defaultColors";
import {useColorModeContext} from "./ColorModeProvider";

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

    useEffect(() => {
        if (botColorMode) {
            setBotColors(defaultColors[botColorMode]);
        }
    }, [botColorMode]);
    return (
        <BotColorsContext.Provider value={botColors}>
            <UpdateBotColorsContext.Provider value={setBotColors}>
                {children} </UpdateBotColorsContext.Provider>
        </BotColorsContext.Provider>
    );
};

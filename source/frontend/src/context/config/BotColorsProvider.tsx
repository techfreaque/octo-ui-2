import { createTheme, ThemeProvider } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { ColorsType } from "../../constants/uiTemplate/defaultColors";
import { defaultColors } from "../../constants/uiTemplate/defaultColors";
import { emptyValueFunction } from "../../helpers/helpers";
import { colorModes, useColorModeContext } from "./ColorModeProvider";

const BotColorsContext = createContext<ColorsType>(defaultColors.dark);
const UpdateBotColorsContext =
  createContext<Dispatch<SetStateAction<ColorsType>>>(emptyValueFunction);

export const useBotColorsContext = () => {
  return useContext(BotColorsContext);
};

export const useUpdateBotColorsContext = () => {
  return useContext(UpdateBotColorsContext);
};

export const BotColorsProvider = ({ children }: { children: JSX.Element }) => {
  const botColorMode = useColorModeContext();
  const [botColors, setBotColors] = useState(defaultColors.dark);
  const mode = useColorModeContext();
  useEffect(() => {
    if (botColorMode) {
      setBotColors(defaultColors[botColorMode]);
    }
  }, [botColorMode]);
  const theme = useMemo(() => {
    document.body.classList.remove(
      mode === colorModes.dark ? colorModes.light : colorModes.dark,
    );
    document.body.classList.add(mode);
    return createTheme({
      palette: {
        mode,
        primary: {
          main: botColors?.fontActive,
        },
      },
    });
  }, [botColors?.fontActive, mode]);
  return (
    <BotColorsContext.Provider value={botColors}>
      <UpdateBotColorsContext.Provider value={setBotColors}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </UpdateBotColorsContext.Provider>
    </BotColorsContext.Provider>
  );
};

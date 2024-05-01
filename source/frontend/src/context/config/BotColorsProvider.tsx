import {
  useState,
  useContext,
  createContext,
  useEffect,
  useMemo,
  SetStateAction,
  Dispatch,
} from "react";
import {
  ColorsType,
  defaultColors,
} from "../../constants/uiTemplate/defaultColors";
import { colorModes, useColorModeContext } from "./ColorModeProvider";
import { ThemeProvider, createTheme } from "@mui/material";

const BotColorsContext = createContext<ColorsType>(defaultColors.dark);
const UpdateBotColorsContext = createContext<
  Dispatch<SetStateAction<ColorsType>>
>((_value) => {});

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
      mode === colorModes.dark ? colorModes.light : colorModes.dark
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

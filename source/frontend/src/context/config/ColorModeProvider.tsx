import { createContext, useContext, useMemo, useState } from "react";
import { ColorModeType } from "../../constants/uiTemplate/defaultColors";

const defaultColorMode: ColorModeType = "dark";

const ToggleColorModeContext = createContext({
  toggleColorMode: () => {},
});
const ColorModeContext = createContext<ColorModeType>(defaultColorMode);

export const useToggleColorModeContext = () => {
  return useContext(ToggleColorModeContext);
};

export const useColorModeContext = () => {
  return useContext(ColorModeContext);
};

export const colorModes: { [key in ColorModeType]: ColorModeType } = {
  light: "light",
  dark: "dark",
};

export function ColorModeProvider({ children }: { children: JSX.Element }) {
  const [mode, setMode] = useState(defaultColorMode);
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) =>
          prevMode === colorModes.light ? colorModes.dark : colorModes.light
        );
      },
    }),
    []
  );
  return (
    <ToggleColorModeContext.Provider value={colorMode}>
      <ColorModeContext.Provider value={mode}>
        {children}
      </ColorModeContext.Provider>
    </ToggleColorModeContext.Provider>
  );
}

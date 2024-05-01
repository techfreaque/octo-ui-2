import { ConfigProvider, theme } from "antd";
import { useBotColorsContext } from "./BotColorsProvider";
import { colorModes, useColorModeContext } from "./ColorModeProvider";

export default function AntConfigProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const colors = useBotColorsContext();
  const colorMode = useColorModeContext();
  const darkTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: colors.fontActive,
      colorBgElevated: colors.background,
    },
  };
  const lightTheme = {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: colors.fontActive,
      colorBgElevated: colors.background,
    },
  };
  const _theme = colorMode === colorModes.light ? lightTheme : darkTheme;
  return <ConfigProvider theme={_theme}>{children} </ConfigProvider>;
}

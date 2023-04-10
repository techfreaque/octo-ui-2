import {ConfigProvider, theme} from "antd";
import { useBotColorsContext } from "./BotColorsProvider";
import {colorModes, useColorModeContext} from "./ColorModeProvider";


export default function AntConfigProvider({children}) {
    const colors = useBotColorsContext()
    const colorMode = useColorModeContext()
    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: colors.fontActive
        }
    }
    const lightTheme = {
        algorithm: theme.defaultAlgorithm,
        token: {
            colorPrimary: colors.fontActive
        }
    }
    const _theme = colorMode === colorModes.light ? lightTheme : darkTheme
    return <ConfigProvider theme={_theme}>
        {children} </ConfigProvider>
}

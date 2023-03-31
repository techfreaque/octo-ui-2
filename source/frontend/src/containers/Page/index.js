import React from "react";
import {useMemo} from "react";
import {Helmet} from "react-helmet";
import {projectDescription, projectName} from "../../constants/frontendConstants";
import {useBotColorsContext} from "../../context/config/BotColorsProvider";
import {useColorModeContext} from "../../context/config/ColorModeProvider";
import AppWidgets from "../../widgets/WidgetManagement/RenderAppWidgets";

export default function Page({currentPage}) {
    const botColors = useBotColorsContext();
    const colorMode = useColorModeContext();
    return useMemo(() => (
        <main style={
            {
                backgroundColor: colorMode === "dark" && botColors.background,
                color: colorMode === "dark" && botColors.font
            }
        }>
            <Helmet defaultTitle={
                `${currentPage.title} - ${projectName}`
            }>
                <meta name="description"
                    content={projectDescription}/>
            </Helmet>
            <AppWidgets currentPage={currentPage}
                layout={
                    currentPage.layout
                }/>
        </main>
    ), [currentPage, botColors, colorMode])
}

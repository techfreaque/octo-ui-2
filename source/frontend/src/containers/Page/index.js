import { useTheme } from "@mui/material";
import React from "react";
import { useMemo } from "react";
import { Helmet } from "react-helmet";
import { TestAntSidebar } from "../../components/Layouts/Sidebars/AntSidebar";
import { useBotColorsContext } from "../../context/config/BotColorsProvider";
import AppWidgets from "../../widgets/WidgetManagement/RenderAppWidgets";
import IconButton from "../../components/Buttons/IconButton";
import RefreshBotData from "../../widgets/AppWidgets/Buttons/RefreshData";
import { SaveOutlined, SyncOutlined } from '@ant-design/icons';

export default function Page({ currentPage }) {
  const botColors = useBotColorsContext();
  const theme = useTheme();
  return useMemo(() => (
    <main
      style={{
        backgroundColor: theme.palette.mode === "dark" && botColors.background,
        color: theme.palette.mode === "dark" && botColors.font,
      }}
    >
      <Helmet defaultTitle={currentPage.title + " - OctoBot"}>
        <meta name="description" content="OctoBot trading bot" />
      </Helmet>
        {/* React.createElement(IconButton, {
        { icon: <SyncOutlined spin={isSearching} style={{fontSize:buttonStyles.size.medium.fontSize}}/>, 
        size: "medium", 
        onClick: () => RefreshBotData() }
        }) */}
       {/* {React.createElement(IconButton(), {
        icon: <SaveOutlined />, 
        size: "medium" 
        })}  */}
      <AppWidgets
        currentPage={currentPage}
        layout={currentPage.layout}
      />
    </main>
  ), [currentPage, botColors, theme.palette.mode])
}

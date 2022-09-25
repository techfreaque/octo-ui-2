import { useTheme } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet";
import { useBotColorsContext } from "../../context/config/BotColorsProvider";
import AppWidgets from "../../widgets/AppWidgets";

export default function Page(props) {
  const botColors = useBotColorsContext();
  const theme = useTheme();
  return (
    <main
      style={{
        backgroundColor: theme.palette.mode === "dark" && botColors.background,
        color: theme.palette.mode === "dark" && botColors.font,
      }}
    >
      <Helmet defaultTitle={props.currentPage.title + " - OctoBot"}>
        <meta name="description" content="OctoBot trading bot" />
      </Helmet>
      <AppWidgets
        currentPage={props.currentPage}
        layout={props.currentPage.layout}
      />
    </main>
  );
}

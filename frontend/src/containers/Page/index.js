import React from "react";
import { Helmet } from "react-helmet";
import { useBotColorsContext } from "../../context/BotColorsProvider";
import AppWidgets from "../../widgets/AppWidgets";

export default function Page(props) {
  const botColors = useBotColorsContext();
  return (
    <main
      style={{ backgroundColor: botColors.background, color: botColors.font }}
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

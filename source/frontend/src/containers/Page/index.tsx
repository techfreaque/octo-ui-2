import { useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  projectDescription,
  projectName,
} from "../../constants/frontendConstants";
import { useBotColorsContext } from "../../context/config/BotColorsProvider";
import AppWidgets from "../../widgets/WidgetManagement/RenderAppWidgets";
import { UiLayoutPageType } from "../../context/config/BotLayoutProvider";

export default function Page({
  currentPage,
}: {
  currentPage: UiLayoutPageType;
}) {
  const botColors = useBotColorsContext();
  return useMemo(
    () => (
      <main
        style={
          botColors
            ? {
                backgroundColor: botColors.background,
                color: botColors.font,
              }
            : {}
        }
      >
        <Helmet defaultTitle={`${currentPage.title} - ${projectName}`}>
          <meta name="description" content={projectDescription} />
        </Helmet>
        <AppWidgets currentPage={currentPage} layout={currentPage.layout} />
      </main>
    ),
    [currentPage, botColors],
  );
}

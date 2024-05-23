import { IoProvider } from "socket.io-react-hook";

import { PlotlyLayoutsProvider } from "../widgets/AppWidgets/Charts/MainCharts/PlotlyContext";
import { BotBacktestingProvider } from "./actions/BotBacktestingProvider";
import { BotOptimizerProvider } from "./actions/BotOptimizerProvider";
import AntConfigProvider from "./config/AntThemeContext";
import { BotColorsProvider } from "./config/BotColorsProvider";
import { BotDomainProvider } from "./config/BotDomainProvider";
import { BotLayoutProvider } from "./config/BotLayoutProvider";
import { ColorModeProvider } from "./config/ColorModeProvider";
import { CurrentChartTypeProvider } from "./config/CurrentChartTypeProvider";
import { MainPanelProvider } from "./config/MainPanelContext";
import { OptimizerEditorProvider } from "./config/OptimizerEditorProvider";
import { TentaclesConfigProvider } from "./config/TentaclesConfigProvider";
import { UiConfigProvider } from "./config/UiConfigProvider";
import { VisibleExchangesProvider } from "./config/VisibleExchangesProvider";
import { VisiblePairsProvider } from "./config/VisiblePairProvider";
import { VisibleTimeFramesProvider } from "./config/VisibleTimeFrameProvider";
import { AppStoreDataProvider } from "./data/AppStoreDataProvider";
import { BacktestingRunDataProvider } from "./data/BacktestingRunDataProvider";
import { BotInfoProvider } from "./data/BotInfoProvider";
import { BotPlottedElementsProvider } from "./data/BotPlottedElementsProvider";
import { BotPortfolioProvider } from "./data/BotPortfolioProvider";
import { IsBotOnlineProvider } from "./data/IsBotOnlineProvider";
import { OptimizerQueueProvider } from "./data/OptimizerQueueProvider";
import { NotificationsContextProvider } from "./websockets/NotificationsContext";

export default function BotDataProvider({
  children,
}: {
  children: JSX.Element;
}) {
  return (
    <BotDomainProvider>
      <IoProvider>
        <IsBotOnlineProvider>
          <NotificationsContextProvider>
            <VisibleTimeFramesProvider>
              <VisiblePairsProvider>
                <VisibleExchangesProvider>
                  <BotInfoProvider>
                    <UiConfigProvider>
                      <BotLayoutProvider>
                        <ColorModeProvider>
                          <BotColorsProvider>
                            <TentaclesConfigProvider>
                              <BotPlottedElementsProvider>
                                <CurrentChartTypeProvider>
                                  <BacktestingRunDataProvider>
                                    <BotPortfolioProvider>
                                      <AppStoreDataProvider>
                                        <BotBacktestingProvider>
                                          <OptimizerEditorProvider>
                                            <OptimizerQueueProvider>
                                              <BotOptimizerProvider>
                                                <PlotlyLayoutsProvider>
                                                  <MainPanelProvider>
                                                    <AntConfigProvider>
                                                      {children}
                                                    </AntConfigProvider>
                                                  </MainPanelProvider>
                                                </PlotlyLayoutsProvider>
                                              </BotOptimizerProvider>
                                            </OptimizerQueueProvider>
                                          </OptimizerEditorProvider>
                                        </BotBacktestingProvider>
                                      </AppStoreDataProvider>
                                    </BotPortfolioProvider>
                                  </BacktestingRunDataProvider>
                                </CurrentChartTypeProvider>
                              </BotPlottedElementsProvider>
                            </TentaclesConfigProvider>
                          </BotColorsProvider>
                        </ColorModeProvider>
                      </BotLayoutProvider>
                    </UiConfigProvider>
                  </BotInfoProvider>
                </VisibleExchangesProvider>
              </VisiblePairsProvider>
            </VisibleTimeFramesProvider>
          </NotificationsContextProvider>
        </IsBotOnlineProvider>
      </IoProvider>
    </BotDomainProvider>
  );
}

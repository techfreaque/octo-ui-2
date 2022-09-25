import React from "react";
import { BotBacktestingProvider } from "./actions/BotBacktestingProvider";
import { BotColorsProvider } from "./config/BotColorsProvider";
import { BotDomainProvider } from "./config/BotDomainProvider";
import { BotInfoProvider } from "./data/BotInfoProvider";
import { BotLayoutProvider } from "./config/BotLayoutProvider";
import { BotPlottedElementsProvider } from "./data/BotPlottedElementsProvider";
import { BotPortfolioProvider } from "./data/BotPortfolioProvider";
import ColorModeProvider from "./config/ColorModeProvider";
import { BotConfigProvider } from "./config/BotConfigProvider";
import { UiConfigProvider } from "./config/UiConfigProvider";
import { VisibleTimeFramesProvider } from "./config/VisibleTimeFrameProvider";
import { AppStoreDataProvider } from "./data/AppStoreDataProvider";
import { BacktestingRunDataProvider } from "./data/BacktestingRunDataProvider";
import { IsBotOnlineProvider } from "./data/IsBotOnlineProvider";
import { LiveRunDataProvider } from "./data/LiveRunDataProvider";
import { OptimizerQueueProvider } from "./data/OptimizerQueueProvider";
import { VisiblePairsProvider } from "./config/VisiblePairProvider";


export default function BotDataProvider({ children }) {
  return (
    <BotDomainProvider>
      <IsBotOnlineProvider>
        <UiConfigProvider>
          <VisibleTimeFramesProvider>
            <VisiblePairsProvider>
              <BotInfoProvider>
                <BotLayoutProvider>
                  <ColorModeProvider>
                    <BotColorsProvider>
                      <BotPlottedElementsProvider>
                        <LiveRunDataProvider>
                          <BacktestingRunDataProvider>
                            <BotPortfolioProvider>
                              <AppStoreDataProvider>
                                <BotConfigProvider>
                                  <BotBacktestingProvider>
                                    <OptimizerQueueProvider>
                                      {children}
                                    </OptimizerQueueProvider>
                                  </BotBacktestingProvider>
                                </BotConfigProvider>
                              </AppStoreDataProvider>
                            </BotPortfolioProvider>
                          </BacktestingRunDataProvider>
                        </LiveRunDataProvider>
                      </BotPlottedElementsProvider>
                    </BotColorsProvider>
                  </ColorModeProvider>
                </BotLayoutProvider>
              </BotInfoProvider>
            </VisiblePairsProvider>
          </VisibleTimeFramesProvider>
        </UiConfigProvider>
      </IsBotOnlineProvider>
    </BotDomainProvider>
  );
}

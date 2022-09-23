import React from "react";
import { AppStoreDataProvider } from "./AppStoreDataProvider";
import { BacktestingRunDataProvider } from "./BacktestingRunDataProvider";
import { BotColorsProvider } from "./BotColorsProvider";
import { BotConfigProvider } from "./BotConfigProvider";
import { BotDomainProvider } from "./BotDomainProvider";
import { BotInfoProvider } from "./BotInfoProvider";
import { BotLayoutProvider } from "./BotLayoutProvider";
import { BotPlottedElementsProvider } from "./BotPlottedElementsProvider";
import { BotPortfolioProvider } from "./BotPortfolioProvider";
import ColorModeProvider from "./ColorModeProvider";
import { IsBotOnlineProvider } from "./IsBotOnlineProvider";
import { LiveRunDataProvider } from "./LiveRunDataProvider";
import { UiConfigProvider } from "./UiConfigProvider";
import { VisiblePairsProvider } from "./VisiblePairProvider";
import { VisibleTimeFramesProvider } from "./VisibleTimeFrameProvider";

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
                                  {children}
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

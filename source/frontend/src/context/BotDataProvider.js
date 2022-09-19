import React from "react";
import { AppStoreDataProvider } from "./AppStoreDataProvider";
import { BotColorsProvider } from "./BotColorsProvider";
import { BotConfigProvider } from "./BotConfigProvider";
import { BotDomainProvider } from "./BotDomainProvider";
import { BotInfoProvider } from "./BotInfoProvider";
import { BotLayoutProvider } from "./BotLayoutProvider";
import { BotPlottedElementsProvider } from "./BotPlottedElementsProvider";
import { BotPortfolioProvider } from "./BotPortfolioProvider";
import ColorModeProvider from "./ColorModeProvider";
import { RunDataProvider } from "./RunDataProvider";
import { UiConfigProvider } from "./UiConfigProvider";
import { VisiblePairsProvider } from "./VisiblePairProvider";
import { VisibleTimeFramesProvider } from "./VisibleTimeFrameProvider";

export default function BotDataProvider({ children }) {
  return (
    <BotDomainProvider>
      <UiConfigProvider>
        <VisibleTimeFramesProvider>
          <VisiblePairsProvider>
            <BotInfoProvider>
              <BotLayoutProvider>
                <ColorModeProvider>
                  <BotColorsProvider>
                    <BotPlottedElementsProvider>
                      <RunDataProvider>
                        <BotPortfolioProvider>
                          <AppStoreDataProvider>
                            <BotConfigProvider>{children}</BotConfigProvider>
                          </AppStoreDataProvider>
                        </BotPortfolioProvider>
                      </RunDataProvider>
                    </BotPlottedElementsProvider>
                  </BotColorsProvider>
                </ColorModeProvider>
              </BotLayoutProvider>
            </BotInfoProvider>
          </VisiblePairsProvider>
        </VisibleTimeFramesProvider>
      </UiConfigProvider>
    </BotDomainProvider>
  );
}

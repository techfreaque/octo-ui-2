import React from "react";
import { BotColorsProvider } from "./BotColorsProvider";
import { BotConfigProvider } from "./BotConfigProvider";
import { BotDomainProvider } from "./BotDomainProvider";
import { BotInfoProvider } from "./BotInfoProvider";
import { BotLayoutProvider } from "./BotLayoutProvider";
import { BotPlottedElementsProvider } from "./BotPlottedElementsProvider";
import { BotPortfolioProvider } from "./BotPortfolioProvider";
import ColorModeProvider from "./ColorModeProvider";
import { VisibleTimeFramesProvider } from "./VisibleTimeFrameProvider";

export default function BotDataProvider({ children }) {
  return (
    <BotDomainProvider>
      <VisibleTimeFramesProvider>
        <BotInfoProvider>
          <BotLayoutProvider>
            <ColorModeProvider>
              <BotColorsProvider>
                <BotPlottedElementsProvider>
                  <BotPortfolioProvider>
                    <BotConfigProvider>{children}</BotConfigProvider>
                  </BotPortfolioProvider>
                </BotPlottedElementsProvider>
              </BotColorsProvider>
            </ColorModeProvider>
          </BotLayoutProvider>
        </BotInfoProvider>
      </VisibleTimeFramesProvider>
    </BotDomainProvider>
  );
}

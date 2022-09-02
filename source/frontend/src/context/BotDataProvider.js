import React from "react";
import { BotColorsProvider } from "./BotColorsProvider";
import { BotConfigProvider } from "./BotConfigProvider";
import { BotDomainProvider } from "./BotDomainProvider";
import { BotInfoProvider } from "./BotInfoProvider";
import { BotLayoutProvider } from "./BotLayoutProvider";
import { BotPlottedElementsProvider } from "./BotPlottedElementsProvider";
import { VisibleTimeFramesProvider } from "./VisibleTimeFrameProvider";

export default function BotDataProvider({ children }) {
  return (
      <BotDomainProvider>
        <VisibleTimeFramesProvider>
          <BotInfoProvider>
            <BotLayoutProvider>
              <BotColorsProvider>
                <BotPlottedElementsProvider>
                  <BotConfigProvider>{children}</BotConfigProvider>
                </BotPlottedElementsProvider>
              </BotColorsProvider>
            </BotLayoutProvider>
          </BotInfoProvider>
        </VisibleTimeFramesProvider>
      </BotDomainProvider>
  );
}

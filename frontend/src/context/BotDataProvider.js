import React from "react";
import { BrowserRouter } from "react-router-dom";
import { BotColorsProvider } from "./BotColorsProvider";
import { BotConfigProvider } from "./BotConfigProvider";
import { BotDomainProvider } from "./BotDomainProvider";
import { BotInfoProvider } from "./BotInfoProvider";
import { BotLayoutProvider } from "./BotLayoutProvider";
import { BotPlottedElementsProvider } from "./BotPlottedElementsProvider";
import { VisibleTimeFramesProvider } from "./VisibleTimeFrameProvider/VisibleTimeFrameProvider";

export default function BotDataProvider({ defaultDomain, children }) {
  return (
    <BrowserRouter>
      <BotDomainProvider defaultDomain={defaultDomain}>
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
    </BrowserRouter>
  );
}

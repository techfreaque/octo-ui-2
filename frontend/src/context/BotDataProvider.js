import React from "react";
import { BotColorsProvider } from "./BotColorsProvider";
import { BotConfigProvider } from "./BotConfigProvider";
import { BotDomainProvider } from "./BotDomainProvider";
import { BotInfoProvider } from "./BotInfoProvider";
import { BotLayoutProvider } from "./BotLayoutProvider";
import { BotPlottedElementsProvider } from "./BotPlottedElementsProvider";

export default function BotDataProvider({ defaultDomain, children }){
  return (
    <BotDomainProvider defaultDomain={defaultDomain}>
      <BotInfoProvider>
        <BotLayoutProvider>
          <BotColorsProvider>
            <BotPlottedElementsProvider>
              <BotConfigProvider>
                {children}
              </BotConfigProvider>
            </BotPlottedElementsProvider>
          </BotColorsProvider>
        </BotLayoutProvider>
      </BotInfoProvider>
    </BotDomainProvider>
  );
};

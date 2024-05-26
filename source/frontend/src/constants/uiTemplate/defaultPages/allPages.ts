import type { BotLayoutType } from "../../../context/config/UiConfigProvider";
import { defaultStrategyDesignerPageLayout } from "./strategyDesigner";

export const defaultBotTemplate: BotLayoutType = {
  isCustom: false, // set to true to keep your changes
  // add more pages here
  layouts: [defaultStrategyDesignerPageLayout],
};

import { defaultPackageManagerPageLayout } from "./packageManager";
import { defaultPageBuilderPageLayout } from "./pageBuilder";
import { defaultStrategyDesignerPageLayout } from "./strategyDesigner";

export const defaultBotTemplate = {
    isCustom: false, // set to true to keep your changes
    layouts: [defaultStrategyDesignerPageLayout, defaultPackageManagerPageLayout, defaultPageBuilderPageLayout]
};

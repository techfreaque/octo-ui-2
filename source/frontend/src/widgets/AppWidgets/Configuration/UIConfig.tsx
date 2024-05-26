import JsonEditor from "@techfreaque/json-editor-react";
import type { JsonEditorType } from "@techfreaque/json-editor-react/dist/components/JsonEditor";
import { t } from "i18next";
import { useCallback, useMemo } from "react";

import type { errorResponseCallBackParams } from "../../../api/fetchAndStoreFromBot";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";
import createNotification from "../../../components/Notifications/Notification";
import type { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import type {
  BacktestingUiConfig,
  OptimizerUiConfig,
  UiConfigKeyType,
  UiConfigType,
  UiSubConfigsType,
} from "../../../context/config/UiConfigProvider";
import {
  useSaveUiConfig,
  useUiConfigContext,
} from "../../../context/config/UiConfigProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import type { UiConfigSubSchemaType } from "./uiConfigSchema";
import { getUiConfigSchema } from "./uiConfigSchema";

export const flowEditorSettingsName = "flow_editor_settings";
export const availableUIConfigKeys: UiConfigKeyType[] = [
  "backtesting_run_settings",
  "optimizer_campaigns_to_load",
  "optimizer_run_settings",
  "display_settings",
  "optimization_campaign",
  flowEditorSettingsName,
];
const storageName = "uiConfig";

export default function UIConfig({ configKeys }: UiLayoutPageLayoutType) {
  const uiConfig = useUiConfigContext();
  const botInfo = useBotInfoContext();
  const saveUiConfig = useSaveUiConfig();
  const handleEditorsAutosave = useCallback(
    (
      editor: JsonEditorType<UiSubConfigsType, UiConfigSubSchemaType>,
      configKey: UiConfigKeyType
    ) => {
      const newConfigs: UiConfigType = {
        ...uiConfig,
        [configKey]: convertTimestamps(editor.getValue(), true),
      };
      function errorCallback(payload: errorResponseCallBackParams) {
        createNotification({
          title: t("uiConfig.failed-to-autosave-ui-config"),
          message: `Error: ${payload.data}`,
        });
      }
      if (newConfigs) {
        saveUiConfig(newConfigs, undefined, errorCallback);
      }
    },
    [saveUiConfig, uiConfig]
  );
  return useMemo(() => {
    const dataFiles = botInfo?.data_files;
    const currentSymbols = botInfo?.symbols;
    const availableExchanges = botInfo?.exchange_names;
    return (
      <div>
        {botInfo &&
          uiConfig &&
          configKeys?.map((configKey) => {
            const schema = getUiConfigSchema(
              configKey,
              dataFiles,
              currentSymbols,
              availableExchanges
            );
            const config = convertTimestamps(
              uiConfig[configKey] as UiSubConfigsType
            );
            if (
              schema?.properties?.["exchange_names"]?.items?.enum &&
              (config as
                | BacktestingUiConfig
                | OptimizerUiConfig
                | undefined)?.exchange_names?.some(
                (_exchange) =>
                  !schema?.properties?.["exchange_names"]?.items?.enum.includes(
                    _exchange
                  )
              )
            ) {
              (config as
                | BacktestingUiConfig
                | OptimizerUiConfig).exchange_names =
                schema.properties["exchange_names"].items.enum;
            }
            return (
              <JsonEditor
                {...defaultJsonEditorSettings()}
                schema={schema}
                startval={config}
                storageName={storageName}
                editorName={`${configKey}${configKeys}`}
                onChange={(editor) => handleEditorsAutosave(editor, configKey)}
                disable_collapse={true}
                key={configKey}
                // language="es"
                // languages={{
                //     es: {
                //         button_save: "Save",
                //         button_copy: "Copy",
                //         button_cancel: "Cancel",
                //         button_add: "Add",
                //     }
                // }}
              />
            );
          })}
      </div>
    );
  }, [botInfo, configKeys, uiConfig, handleEditorsAutosave]);
}

function convertTimestamps(
  config: UiSubConfigsType,
  convertBack = false
): UiSubConfigsType {
  const newValues: any = {};
  config &&
    Object.entries(config).forEach(([configOptionKey, configOption]) => {
      if (configOptionKey.includes("timestamp")) {
        newValues[configOptionKey] = convertBack
          ? configOption * 1000
          : configOption / 1000;
      } else {
        newValues[configOptionKey] = configOption;
      }
    });
  return newValues;
}

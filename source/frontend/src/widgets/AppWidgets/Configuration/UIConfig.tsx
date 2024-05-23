import "./uiConfig.css";

import JsonEditor from "@techfreaque/json-editor-react";
import { JsonEditorType } from "@techfreaque/json-editor-react/dist/components/JsonEditor";
import { useCallback, useMemo } from "react";

import { errorResponseCallBackParams } from "../../../api/fetchAndStoreFromBot";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";
import createNotification from "../../../components/Notifications/Notification";
import {
  BacktestingAnalysisUiConfig,
  BacktestingUiConfig,
  DisplaySettingsUiConfig,
  FlowSettingsUiConfig,
  LiveAnalysisUiConfig,
  OptimizerCampaignsToLoadUiConfig,
  OptimizerInputsUiConfig,
  OptimizerUiConfig,
  UiConfigKeyType,
  UiConfigType,
  UiSubConfigsType,
  useSaveUiConfig,
  useUiConfigContext,
} from "../../../context/config/UiConfigProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import { getUiConfigSchema } from "./uiConfigSchema";

export const flowEditorSettingsName = "flow_editor_settings";
export const availableUIConfigKeys: UiConfigKeyType[] = [
  "backtesting_run_settings",
  "backtesting_analysis_settings",
  "live_analysis_settings",
  "optimizer_campaigns_to_load",
  "optimizer_run_settings",
  "display_settings",
  "optimization_campaign",
  flowEditorSettingsName,
];
const storageName = "uiConfig";

export default function UIConfig({
  configKeys,
}: {
  configKeys: UiConfigKeyType[];
}) {
  const uiConfig = useUiConfigContext();
  const botInfo = useBotInfoContext();
  const saveUiConfig = useSaveUiConfig();
  const handleEditorsAutosave = useCallback(
    (
      editor: JsonEditorType<
        | OptimizerUiConfig
        | BacktestingUiConfig
        | BacktestingAnalysisUiConfig
        | LiveAnalysisUiConfig
        | OptimizerCampaignsToLoadUiConfig
        | OptimizerInputsUiConfig
        | DisplaySettingsUiConfig
        | FlowSettingsUiConfig
      >,
      configKey: UiConfigKeyType
    ) => {
      const newConfigs: UiConfigType = {
        ...uiConfig,
        [configKey]: convertTimestamps(editor.getValue(), true),
      };
      function errorCallback(payload: errorResponseCallBackParams) {
        createNotification({
          title: "Failed to autosave UI config",
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
          configKeys.map((configKey) => {
            const schema = getUiConfigSchema(
              configKey,
              dataFiles,
              currentSymbols,
              availableExchanges
            );
            const config = convertTimestamps(uiConfig[configKey]);
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

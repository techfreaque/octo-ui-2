import { Tab } from "@mui/material";
import MuiTabs, { MuiTabType } from "../../../components/Tabs/MuiTabs";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";
import {
  userInputKey,
  validateJSONEditor,
} from "../../../components/UserInputs/utils";
import createNotification from "../../../components/Notifications/Notification";
import {
  useBotInfoContext,
  useIsDemoMode,
} from "../../../context/data/BotInfoProvider";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
import {
  SaveTentaclesConfigType,
  TentaclesConfigsRootType,
  tentacleConfigTypes,
  useSaveTentaclesConfig,
  useTentaclesConfigContext,
} from "../../../context/config/TentaclesConfigProvider";
import { useFetchTentaclesConfig } from "../../../context/config/TentaclesConfigProvider";
import { SaveOutlined } from "@ant-design/icons";
import { sizes } from "../../../constants/frontendConstants";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import { successResponseCallBackParams } from "../../../api/fetchAndStoreFromBot";
import { AntSideBarMenutItemType } from "../../../components/Sidebars/AntSidebar/AntSidebar";
import JsonEditor from "@techfreaque/json-editor-react";
import {
  JsonEditorType,
  JsonEditorWindow,
} from "@techfreaque/json-editor-react/dist/components/JsonEditor";

export function useCurrentTentacleConfig(
  tentacleType = tentacleConfigTypes.tentacles
) {
  const currentTentaclesConfig = useTentaclesConfigContext();
  return currentTentaclesConfig?.[tentacleType];
}

export default function TentaclesConfig({
  content,
  tentacleNames = "RunAnalysisModePlugin",
  additionalTabs = [],
}) {
  const botInfo = useBotInfoContext();
  const fetchTentaclesConfig = useFetchTentaclesConfig();
  const currentTentaclesConfig = useTentaclesConfigContext();
  const currentTentaclesNonTradingConfig =
    currentTentaclesConfig?.[tentacleConfigTypes.tentacles];
  const tentacles = tentacleNames.split(",");
  const saveTentaclesConfig = useSaveTentaclesConfig();
  useEffect(() => {
    fetchTentaclesConfig(tentacleNames.split(","));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botInfo]);
  const _additionalTabs = useGetAdditionalTabs(additionalTabs);
  return useMemo(() => {
    if (!currentTentaclesNonTradingConfig) {
      return;
    }
    function handleTentaclesUpdate() {
      fetchTentaclesConfig(tentacleNames.split(","));
    }
    const configs = {};
    tentacles?.forEach((tentacle) => {
      configs[tentacle] = currentTentaclesNonTradingConfig?.[tentacle] || {};
    });
    return (
      <AbstractTentaclesConfig
        fetchCurrentTentaclesConfig={handleTentaclesUpdate}
        currentTentaclesTradingConfig={configs}
        saveTentaclesConfig={saveTentaclesConfig}
        content={content}
        additionalTabsAfter={_additionalTabs}
        storageName={tentacleNames}
      />
    );
  }, [
    _additionalTabs,
    content,
    currentTentaclesNonTradingConfig,
    fetchTentaclesConfig,
    saveTentaclesConfig,
    tentacleNames,
    tentacles,
  ]);
}

function useGetAdditionalTabs(additionalTabs) {
  return useMemo(
    () =>
      additionalTabs?.map((tab) => {
        const tabId = tab.title.replace(/ /g, "_");
        return {
          ...tab,
          tabId,
          title: (
            <Tab
              key={tabId}
              label={tab.title}
              value={tabId}
              sx={{ textTransform: "none" }}
            />
          ),
          content: <AppWidgets layout={tab.content} />,
        };
      }),
    [additionalTabs]
  );
}

export function AbstractTentaclesConfig({
  fetchCurrentTentaclesConfig,
  currentTentaclesTradingConfig,
  saveTentaclesConfig,
  setHiddenMetadataColumns,
  content,
  storageName = "tradingConfig",
  additionalTabs,
  additionalTabsAfter,
}: {
  fetchCurrentTentaclesConfig: (
    successCallback?:
      | ((payload: successResponseCallBackParams) => void)
      | undefined
  ) => void;
  currentTentaclesTradingConfig: TentaclesConfigsRootType | undefined;
  saveTentaclesConfig: SaveTentaclesConfigType;
  setHiddenMetadataColumns?;
  content: UiLayoutPageLayoutType[] | undefined;
  storageName?;
  additionalTabs?;
  additionalTabsAfter?;
}) {
  const botInfo = useBotInfoContext();
  const botDomain = useBotDomainContext();
  const exchangeId = botInfo?.exchange_id;
  const [tabs, setTabs] = useState<TentacleConfigTabsData[]>();
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (currentTentaclesTradingConfig) {
      setTabs(
        generateTradingConfigTabs({
          displayStyle: displayStyles.tabs,
          userInputs: currentTentaclesTradingConfig,
          setHiddenMetadataColumns,
          storageName,
          additionalTabs,
          additionalTabsAfter,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTentaclesTradingConfig]);
  useEffect(() => {
    fetchCurrentTentaclesConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeId, botDomain, botInfo]);
  const defaultTabId =
    storageName === "tradingConfig"
      ? botInfo?.trading_mode_name || botInfo?.strategy_name
      : tabs
      ? tabs?.[0]?.tabId
      : 0;
  function handleUserInputSave() {
    saveUserInputs(
      (newConfigs) =>
        saveTentaclesConfig(
          newConfigs,
          setIsSaving,
          true,
          storageName === "tradingConfig"
        ),
      setIsSaving,
      storageName
    );
  }
  const isDemo = useIsDemoMode();
  return useMemo(() => {
    return tabs && defaultTabId ? (
      <MuiTabs
        tabs={tabs}
        rightContent={
          <>
            {content && <AppWidgets layout={content} />}
            <AntButton
              buttonType={buttonTypes.primary}
              disabled={isSaving || isDemo}
              onClick={handleUserInputSave}
              antIconComponent={SaveOutlined}
              iconSize={sizes.medium}
            />
          </>
        }
        defaultTabId={defaultTabId}
      />
    ) : (
      <></>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, defaultTabId, content, isSaving]);
}

// export function useSidebarTentaclesConfig({
//     fetchCurrentTentaclesConfig,
//     currentTentaclesTradingConfig,
//     saveTentaclesConfig,
//     setHiddenMetadataColumns,
//     content,
//     storageName = "tradingConfig",
//     additionalTabs,
//     additionalTabsAfter
// }) {
//     const botInfo = useBotInfoContext()
//     const botDomain = useBotDomainContext()
//     const exchangeId = botInfo ?. exchange_id
//     const [tabs, setTabs] = useState()
//     useEffect(() => {
//         if (currentTentaclesTradingConfig) {
//             setTabs(tradingConfigTabs({
//                 displayStyle: displayStyles.sidebar,
//                 userInputs: currentTentaclesTradingConfig,
//                 setHiddenMetadataColumns,
//                 exchangeId,
//                 botDomain,
//                 storageName,
//                 additionalTabs,
//                 additionalTabsAfter
//             }));
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [currentTentaclesTradingConfig]);
//     useEffect(() => {
//         fetchCurrentTentaclesConfig()
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [exchangeId, botDomain, botInfo]);
//     const defaultTabId = storageName === "tradingConfig" ? botInfo ?. trading_mode_name || botInfo ?. strategy_name : (tabs ? tabs ?. [0] ?. tabId : "")
//     function handleUserInputSave() {
//         saveUserInputs((newConfigs) => saveTentaclesConfig(newConfigs, setIsSaving, true, storageName === "tradingConfig"), setIsSaving, storageName)
//     }
//     return tabs
// }

export const displayStyles = {
  tabs: "tabs",
  sidebar: "sidebar",
};

export type StrategyFlowMakerNameType = "StrategyFlowMakerMode";

export const strategyFlowMakerName = "StrategyFlowMakerMode";

export interface TentacleConfigTabsData
  extends AntSideBarMenutItemType,
    MuiTabType {}

export function generateTradingConfigTabs({
  userInputs,
  setHiddenMetadataColumns,
  storageName = "tradingConfig",
  additionalTabs = [],
  additionalTabsAfter = [],
  displayStyle,
}: {
  userInputs: TentaclesConfigsRootType;
  setHiddenMetadataColumns?;
  storageName;
  additionalTabs?;
  additionalTabsAfter?;
  displayStyle?;
}): TentacleConfigTabsData[] {
  const tabsData: TentacleConfigTabsData[] = [];
  // window.trading_mode_objects = {}
  destroyAllEditors(storageName);
  // avoid working on original elements as they will be edited for custom user inputs
  createCustomDisplayAsTabInputsStorage(storageName);
  const tentacleNames = Object.keys(userInputs);
  const editedUserInputs: TentaclesConfigsRootType = JSON.parse(
    JSON.stringify(userInputs)
  );
  tentacleNames.forEach((tentacleName) => {
    // _applyCustomPathUserInputs(editedUserInputs, tradingModeName);
    create_custom_tabs({
      tentacleInputs: editedUserInputs[tentacleName],
      tabsData,
      storageName,
      displayStyle,
    });
    if (setHiddenMetadataColumns) {
      _handleHiddenUserInputs(editedUserInputs, setHiddenMetadataColumns);
    }
    _createTentacleConfigTab({
      configTitle:
        storageName === "tradingConfig"
          ? replaceUppercaseWithSpace(editedUserInputs[tentacleName].tentacle)
          : editedUserInputs[tentacleName].tentacle,
      configName: editedUserInputs[tentacleName].tentacle,
      config: editedUserInputs[tentacleName].config,
      schema: editedUserInputs[tentacleName].schema,
      editorKey: editedUserInputs[tentacleName].tentacle_type,
      antIcon:
        editedUserInputs[tentacleName].tentacle_type === "trading_mode"
          ? "BranchesOutlined"
          : editedUserInputs[tentacleName].tentacle_type === "evaluator"
          ? "ControlOutlined"
          : undefined,
      tabsData,
      storageName,
      displayStyle,
    });
  });
  tabsData.sort((a, b) => {
    if ((a.order || 0) < (b.order || 0)) {
      return -1;
    }
    if ((a.order || 0) > (b.order || 0)) {
      return 1;
    }
    return 0;
  });
  return [...additionalTabs, ...tabsData, ...additionalTabsAfter];
}

export function replaceUppercaseWithSpace(string: string) {
  return string
    ?.split(/(?=[A-Z])/)
    .join(" ")
    .replace(/_/g, " ");
}

function getCustomDisplayAsTabInputsStorage(storageName: string) {
  return window.customDisplayAsTabInputs[storageName];
}

function createCustomDisplayAsTabInputsStorage(storageName: string) {
  if (!window.customDisplayAsTabInputs) {
    window.customDisplayAsTabInputs = {};
  }
  window.customDisplayAsTabInputs = {
    ...window.customDisplayAsTabInputs,
    [storageName]: {},
  };
}

function create_custom_tabs({
  tentacleInputs,
  tabsData,
  storageName,
  displayStyle,
}: {
  tentacleInputs;
  tabsData;
  storageName;
  displayStyle;
}) {
  const tentaclesInfoStorage = getCustomDisplayAsTabInputsStorage(storageName);
  tentaclesInfoStorage[tentacleInputs.tentacle] = [];
  // gather custom user inputs
  tentacleInputs?.schema?.properties &&
    Object.keys(tentacleInputs.schema.properties).forEach((key) => {
      const property = tentacleInputs.schema.properties[key];
      if (!property.display_as_tab) {
        return;
      }
      tentaclesInfoStorage[tentacleInputs.tentacle].push(key);
      _createTentacleConfigTab({
        configTitle: tentacleInputs.schema.properties[key].title,
        configName: key,
        config: tentacleInputs.config[key],
        schema: tentacleInputs.schema.properties[key],
        editorKey: tentacleInputs.tentacle,
        tabsData,
        storageName,
        antIcon: tentacleInputs.schema.properties[key]?.options?.antIcon,
        displayStyle,
      });
      delete tentacleInputs.config[key];
      delete tentacleInputs.schema.properties[key];
    });
}

function destroyAllEditors(storageName) {
  window[`$${storageName}`] &&
    Object.keys(window[`$${storageName}`]).forEach((editorKey) => {
      window[`$${storageName}`][editorKey].destroy();
      delete window[`$${storageName}`][editorKey];
    });
}

function _handleHiddenUserInputs(
  elements: TentaclesConfigsRootType,
  setHiddenMetadataColumns
) {
  let hiddenMetadataColumns: string[] = [];
  Object.values(elements).forEach((inputDetails) => {
    hiddenMetadataColumns = hiddenMetadataColumns.concat(
      _hideNotShownUserInputs(
        inputDetails.tentacle,
        inputDetails.schema,
        inputDetails.is_hidden
      )
    );
  });
  setHiddenMetadataColumns(hiddenMetadataColumns);
}

export type TentacleConfigWindow = JsonEditorWindow & {
  customDisplayAsTabInputs: {
    [editorName: string]: {
      [tentacleName: string]: string[];
    };
  };
};

declare const window: TentacleConfigWindow;

export function saveUserInputs(
  saveTentaclesConfig,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  storageName = "tradingConfig"
) {
  setIsLoading?.(true);
  const tentaclesConfigByTentacle = {};
  let save = true;
  Object.keys(window[`$${storageName}`]).forEach((editorKey) => {
    const editor: JsonEditorType<any> = window[`$${storageName}`][editorKey];
    if (!editor) {
      return;
    }
    const tentacle = editorKey.split("##")[1];
    const errorsDesc = validateJSONEditor(editor);
    if (errorsDesc) {
      save = false;
      setIsLoading(false);
      createNotification({
        title: `Error when saving ${editorKey} configuration`,
        type: "danger",
        message: `${errorsDesc}`,
      });
      return;
    }
    tentaclesConfigByTentacle[tentacle] = editor.getValue();
  });
  if (save) {
    // _restoreCustomUserInputs(tentaclesConfigByTentacle);
    _restoreCustomDisplayAsTabInputs(tentaclesConfigByTentacle, storageName);
    saveTentaclesConfig(tentaclesConfigByTentacle);
  }
}

function _restoreCustomDisplayAsTabInputs(
  tentaclesConfigByTentacle,
  storageName: string
) {
  const storage = getCustomDisplayAsTabInputsStorage(storageName);
  storage &&
    Object.entries(storage).forEach(([tentacleName, editors]) => {
      editors?.forEach((configKey) => {
        if (!tentaclesConfigByTentacle[tentacleName]) {
          tentaclesConfigByTentacle[tentacleName] = {};
        }
        tentaclesConfigByTentacle[tentacleName][configKey] =
          tentaclesConfigByTentacle[configKey];
        delete tentaclesConfigByTentacle[configKey];
      });
    });
}

function _createTentacleConfigTab({
  configTitle,
  configName,
  config,
  schema,
  editorKey,
  tabsData,
  storageName,
  displayStyle,
  antIcon,
}: {
  configTitle;
  configName;
  config;
  schema;
  editorKey;
  tabsData;
  storageName;
  displayStyle;
  antIcon;
}) {
  if (schema) {
    _addGridDisplayOptions(schema, editorKey);
  }
  if (schema?.properties) {
    try {
      Object.values(schema?.properties).forEach(
        (property) => property && _addGridDisplayOptions(property, null)
      );
      schema.options.disable_collapse = true;
      Object.keys(schema?.properties).length !== 0 &&
        tabsData.push(
          displayStyle === displayStyles.tabs
            ? createTab({
                configName,
                schema,
                config,
                configTitle,
                editorKey,
                storageName,
                antIcon,
              })
            : createSidebarItem({
                configName,
                schema,
                config,
                configTitle,
                editorKey,
                storageName,
                antIcon,
              })
        );
    } catch (error) {
      window.console && console.error(error);
    }
  }
}

function createSidebarItem({
  configName,
  schema,
  config,
  configTitle,
  editorKey,
  storageName,
  antIcon,
}) {
  return {
    label: configTitle.replace(/_/g, " "),
    key: configName,
    antIcon,
    order: schema?.order || 0,
    content: (
      <JsonEditor
        schema={schema}
        startval={config}
        editorName={`${editorKey}##${configName}`}
        {...defaultJsonEditorSettings()}
        display_required_only={true}
        storageName={storageName}
      />
    ),
  };
}

function createTab({
  configName,
  schema,
  config,
  configTitle,
  editorKey,
  storageName,
  antIcon,
}: {
  configName;
  schema;
  config;
  configTitle;
  editorKey;
  storageName;
  antIcon;
}) {
  return {
    title: (
      <Tab
        key={configName}
        label={configTitle.replace(/_/g, " ")}
        value={configName}
        sx={{ textTransform: "none" }}
      />
    ),
    tabId: configName,
    order: schema?.order || 0,
    content: (
      <JsonEditor
        schema={schema}
        startval={config}
        editorName={`${editorKey}##${configName}`}
        {...defaultJsonEditorSettings()}
        display_required_only={true}
        storageName={storageName}
      />
    ),
  };
}

function _addGridDisplayOptions(schema, editorKey) {
  if (typeof schema.format === "undefined") {
    // display user inputs as grid
    schema.format = "grid";
  }
  if (typeof schema.options === "undefined") {
    schema.options = {};
  }
  if (schema.grid_columns) {
    schema.options.grid_columns = schema.grid_columns;
  }
  if (typeof schema.options.grid_columns === "undefined") {
    schema.options.grid_columns = 12;
  }
}

function _hideNotShownUserInputs(
  tentacle: string,
  schema,
  is_hidden: boolean
): string[] {
  let hiddenColumns: string[] = [];
  schema?.properties &&
    Object.keys(schema.properties).forEach((key) => {
      const value = schema.properties[key];
      if (typeof value.properties === "object") {
        hiddenColumns = hiddenColumns.concat(
          _hideNotShownUserInputs(key, value, false)
        );
      } else if (is_hidden || !value.options.in_summary) {
        hiddenColumns.push(userInputKey(key, tentacle).replaceAll("_", " "));
      }
    });
  return hiddenColumns;
}

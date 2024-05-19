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
  TentacleType,
  TentaclesConfigByTentacleType,
  TentaclesConfigRootType,
  TentaclesConfigValueType,
  TentaclesConfigsRootType,
  TentaclesConfigsSchemaType,
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
import { JsonEditorWindow } from "@techfreaque/json-editor-react/dist/components/JsonEditor";

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
}: {
  content: UiLayoutPageLayoutType[] | undefined;
  tentacleNames: StorageNameType;
  additionalTabs: UiLayoutPageLayoutType[] | undefined;
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
    const configs: TentaclesConfigsRootType = {};
    tentacles?.forEach((tentacle) => {
      const _config = currentTentaclesNonTradingConfig?.[tentacle];
      if (_config) {
        configs[tentacle] = _config;
      }
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

function useGetAdditionalTabs(
  additionalTabs: UiLayoutPageLayoutType[] | undefined
): TentacleConfigTabsData[] | undefined {
  return useMemo(
    () =>
      additionalTabs?.map((tab) => {
        const tabId = (tab.title || tab.component).replace(/ /g, "_");
        return {
          antIcon: tab.antIcon,
          dontScroll: tab.dontScroll || false,
          faIcon: tab.faIcon,
          toolBarContent: <AppWidgets layout={tab.toolBarContent} />,
          key: tabId,
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
  content,
  storageName = "tradingConfig",
  additionalTabsAfter,
}: {
  fetchCurrentTentaclesConfig: (
    successCallback?:
      | ((payload: successResponseCallBackParams) => void)
      | undefined
  ) => void;
  currentTentaclesTradingConfig: TentaclesConfigsRootType | undefined;
  saveTentaclesConfig: SaveTentaclesConfigType;
  content: UiLayoutPageLayoutType[] | undefined;
  storageName: StorageNameType;
  additionalTabsAfter: TentacleConfigTabsData[] | undefined;
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
          storageName,
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
      (newConfigs: TentaclesConfigByTentacleType) =>
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

type DisplayStyleType = "tabs" | "sidebar";

export const displayStyles: {
  tabs: DisplayStyleType;
  sidebar: DisplayStyleType;
} = {
  tabs: "tabs",
  sidebar: "sidebar",
};

export type StrategyFlowMakerNameType = "StrategyFlowMakerMode";

export const strategyFlowMakerName = "StrategyFlowMakerMode";

export interface TentacleConfigTabsData
  extends AntSideBarMenutItemType,
    MuiTabType {}

type StorageNameType = "tradingConfig" | "RunAnalysisModePlugin";

export function generateTradingConfigTabs({
  userInputs,
  setHiddenMetadataColumns,
  storageName = "tradingConfig",
  additionalTabsAfter,
  displayStyle,
}: {
  userInputs: TentaclesConfigsRootType;
  setHiddenMetadataColumns?: Dispatch<SetStateAction<string[] | undefined>>;
  storageName: StorageNameType;
  additionalTabsAfter?: TentacleConfigTabsData[] | undefined;
  displayStyle: DisplayStyleType;
}): TentacleConfigTabsData[] {
  const tabsData: TentacleConfigTabsData[] = [];
  // window.trading_mode_objects = {}
  destroyAllEditors(storageName);
  // avoid working on original elements as they will be edited for custom user inputs
  const tentaclesInfoStorage: TentacleInfoStorageType = createCustomDisplayAsTabInputsStorage(
    storageName
  );
  const editedUserInputs: TentaclesConfigsRootType = JSON.parse(
    JSON.stringify(userInputs)
  );
  Object.values(editedUserInputs).forEach((tentacleInputs) => {
    // _applyCustomPathUserInputs(editedUserInputs, tradingModeName);
    create_custom_tabs({
      tentacleInputs,
      tabsData,
      storageName,
      displayStyle,
      tentaclesInfoStorage,
    });
    if (setHiddenMetadataColumns) {
      handleHiddenUserInputs(editedUserInputs, setHiddenMetadataColumns);
    }
    _createTentacleConfigTab({
      configTitle:
        storageName === "tradingConfig"
          ? replaceUppercaseWithSpace(tentacleInputs.tentacle)
          : tentacleInputs.tentacle,
      configName: tentacleInputs.tentacle,
      config: tentacleInputs.config,
      schema: tentacleInputs.schema,
      editorKey: tentacleInputs.tentacle_type,
      antIcon:
        tentacleInputs.tentacle_type === "trading_mode"
          ? "BranchesOutlined"
          : tentacleInputs.tentacle_type === "evaluator"
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
  return additionalTabsAfter ? [...tabsData, ...additionalTabsAfter] : tabsData;
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

function createCustomDisplayAsTabInputsStorage(
  storageName: string
): TentacleInfoStorageType {
  if (!window.customDisplayAsTabInputs) {
    window.customDisplayAsTabInputs = {};
  }
  window.customDisplayAsTabInputs = {
    ...window.customDisplayAsTabInputs,
    [storageName]: {},
  };
  return window.customDisplayAsTabInputs[
    storageName
  ] as TentacleInfoStorageType;
}

function create_custom_tabs({
  tentacleInputs,
  tabsData,
  storageName,
  displayStyle,
  tentaclesInfoStorage,
}: {
  tentacleInputs: TentaclesConfigRootType | undefined;
  tabsData: TentacleConfigTabsData[];
  storageName: StorageNameType;
  displayStyle: DisplayStyleType;
  tentaclesInfoStorage: TentacleInfoStorageType;
}) {
  const infoStorage: string[] = [];
  // gather custom user inputs
  const schemaProperties = tentacleInputs?.schema?.properties;
  if (schemaProperties) {
    Object.entries(schemaProperties).forEach(([propertyKey, property]) => {
      if (!property.display_as_tab) {
        return;
      }
      infoStorage.push(propertyKey);
      _createTentacleConfigTab({
        configTitle: property.title,
        configName: propertyKey,
        config: tentacleInputs.config[propertyKey],
        schema: property,
        editorKey: tentacleInputs.tentacle,
        tabsData,
        storageName,
        antIcon: property?.options?.antIcon,
        displayStyle,
      });
      delete tentacleInputs.config[propertyKey];
      delete schemaProperties[propertyKey];
    });
    tentaclesInfoStorage[tentacleInputs.tentacle] = infoStorage;
  }
}

function destroyAllEditors(storageName: StorageNameType) {
  const storage = window[`$${storageName}`];
  storage &&
    Object.entries(storage).forEach(([editorKey, editor]) => {
      editor.destroy();
      delete storage[editorKey];
    });
}

export function handleHiddenUserInputs(
  elements: TentaclesConfigsRootType,
  setHiddenMetadataColumns: Dispatch<SetStateAction<string[] | undefined>>
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

type CustomDisplayAsTabInputsType = {
  [editorName: string]: TentacleInfoStorageType;
};

type TentacleInfoStorageType = {
  [tentacleName: string]: string[];
};

export type TentacleConfigWindow = JsonEditorWindow & {
  customDisplayAsTabInputs: CustomDisplayAsTabInputsType;
};

declare const window: TentacleConfigWindow;

export function saveUserInputs(
  saveTentaclesConfig: (currentConfig: TentaclesConfigByTentacleType) => void,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  storageName = "tradingConfig"
) {
  setIsLoading?.(true);
  const tentaclesConfigByTentacle: TentaclesConfigByTentacleType = {};
  let save = true;
  const storage = window[`$${storageName}`];
  storage &&
    Object.entries(storage).forEach(([editorKey, editor]) => {
      if (!editor) {
        return;
      }
      const tentacle = `${editorKey.split("##")[1]}`;
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
  tentaclesConfigByTentacle: TentaclesConfigByTentacleType,
  storageName: string
) {
  const storage = getCustomDisplayAsTabInputsStorage(storageName);
  storage &&
    Object.entries(storage).forEach(([tentacleName, editors]) => {
      editors?.forEach((configKey) => {
        const configToMove = tentaclesConfigByTentacle[configKey];
        if (configToMove) {
          tentaclesConfigByTentacle[tentacleName] = {
            ...tentaclesConfigByTentacle[tentacleName],
            [configKey]: configToMove,
          };
          delete tentaclesConfigByTentacle[configKey];
        }
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
  configTitle: string;
  configName: string;
  config: TentaclesConfigValueType | undefined;
  schema: TentaclesConfigsSchemaType;
  editorKey: TentacleType | string;
  tabsData: TentacleConfigTabsData[];
  storageName: StorageNameType;
  displayStyle: DisplayStyleType;
  antIcon: string | undefined;
}) {
  if (schema) {
    _addGridDisplayOptions(schema);
  }
  if (schema?.properties) {
    try {
      Object.values(schema?.properties).forEach(
        (property) => property && _addGridDisplayOptions(property)
      );
      schema.options = { ...schema.options, disable_collapse: true };
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
      console.error(error);
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
}: {
  configName: string;
  config: TentaclesConfigValueType | undefined;
  schema: TentaclesConfigsSchemaType;
  configTitle: string;
  editorKey: TentacleType | string;
  storageName: StorageNameType;
  antIcon: string | undefined;
}): TentacleConfigTabsData {
  return {
    title: configTitle.replace(/_/g, " "),
    key: configName,
    tabId: configName,
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
  configName: string;
  config: TentaclesConfigValueType | undefined;
  schema: TentaclesConfigsSchemaType;
  configTitle: string;
  editorKey: TentacleType | string;
  storageName: StorageNameType;
  antIcon: string | undefined;
}): TentacleConfigTabsData {
  return {
    title: (
      <Tab
        key={configName}
        label={configTitle.replace(/_/g, " ")}
        value={configName}
        sx={{ textTransform: "none" }}
      />
    ),
    key: configName,
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

function _addGridDisplayOptions(schema: TentaclesConfigsSchemaType) {
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
  schema: TentaclesConfigsSchemaType,
  is_hidden: boolean
): string[] {
  let hiddenColumns: string[] = [];
  schema?.properties &&
    Object.entries(schema.properties).forEach(
      ([propertyKey, propertyValue]) => {
        if (typeof propertyValue.properties === "object") {
          hiddenColumns = hiddenColumns.concat(
            _hideNotShownUserInputs(propertyKey, propertyValue, false)
          );
        }
        if (is_hidden || !propertyValue.options?.in_summary) {
          hiddenColumns.push(userInputKey(propertyKey, tentacle));
        }
      }
    );
  return hiddenColumns;
}

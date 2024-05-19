import { ReloadOutlined } from "@ant-design/icons";
import {
  FlowEdgeConfigType,
  TentaclesConfigByTentacleType,
  TentaclesConfigValuesType,
  tentacleConfigTypes,
  useIsSavingTentaclesConfigContext,
  useSaveTentaclesConfig,
  useTentaclesConfigContext,
  useUpdateIsSavingTentaclesConfigContext,
} from "../../../../context/config/TentaclesConfigProvider";
import { useIsBotOnlineContext } from "../../../../context/data/IsBotOnlineProvider";
import AntButton from "../../../../components/Buttons/AntButton";
import {
  flowBuilderStorageKey,
  getNodeConfigKey,
} from "./CustomNodes/StrategyBlockNode";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { useIsDemoMode } from "../../../../context/data/BotInfoProvider";
import {
  useSaveUiConfig,
  useUiConfigContext,
} from "../../../../context/config/UiConfigProvider";
import { Space, Switch } from "antd";
import { flowEditorSettingsName } from "../UIConfig";
import createNotification from "../../../../components/Notifications/Notification";
import {
  errorResponseCallBackParams,
  successResponseCallBackParams,
} from "../../../../api/fetchAndStoreFromBot";
import { Edge, Node } from "reactflow";
import { EdgeData, NodeData } from "./StrategyFlowBuilder";
import {
  StrategyFlowMakerNameType,
  handleHiddenUserInputs,
  strategyFlowMakerName,
} from "../TentaclesConfig";
import { useUpdateHiddenBacktestingMetadataColumnsContext } from "../../../../context/data/BotPlottedElementsProvider";

export default function SaveStrategyFlowBuilderSettings({
  tradingModeKey,
  flowConfig,
  nodes,
  edges,
}: {
  tradingModeKey: StrategyFlowMakerNameType;
  flowConfig: TentaclesConfigValuesType;
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
}) {
  const isOnline = useIsBotOnlineContext();
  const handleUserInputSave = useSaveFlowBuilderSettings();
  const isDemo = useIsDemoMode();
  const uiConfig = useUiConfigContext();
  const saveUiConfig = useSaveUiConfig();
  const handleAutoSaveSettingChange = useCallback(
    (checked: boolean) => {
      const newConfigs = {
        ...uiConfig,
      };
      if (!newConfigs[flowEditorSettingsName]) {
        newConfigs[flowEditorSettingsName] = {};
      }
      newConfigs[flowEditorSettingsName].auto_save = checked;
      const successCallback = (payload: successResponseCallBackParams) => {
        createNotification({
          title: "Successfully changed autosave setting",
        });
      };
      const errorCallback = (payload: errorResponseCallBackParams) => {
        createNotification({
          title: "Failed to activate autosave",
          type: "danger",
          message: `Error: ${payload.data.message}` || payload.data,
        });
      };
      saveUiConfig(newConfigs, successCallback, errorCallback);
    },
    [saveUiConfig, uiConfig]
  );
  const setIsSaving = useUpdateIsSavingTentaclesConfigContext();
  const isSaving = useIsSavingTentaclesConfigContext();
  return useMemo(() => {
    const autoSave = uiConfig?.[flowEditorSettingsName]?.auto_save;
    return (
      <div
        style={{
          position: "absolute",
          marginTop: "10px",
          right: "10px",
          zIndex: 2,
        }}
      >
        <Space direction="horizontal">
          <Switch
            checked={autoSave}
            onChange={(checked) => handleAutoSaveSettingChange(checked)}
            checkedChildren="auto save on"
            unCheckedChildren="auto save off"
          />
          {!autoSave && (
            <AntButton
              onClick={() =>
                handleUserInputSave({
                  tradingModeKey,
                  flowConfig,
                  nodes,
                  edges,
                  setIsSaving,
                  reloadPlots: false,
                  successNotification: true,
                })
              }
              style={{ zIndex: 2 }}
              disabled={isSaving || !isOnline || isDemo}
              icon={
                <span style={{ marginRight: "5px" }}>
                  <ReloadOutlined spin={isSaving || !isOnline} />
                </span>
              }
            >
              Save
            </AntButton>
          )}
          <AntButton
            onClick={() =>
              handleUserInputSave({
                tradingModeKey,
                flowConfig,
                nodes,
                edges,
                setIsSaving,
                reloadPlots: true,
                successNotification: true,
              })
            }
            style={{ zIndex: 2 }}
            disabled={isSaving || !isOnline || isDemo}
            icon={
              <span style={{ marginRight: "5px" }}>
                <ReloadOutlined spin={isSaving || !isOnline} />
              </span>
            }
          >
            Save & Reload Plots
          </AntButton>
        </Space>
      </div>
    );
  }, [
    edges,
    flowConfig,
    handleAutoSaveSettingChange,
    handleUserInputSave,
    isDemo,
    isOnline,
    isSaving,
    nodes,
    setIsSaving,
    tradingModeKey,
    uiConfig,
  ]);
}

type JsonEditorWindow = Window & {
  [storageName: string]: {
    [editorName: string]: JSONEditor<any>;
  };
};

declare const window: JsonEditorWindow;

export function useGetFlowConfig(): TentaclesConfigValuesType | undefined {
  const currentTentaclesConfig = useTentaclesConfigContext();
  const setHiddenMetadataColumns = useUpdateHiddenBacktestingMetadataColumnsContext();
  return useMemo(() => {
    const currentTentaclesTradingConfig =
      currentTentaclesConfig?.[tentacleConfigTypes.tradingTentacles];
    const flowConfig =
      currentTentaclesTradingConfig?.[strategyFlowMakerName]?.config;
    currentTentaclesTradingConfig &&
      handleHiddenUserInputs(
        currentTentaclesTradingConfig,
        setHiddenMetadataColumns
      );
    return flowConfig;
  }, [currentTentaclesConfig, setHiddenMetadataColumns]);
}

export function getNodeEditor(nodeId: string) {
  return window?.[`$${flowBuilderStorageKey}`]?.[nodeId];
}

export function useSaveFlowBuilderSettings() {
  const saveTentaclesConfig = useSaveTentaclesConfig();
  return useCallback(
    ({
      tradingModeKey,
      flowConfig,
      nodes,
      edges,
      setIsSaving,
      reloadPlots = false,
      successNotification = false,
    }: {
      tradingModeKey: StrategyFlowMakerNameType;
      flowConfig: TentaclesConfigValuesType;
      nodes: Node<NodeData>[];
      edges: Edge<EdgeData>[];
      setIsSaving: Dispatch<SetStateAction<boolean>>;
      reloadPlots?: boolean;
      successNotification?: boolean;
    }) => {
      setIsSaving?.(true);
      const newConfigs: TentaclesConfigByTentacleType = {};
      newConfigs[tradingModeKey] = flowConfig;
      const newConfig = { ...flowConfig };
      const _nodes: {
        [nodeId: string]: {};
      } = {};
      for (const node of nodes) {
        const editor = getNodeEditor(node.id);
        const settings = editor?.getValue() || {};
        _nodes[node.id] = {
          ...node,
          [getNodeConfigKey(node.id)]: settings,
        };
      }
      newConfig.nodes = _nodes;
      newConfig.edges = edges as FlowEdgeConfigType[];
      newConfigs[tradingModeKey] = newConfig;
      saveTentaclesConfig(
        newConfigs,
        setIsSaving,
        reloadPlots,
        true,
        false,
        successNotification
      );
    },
    [saveTentaclesConfig]
  );
}

import { ReloadOutlined } from "@ant-design/icons";
import {
  TentaclesConfigsRootType,
  useIsSavingTentaclesConfigContext,
  useSaveTentaclesConfig,
  useUpdateIsSavingTentaclesConfigContext,
} from "../../../../context/config/TentaclesConfigProvider";
import { useIsBotOnlineContext } from "../../../../context/data/IsBotOnlineProvider";
import AntButton from "../../../../components/Buttons/AntButton";
import {
  flowBuilderStorageKey,
  getNodeConfigKey,
} from "./CustomNodes/StrategyBlockNode";
import { useCallback, useMemo } from "react";
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
import { StrategyFlowMakerNameType } from "../TentaclesConfig";

export default function SaveStrategyFlowBuilderSettings({
  tradingModeKey,
  config,
  nodes,
  edges,
}: {
  tradingModeKey: StrategyFlowMakerNameType;
  config: TentaclesConfigsRootType;
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
                  config,
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
                config,
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
    config,
    edges,
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

export function getNodeEditor(nodeId: string) {
  return window?.[`$${flowBuilderStorageKey}`]?.[nodeId];
}

export function useSaveFlowBuilderSettings() {
  const saveTentaclesConfig = useSaveTentaclesConfig();
  return useCallback(
    ({
      tradingModeKey,
      config,
      nodes,
      edges,
      setIsSaving,
      reloadPlots = false,
      successNotification = false,
    }: {
      tradingModeKey: StrategyFlowMakerNameType;
      config;
      nodes: Node<NodeData>[];
      edges: Edge<EdgeData>[];
      setIsSaving;
      reloadPlots?: boolean;
      successNotification?: boolean;
    }) => {
      setIsSaving?.(true);
      const newConfigs = {};
      newConfigs[tradingModeKey] = {
        ...config[tradingModeKey].config,
      };
      newConfigs[tradingModeKey].nodes = nodes.reduce((dict, node, index) => {
        const editor = getNodeEditor(node.id);
        const settings = editor?.getValue() || {};
        return (
          (dict[node.id] = {
            ...node,
            [getNodeConfigKey(node.id)]: settings,
          }),
          dict
        );
      }, {});
      newConfigs[tradingModeKey].edges = edges;
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

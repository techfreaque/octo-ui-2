import { ReloadOutlined } from "@ant-design/icons";
import { JsonEditorWindow } from "@techfreaque/json-editor-react/dist/components/JsonEditor";
import { Space, Switch } from "antd";
import { t } from "i18next";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { Trans } from "react-i18next";
import { Edge, Node } from "reactflow";

import { errorResponseCallBackParams } from "../../../../api/fetchAndStoreFromBot";
import AntButton from "../../../../components/Buttons/AntButton";
import createNotification from "../../../../components/Notifications/Notification";
import {
  FlowEdgeConfigType,
  tentacleConfigTypes,
  TentaclesConfigByTentacleType,
  TentaclesConfigValuesType,
  useIsSavingTentaclesConfigContext,
  useSaveTentaclesConfig,
  useTentaclesConfigContext,
  useUpdateIsSavingTentaclesConfigContext,
} from "../../../../context/config/TentaclesConfigProvider";
import {
  useSaveUiConfig,
  useUiConfigContext,
} from "../../../../context/config/UiConfigProvider";
import { useIsDemoMode } from "../../../../context/data/BotInfoProvider";
import { useUpdateHiddenBacktestingMetadataColumnsContext } from "../../../../context/data/BotPlottedElementsProvider";
import { useIsBotOnlineContext } from "../../../../context/data/IsBotOnlineProvider";
import {
  handleHiddenUserInputs,
  strategyFlowMakerName,
  StrategyFlowMakerNameType,
} from "../TentaclesConfig";
import { flowEditorSettingsName } from "../UIConfig";
import {
  flowBuilderStorageKey,
  getNodeConfigKey,
} from "./CustomNodes/StrategyBlockNode";
import { EdgeData, NodeData } from "./StrategyFlowBuilder";

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
      const successCallback = () => {
        createNotification({
          title: t(
            "strategyConfigurator.strategyFlowMaker.successfully-changed-autosave-setting"
          ),
        });
      };
      const errorCallback = (payload: errorResponseCallBackParams) => {
        createNotification({
          title: t(
            "strategyConfigurator.strategyFlowMaker.failed-to-activate-autosave"
          ),
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
            checkedChildren={t(
              "strategyConfigurator.strategyFlowMaker.auto-save-on"
            )}
            unCheckedChildren={t(
              "strategyConfigurator.strategyFlowMaker.auto-save-off"
            )}
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
              <Trans i18nKey="strategyConfigurator.strategyFlowMaker.save" />
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
            {autoSave
              ? t("strategyConfigurator.strategyFlowMaker.reload-plots")
              : t(
                  "strategyConfigurator.strategyFlowMaker.save-and-reload-plots"
                )}
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
        [nodeId: string]: any;
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

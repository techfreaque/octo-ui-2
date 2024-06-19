import { CloseCircleOutlined } from "@ant-design/icons";
import JsonEditor from "@techfreaque/json-editor-react";
import type { CSSProperties } from "react";
import { useCallback, useMemo } from "react";
import type { HandleType, ReactFlowState } from "reactflow";
import {
  getConnectedEdges,
  Handle,
  Position,
  useNodeId,
  useReactFlow,
  useStore,
  useStoreApi,
} from "reactflow";

import AntButton, {
  buttonSizes,
  buttonTypes,
  buttonVariants,
} from "../../../../../components/Buttons/AntButton";
import defaultJsonEditorSettings from "../../../../../components/Forms/JsonEditor/JsonEditorDefaults";
import { useBotColorsContext } from "../../../../../context/config/BotColorsProvider";
import type {
  TentaclesConfigsSchemaType,
  TentaclesConfigValuesType,
} from "../../../../../context/config/TentaclesConfigProvider";
import { useUpdateIsSavingTentaclesConfigContext } from "../../../../../context/config/TentaclesConfigProvider";
import { useUiConfigContext } from "../../../../../context/config/UiConfigProvider";
import { strategyFlowMakerName } from "../../TentaclesConfig";
import { flowEditorSettingsName } from "../../UIConfig";
import {
  useGetFlowConfig,
  useSaveFlowBuilderSettings,
} from "../SaveStrategyFlowBuilder";
import { flowBuilderStorageKey } from "./StrategyBlockNode";

export function NodeContainer({
  children,
  color,
  selected,
  nodeId,
}: {
  children: JSX.Element;
  color?: string;
  selected: boolean;
  nodeId: string;
}) {
  const botColors = useBotColorsContext();
  const reactFlow = useReactFlow();
  const onNodeDelete = useCallback(() => {
    reactFlow.setNodes((nodes) => {
      return nodes.filter((node) => {
        return node.id !== nodeId;
      });
    });
    reactFlow.setEdges((edges) => {
      return edges.filter((edge) => {
        return edge.source !== nodeId && edge.target !== nodeId;
      });
    });
  }, [nodeId, reactFlow]);
  return (
    <div
      style={{
        border: `2px solid ${color}`,
        borderRadius: "8px",
        padding: "10px",
        maxWidth: "500px",
        backgroundColor: botColors.background,
        ...(selected
          ? {
              boxShadow: "0 0 0 1rem rgba(13,110,253,.25)",
            }
          : {}),
      }}
    >
      {selected && (
        <AntButton
          onClick={onNodeDelete}
          size={buttonSizes.large}
          style={{
            right: "15px",
            top: "15px",
            position: "absolute",
            zIndex: "3",
          }}
          buttonVariant={buttonVariants.primary}
          buttonType={buttonTypes.warning}
          antIconComponent={CloseCircleOutlined}
        />
      )}
      {children}
    </div>
  );
}

export function NodeEditor({
  schema,
  config,
  nodeId,
}: {
  schema: TentaclesConfigsSchemaType | undefined;
  config: TentaclesConfigValuesType | undefined;
  nodeId: string;
}) {
  const handleUserInputSave = useSaveFlowBuilderSettings();
  const store = useStoreApi();
  const flowConfig = useGetFlowConfig();
  const uiConfig = useUiConfigContext();
  const setIsSaving = useUpdateIsSavingTentaclesConfigContext();
  const autoSave = uiConfig?.[flowEditorSettingsName]?.auto_save;
  const handleAutoSave = useCallback(() => {
    if (autoSave && flowConfig) {
      const { nodeInternals, edges } = store.getState();
      const nodes = Array.from(nodeInternals).map(([, node]) => node);
      handleUserInputSave({
        tradingModeKey: strategyFlowMakerName,
        flowConfig,
        nodes,
        edges,
        setIsSaving,
      });
    }
  }, [autoSave, flowConfig, handleUserInputSave, setIsSaving, store]);

  return useMemo(() => {
    return (
      schema && (
        <div>
          <JsonEditor<
            TentaclesConfigValuesType | undefined,
            TentaclesConfigsSchemaType
          >
            schema={schema}
            startval={config}
            editorName={nodeId}
            onChange={handleAutoSave}
            {...defaultJsonEditorSettings()}
            display_required_only={true}
            storageName={flowBuilderStorageKey}
          />
        </div>
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId, JSON.stringify(schema), JSON.stringify(config)]);
}

const selector = (state: ReactFlowState) => ({
  nodeInternals: state.nodeInternals,
  edges: state.edges,
});

export function NodeHandle({
  style,
  handleStyle,
  id,
  title,
  color,
  position,
  isConnectable,
  direction,
  handleDescriptionStyle,
}: {
  style?: CSSProperties;
  handleStyle?: CSSProperties;
  id: string;
  title: string;
  color: string;
  position: Position;
  isConnectable: number | boolean | undefined;
  direction: HandleType;
  handleDescriptionStyle?: CSSProperties;
}) {
  const { nodeInternals, edges } = useStore(selector);
  const nodeId = useNodeId();
  const isHandleConnectable: boolean = useMemo(() => {
    if (typeof isConnectable === "number" && nodeId) {
      const node = nodeInternals.get(nodeId);
      if (node) {
        const connectedEdges = getConnectedEdges([node], edges);
        const connectedToThisHandle = connectedEdges.filter(
          (edge) =>
            (edge.targetHandle === id && edge.target === nodeId) ||
            (edge.sourceHandle === id && edge.source === nodeId),
        );
        return connectedToThisHandle.length < isConnectable;
      }
    }
    return Boolean(isConnectable);
  }, [isConnectable, nodeInternals, nodeId, edges, id]);
  const _handleStyle =
    position === Position.Left
      ? {
          left: "-20px",
          height: "100px",
        }
      : position === Position.Right
        ? {
            right: "-20px",
            height: "100px",
          }
        : position === Position.Top
          ? {
              top: "-30px",
              width: "100px",
            }
          : position === Position.Bottom
            ? {
                bottom: "-20px",
                width: "100px",
              }
            : {};
  return (
    <>
      <div
        style={{
          // ... labelStyle,
          ...handleDescriptionStyle,
          position: "absolute",
          zIndex: 1,
          overflowWrap: "break-word",
          lineHeight: "13px",
          display: "flex",
          textAlign: "center",
          color: "#000",
          borderRadius: "5px",
          background: color,
          borderColor: color,
        }}
      >
        <span style={{ margin: "auto" }}>{title} </span>
      </div>
      <Handle
        type={direction}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "5px",
          background: "none",
          zIndex: 2,
          ..._handleStyle,
          ...handleStyle,
          ...style,
          border: "none",
        }}
        position={position}
        id={id}
        isConnectable={isHandleConnectable}
      />
    </>
  );
}

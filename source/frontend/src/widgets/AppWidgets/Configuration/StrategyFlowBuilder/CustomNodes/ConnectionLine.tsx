import { CloseCircleOutlined } from "@ant-design/icons";
import type { CSSProperties } from "react";
import { useCallback } from "react";
import type { EdgeProps } from "reactflow";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from "reactflow";

import AntButton, {
  buttonSizes,
  buttonTypes,
  buttonVariants,
} from "../../../../../components/Buttons/AntButton";

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps) => {
  const reactFlow = useReactFlow();
  const onEdgeDelete = useCallback(() => {
    reactFlow.setEdges((edges) => {
      return edges.filter((edge) => {
        return edge.id !== id;
      });
    });
  }, [id, reactFlow]);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const edgeStyle: CSSProperties = {
    position: "absolute",
    transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
    pointerEvents: "all",
  };
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        {selected && (
          <div onClick={onEdgeDelete} style={edgeStyle}>
            <AntButton
              size={buttonSizes.large}
              buttonVariant={buttonVariants.primary}
              buttonType={buttonTypes.warning}
              antIconComponent={CloseCircleOutlined}
            />
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

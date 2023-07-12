import React, {useCallback} from 'react';
import {getBezierPath, EdgeLabelRenderer, BaseEdge, useReactFlow} from 'reactflow';
import AntButton, {buttonSizes, buttonTypes, buttonVariants} from '../../../../../components/Buttons/AntButton';
import {CloseCircleOutlined} from '@ant-design/icons';

export const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected
}) => {
    const reactFlow = useReactFlow()
    const onEdgeDelete = useCallback((evt) => {
        evt.stopPropagation()
        reactFlow.setEdges((edges) => {
            return edges.filter((edge) => {
                return edge.id !== id
            })
        })
    }, [id, reactFlow])
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
    });
    const edgeStyle = {
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
        pointerEvents: 'all'
    }
    return (
        <>
            <BaseEdge id={id}
                path={edgePath}/>
            <EdgeLabelRenderer> {
                selected && (
                    <div onClick={onEdgeDelete}
                        style={edgeStyle}>
                        <AntButton size={
                                buttonSizes.large
                            }
                            buttonVariant={
                                buttonVariants.primary
                            }
                            buttonType={
                                buttonTypes.warning
                            }
                            antIconComponent={CloseCircleOutlined}/>
                    </div>
                )
            } </EdgeLabelRenderer>
        </>
    );
};

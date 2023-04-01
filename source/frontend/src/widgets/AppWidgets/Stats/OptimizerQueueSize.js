import { useMemo } from "react";
import { useOptimizerQueueCounterContext } from "../../../context/data/OptimizerQueueProvider";
import {Tag, Space, Badge} from 'antd'

export default function OptimizerQueueSize() {
    const optimizerQueueSize = useOptimizerQueueCounterContext()
    return useMemo(() => {
        return (
            <Space>
                <Tag color="blue" 
                            style={{fontSize:'15px', display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',}}>
                    {<Badge count={optimizerQueueSize} showZero 
                    style={{width: '15px', 
                            height: '15px', 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            margin:'5px'}}/> } To run</Tag>
            </Space>
        )
    }, [optimizerQueueSize])
}
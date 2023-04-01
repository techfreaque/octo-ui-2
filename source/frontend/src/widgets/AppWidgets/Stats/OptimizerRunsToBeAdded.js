import { useOptimizerEditorCounterContext } from "../../../context/config/OptimizerEditorProvider";
import { useMemo } from "react";
import { Space, Tag, Badge } from 'antd';

export default function OptimizerRunsToBeAdded() {
    const optimizerCounter = useOptimizerEditorCounterContext()
    return useMemo(() => {
        return (
        <Space>
            <Tag color="blue" 
                        style={{fontSize:'15px', display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',}}>
                {<Badge count={optimizerCounter} showZero 
                    style={{width: '15px', 
                            height: '15px', 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            margin:'5px'}}/> } 
                Possible combinations</Tag>
        </Space>
            // <Chip
            //     variant="outlined" style={{ margin: "auto", marginRight: "10px" }}
            //     color="primary" label={
            //         <h6 style={{ margin: "auto" }}>
            //             <Badge
            //                 bg="info" style={{ margin: "auto" }}
            //             >{optimizerCounter}</Badge> possible combinations
            //         </h6>
            //     }>
            // </Chip>
        )
    }, [optimizerCounter])
}
import { Chip } from "@mui/material";
import Badge from 'react-bootstrap/Badge';
import { useMemo } from "react";
import { useOptimizerQueueCounterContext } from "../../../context/data/OptimizerQueueProvider";

export default function OptimizerQueueSize() {
    const optimizerQueueSize = useOptimizerQueueCounterContext()
    return useMemo(() => {
        return (
            <Chip
                variant="outlined" style={{ margin: "auto", marginRight: "10px" }}
                color="primary" label={
                    <h6 style={{ margin: "auto" }}>
                        <Badge
                            bg="info" style={{ margin: "auto" }}
                        >{optimizerQueueSize}</Badge> to run
                    </h6>
                }>
            </Chip>
        )
    }, [optimizerQueueSize])
}
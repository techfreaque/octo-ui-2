import { Chip } from "@mui/material";
import { useOptimizerEditorCounterContext } from "../../../context/config/OptimizerEditorProvider";
import Badge from 'react-bootstrap/Badge';
import { useMemo } from "react";

export default function OptimizerRunsToBeAdded() {
    const optimizerCounter = useOptimizerEditorCounterContext()
    return useMemo(() => {
        return (
            <Chip
                variant="outlined" style={{ margin: "auto", marginRight: "10px" }}
                color="primary" label={
                    <h6 style={{ margin: "auto" }}>
                        <Badge
                            bg="info" style={{ margin: "auto" }}
                        >{optimizerCounter}</Badge> Runs to be added
                    </h6>
                }>
            </Chip>
        )
    }, [optimizerCounter])
}
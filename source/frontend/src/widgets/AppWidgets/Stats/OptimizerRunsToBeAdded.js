import { Chip } from "@mui/material";
import { useOptimizerEditorCounterContext } from "../../../context/config/OptimizerEditorProvider";
import Badge from 'react-bootstrap/Badge';

export default function OptimizerRunsToBeAdded() {
    const optimizerCounter = useOptimizerEditorCounterContext()
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
}
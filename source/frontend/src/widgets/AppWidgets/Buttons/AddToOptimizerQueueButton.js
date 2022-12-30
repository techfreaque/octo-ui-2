import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useBotIsOptimizingContext, useAddToOptimizerQueue } from "../../../context/actions/BotOptimizerProvider";
import { useMemo } from "react";

export default function AddToOptimizerQueueButton() {
  const isOptimizer = useBotIsOptimizingContext()
  const AddToOptimizerQueue = useAddToOptimizerQueue()
  return useMemo(() => {
    return !isOptimizer && (
      <Button onClick={AddToOptimizerQueue} variant="outlined" color="success" style={{ marginLeft: "10px" }}>
        <FontAwesomeIcon icon={faPlus} /><span style={{ marginLeft: "5px" }}>Add to Queue</span>
      </Button>
    );
  }, [AddToOptimizerQueue, isOptimizer])
}

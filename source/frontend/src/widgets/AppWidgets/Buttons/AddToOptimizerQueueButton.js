import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useBotIsOptimizingContext, useAddToOptimizerQueue } from "../../../context/actions/BotOptimizerProvider";

export default function AddToOptimizerQueueButton() {
  const isOptimizer = useBotIsOptimizingContext()
  const AddToOptimizerQueue = useAddToOptimizerQueue()
  return !isOptimizer && (
    <Button onClick={AddToOptimizerQueue} variant="outlined" color="success" style={{marginLeft: "10px"}}>
      <FontAwesomeIcon icon={faPlus} /><span style={{ marginLeft: "5px" }}>Add to Queue</span>
    </Button>
  );
}

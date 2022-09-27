import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faStop } from "@fortawesome/free-solid-svg-icons";
import { useBotIsOptimizingContext, useStopOptimizer } from "../../../context/actions/BotOptimizerProvider";

export default function StopOptimizerButton() {
  const isOptimizer = useBotIsOptimizingContext()
  const stopOptimizer = useStopOptimizer()
  return isOptimizer === "isStopping"
    ? <Button variant="outlined" color="warning">
      <FontAwesomeIcon
        icon={faStop}
        className={"fa-spin"}
      /><span style={{ marginLeft: "5px" }}>Optimizer is Pausing</span>
    </Button>
    : isOptimizer && (
      <Button onClick={stopOptimizer} variant="outlined" color="warning">
        <FontAwesomeIcon icon={faStop} /><span style={{ marginLeft: "5px" }}>Pause Optimizer</span>
      </Button>
    );
}

import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useBotIsOptimizingContext, useStartOptimizer } from "../../../context/actions/BotOptimizerProvider";
import { useMemo } from "react";

export default function StartOptimizerButton() {
  const isOptimizer = useBotIsOptimizingContext()
  const startOptimizer = useStartOptimizer()
  return useMemo(() => {
    return !isOptimizer && (
      <Button onClick={startOptimizer} variant="outlined" color="success" style={{ marginLeft: "10px" }}>
        <FontAwesomeIcon icon={faPlay} /><span style={{ marginLeft: "5px" }}>Start Optimizer</span>
      </Button>
    );
  }, [isOptimizer, startOptimizer])
}

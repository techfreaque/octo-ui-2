import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useBotIsOptimizingContext, useStartOptimizer } from "../../../context/actions/BotOptimizerProvider";
import { useMemo } from "react";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { useBotIsDataCollectingContext } from "../../../context/actions/BotBacktestingProvider";

export default function StartOptimizerButton() {
  const isOptimizer = useBotIsOptimizingContext()
  const startOptimizer = useStartOptimizer()
  const isDataCollecting = useBotIsDataCollectingContext()
  return useMemo(() => {
    return !isOptimizer && (
      <AntButton 
        disabled={isDataCollecting}
        onClick={startOptimizer} 
        buttonType={buttonTypes.success}
        faIconComponent={faPlay}
        text= "Start Optimizer"
      />
    );
  }, [isDataCollecting, isOptimizer, startOptimizer])
}

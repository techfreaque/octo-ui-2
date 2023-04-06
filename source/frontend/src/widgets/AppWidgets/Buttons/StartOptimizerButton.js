import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useBotIsOptimizingContext, useStartOptimizer } from "../../../context/actions/BotOptimizerProvider";
import { useMemo } from "react";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";

export default function StartOptimizerButton() {
  const isOptimizer = useBotIsOptimizingContext()
  const startOptimizer = useStartOptimizer()
  return useMemo(() => {
    return !isOptimizer && (
      <AntButton 
        onClick={startOptimizer} 
        buttonType={buttonTypes.success}
        faIconComponent={faPlay}
        text= "Start Optimizer"
      />
    );
  }, [isOptimizer, startOptimizer])
}

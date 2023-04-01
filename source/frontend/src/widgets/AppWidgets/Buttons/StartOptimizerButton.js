import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useBotIsOptimizingContext, useStartOptimizer } from "../../../context/actions/BotOptimizerProvider";
import { useMemo } from "react";
import WarningButton from "../../../components/Buttons/WarningButton";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";

export default function StartOptimizerButton() {
  const isOptimizer = useBotIsOptimizingContext()
  const startOptimizer = useStartOptimizer()
  const botColors = useBotColorsContext();
  return useMemo(() => {
    return !isOptimizer && (
      <WarningButton 
        onClick={startOptimizer} 
        color={botColors.success}
        icon={<FontAwesomeIcon icon={faPlay} style={{ marginRight: "5px" }}/>}
        text= "Start Optimizer"
      />
    );
  }, [botColors.success, isOptimizer, startOptimizer])
}

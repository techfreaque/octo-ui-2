import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useBotIsOptimizingContext, useAddToOptimizerQueue } from "../../../context/actions/BotOptimizerProvider";
import { useMemo } from "react";
import WarningButton from "../../../components/Buttons/WarningButton";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";

export default function AddToOptimizerQueueButton() {
  const isOptimizer = useBotIsOptimizingContext()
  const AddToOptimizerQueue = useAddToOptimizerQueue()
  const botColors = useBotColorsContext();

  return useMemo(() => {
    return !isOptimizer && (
      <WarningButton 
      onClick={AddToOptimizerQueue} 
      color= {botColors.success}
      icon={<FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }}/>}
      text= "Add to Queue"
      />
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botColors.success, isOptimizer])
}

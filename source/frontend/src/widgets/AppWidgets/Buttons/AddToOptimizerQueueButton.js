import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useBotIsOptimizingContext, useAddToOptimizerQueue } from "../../../context/actions/BotOptimizerProvider";
import { useMemo } from "react";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";

export default function AddToOptimizerQueueButton() {
  const isOptimizer = useBotIsOptimizingContext()
  const AddToOptimizerQueue = useAddToOptimizerQueue()
  return useMemo(() => {
    return !isOptimizer && (
      <AntButton 
        onClick={AddToOptimizerQueue} 
        buttonType= {buttonTypes.success}
        icon={<FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }}/>}
        text= "Add to Queue"
      />
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOptimizer])
}

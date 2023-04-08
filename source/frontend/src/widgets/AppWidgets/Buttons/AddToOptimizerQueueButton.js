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
        faIconComponent={faPlus}
        text="Add to Queue"
        marginRight="5px"
      />
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOptimizer])
}

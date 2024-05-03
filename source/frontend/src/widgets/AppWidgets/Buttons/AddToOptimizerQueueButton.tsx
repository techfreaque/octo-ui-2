import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  useBotIsOptimizingContext,
  useAddToOptimizerQueue,
} from "../../../context/actions/BotOptimizerProvider";
import { useMemo } from "react";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import {
  useBotInfoContext,
  useIsDemoMode,
} from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import { useOptimizerEditorCounterContext } from "../../../context/config/OptimizerEditorProvider";

export default function AddToOptimizerQueueButton() {
  const isOptimizer = useBotIsOptimizingContext();
  const AddToOptimizerQueue = useAddToOptimizerQueue();
  const botInfo = useBotInfoContext();
  const uiProInstalled = botInfo?.ui_pro_installed;
  const isOnline = useIsBotOnlineContext();
  const isDemo = useIsDemoMode();
  const optimizerCounter = useOptimizerEditorCounterContext();
  const canNotAdd =
    !uiProInstalled || !isOnline || isDemo || optimizerCounter === 0;
  return useMemo(() => {
    return (
      !isOptimizer && (
        <AntButton
          onClick={AddToOptimizerQueue}
          buttonType={buttonTypes.success}
          faIconComponent={faPlus}
          marginRight="5px"
          disabled={canNotAdd}
        >
          Add to Queue
        </AntButton>
      )
    );
  }, [AddToOptimizerQueue, canNotAdd, isOptimizer]);
}

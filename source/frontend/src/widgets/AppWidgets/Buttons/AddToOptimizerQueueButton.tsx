import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import { Trans } from "react-i18next";

import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import {
  useAddToOptimizerQueue,
  useBotIsOptimizingContext,
} from "../../../context/actions/BotOptimizerProvider";
import { useOptimizerEditorCounterContext } from "../../../context/config/OptimizerEditorProvider";
import {
  useBotInfoContext,
  useIsDemoMode,
} from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function AddToOptimizerQueueButton() {
  const isOptimizing = useBotIsOptimizingContext();
  const AddToOptimizerQueue = useAddToOptimizerQueue();
  const botInfo = useBotInfoContext();
  const uiProInstalled = botInfo?.ui_pro_installed;
  const isOnline = useIsBotOnlineContext();
  const isDemo = useIsDemoMode();
  const optimizerCounter = useOptimizerEditorCounterContext();
  const canNotAdd =
    !uiProInstalled || !isOnline || isDemo || optimizerCounter === 0;
  return useMemo(() => {
    return isOptimizing ? (
      <></>
    ) : (
      <AntButton
        onClick={AddToOptimizerQueue}
        buttonType={buttonTypes.success}
        faIconComponent={faPlus}
        marginRight="5px"
        disabled={canNotAdd}
      >
        <Trans i18nKey="optimizer.add-to-queue" />
      </AntButton>
    );
  }, [AddToOptimizerQueue, canNotAdd, isOptimizing]);
}

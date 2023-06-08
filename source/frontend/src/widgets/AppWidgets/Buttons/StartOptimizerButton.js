import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useBotIsOptimizingContext, useStartOptimizer } from "../../../context/actions/BotOptimizerProvider";
import { useMemo } from "react";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { useBotIsDataCollectingContext } from "../../../context/actions/BotBacktestingProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function StartOptimizerButton() {
  const isOptimizer = useBotIsOptimizingContext()
  const startOptimizer = useStartOptimizer()
  const isOnline = useIsBotOnlineContext()
  const isDataCollecting = useBotIsDataCollectingContext()
  const botInfo = useBotInfoContext()
  const uiProInstalled = botInfo ?. ui_pro_installed
  return useMemo(() => {
    return !isOptimizer && (
      <AntButton 
        onClick={startOptimizer} 
        buttonType={buttonTypes.success}
        faIconComponent={faPlay}
        text="Start Optimizer"
        disabled={!uiProInstalled || !isOnline||isDataCollecting}
      />
    );
  }, [isDataCollecting, isOnline, isOptimizer, startOptimizer, uiProInstalled])
}

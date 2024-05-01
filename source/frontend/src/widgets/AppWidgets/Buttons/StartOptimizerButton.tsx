import { faPlay } from "@fortawesome/free-solid-svg-icons";
import {
  useBotIsOptimizingContext,
  useStartOptimizer,
} from "../../../context/actions/BotOptimizerProvider";
import { useMemo } from "react";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { useBotIsDataCollectingContext } from "../../../context/actions/BotBacktestingProvider";
import {
  useBotInfoContext,
  useIsDemoMode,
} from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function StartOptimizerButton() {
  const isOptimizer = useBotIsOptimizingContext();
  const startOptimizer = useStartOptimizer();
  const isOnline = useIsBotOnlineContext();
  const isDataCollecting = useBotIsDataCollectingContext();
  const botInfo = useBotInfoContext();
  const isDemo = useIsDemoMode();
  return useMemo(() => {
    const uiProInstalled = botInfo?.ui_pro_installed;
    return (
      !isOptimizer && (
        <AntButton
          onClick={startOptimizer}
          buttonType={buttonTypes.success}
          faIconComponent={faPlay}
          disabled={!uiProInstalled || !isOnline || isDataCollecting || isDemo}
        >
          Start Optimizer
        </AntButton>
      )
    );
  }, [
    botInfo?.ui_pro_installed,
    isDataCollecting,
    isDemo,
    isOnline,
    isOptimizer,
    startOptimizer,
  ]);
}

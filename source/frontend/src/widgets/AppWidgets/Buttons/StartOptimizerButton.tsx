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
import { useOptimizerQueueCounterContext } from "../../../context/data/OptimizerQueueProvider";

export default function StartOptimizerButton() {
  const isOptimizer = useBotIsOptimizingContext();
  const startOptimizer = useStartOptimizer();
  const isOnline = useIsBotOnlineContext();
  const isDataCollecting = useBotIsDataCollectingContext();
  const botInfo = useBotInfoContext();
  const isDemo = useIsDemoMode();
  const optimizerQueueSize = useOptimizerQueueCounterContext();
  const canNotStart =
    !botInfo?.ui_pro_installed ||
    !isOnline ||
    isDataCollecting ||
    isDemo ||
    optimizerQueueSize === 0;
  return useMemo(() => {
    return (
      !isOptimizer && (
        <AntButton
          onClick={startOptimizer}
          buttonType={buttonTypes.success}
          faIconComponent={faPlay}
          disabled={canNotStart}
        >
          Start Optimizer
        </AntButton>
      )
    );
  }, [canNotStart, isOptimizer, startOptimizer]);
}

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import { Trans } from "react-i18next";

import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { useBotIsDataCollectingContext } from "../../../context/actions/BotBacktestingProvider";
import {
  useBotIsOptimizingContext,
  useStartOptimizer,
} from "../../../context/actions/BotOptimizerProvider";
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
          <Trans i18nKey="optimizer.start-optimizer"></Trans>
        </AntButton>
      )
    );
  }, [canNotStart, isOptimizer, startOptimizer]);
}

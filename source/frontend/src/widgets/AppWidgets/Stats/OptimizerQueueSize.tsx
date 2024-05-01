import { useMemo } from "react";
import { useOptimizerQueueCounterContext } from "../../../context/data/OptimizerQueueProvider";
import NumberTag from "../../../components/Notifications/NumberTag";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";

export default function OptimizerQueueSize() {
  const optimizerQueueSize = useOptimizerQueueCounterContext();
  const botColors = useBotColorsContext();
  return useMemo(() => {
    return (
      <NumberTag
        color={botColors?.tags.primary}
        count={optimizerQueueSize}
        text="To run"
      />
    );
  }, [botColors?.tags.primary, optimizerQueueSize]);
}

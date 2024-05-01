import { faStop } from "@fortawesome/free-solid-svg-icons";
import {
  useBotIsOptimizingContext,
  useStopOptimizer,
} from "../../../context/actions/BotOptimizerProvider";
import { useMemo } from "react";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";

export default function StopOptimizerButton() {
  const isOptimizer = useBotIsOptimizingContext();
  const stopOptimizer = useStopOptimizer();
  return useMemo(() => {
    return isOptimizer === "isStopping" ? (
      <AntButton buttonType={buttonTypes.warning} faIconComponent={faStop}>
        Optimizer is Pausing
      </AntButton>
    ) : (
      isOptimizer && (
        <AntButton
          onClick={stopOptimizer}
          buttonType={buttonTypes.warning}
          faIconComponent={faStop}
        >
          Pause Optimizer
        </AntButton>
      )
    );
  }, [isOptimizer, stopOptimizer]);
}

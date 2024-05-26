import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import { Trans } from "react-i18next";

import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import {
  useBotIsOptimizingContext,
  useStopOptimizer,
} from "../../../context/actions/BotOptimizerProvider";

export default function StopOptimizerButton() {
  const isOptimizer = useBotIsOptimizingContext();
  const stopOptimizer = useStopOptimizer();
  return useMemo(() => {
    return isOptimizer === "isStopping" ? (
      <AntButton buttonType={buttonTypes.warning} faIconComponent={faStop}>
        <Trans i18nKey="optimizer.optimizer-is-pausing" />
      </AntButton>
    ) : isOptimizer ? (
      <AntButton
        onClick={stopOptimizer}
        buttonType={buttonTypes.warning}
        faIconComponent={faStop}
      >
        <Trans i18nKey="optimizer.pause-optimizer" />
      </AntButton>
    ) : (
      <></>
    );
  }, [isOptimizer, stopOptimizer]);
}

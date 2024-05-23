import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";

import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import {
  useBotIsBacktestingContext,
  useStopBacktesting,
} from "../../../context/actions/BotBacktestingProvider";

export default function StopBacktestingButton() {
  const isBacktesting = useBotIsBacktestingContext();
  const stopBacktesting = useStopBacktesting();
  return useMemo(() => {
    return (
      isBacktesting && (
        <AntButton
          onClick={stopBacktesting}
          buttonType={buttonTypes.warning}
          faIconComponent={faStop}
        >
          Stop Backtest
        </AntButton>
      )
    );
  }, [isBacktesting, stopBacktesting]);
}

import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import { Trans } from "react-i18next";

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
          <Trans i18nKey="stop-backtest"></Trans>
        </AntButton>
      )
    );
  }, [isBacktesting, stopBacktesting]);
}

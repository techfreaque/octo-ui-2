import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useBotIsBacktestingContext, useStopBacktesting } from "../../../context/actions/BotBacktestingProvider";
import { useMemo } from "react";

export default function StopBacktestingButton() {
  const isBacktesting = useBotIsBacktestingContext()
  const stopBacktesting = useStopBacktesting()
  return useMemo(() => {
  return isBacktesting && (
    <Button onClick={stopBacktesting} variant="outlined" color="warning">
      <FontAwesomeIcon icon={faStop} /><span style={{ marginLeft: "5px" }}>Stop Backtest</span>
    </Button>
  );
      }, [isBacktesting, stopBacktesting])
}

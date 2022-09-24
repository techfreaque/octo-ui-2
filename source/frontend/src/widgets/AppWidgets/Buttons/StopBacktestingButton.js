import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useBotIsBacktestingContext, useStopBacktesting } from "../../../context/BotBacktestingProvider";

export default function StopBacktestingButton() {
  const isBacktesting = useBotIsBacktestingContext()
  const stopBacktesting = useStopBacktesting()

  return isBacktesting && (
    <Button onClick={stopBacktesting} variant="outlined" color="warning">
      <FontAwesomeIcon icon={faStop} /><span style={{ marginLeft: "5px" }}>Stop Backtest</span>
    </Button>
  );
}

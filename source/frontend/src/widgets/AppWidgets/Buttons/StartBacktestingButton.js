import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useBotIsBacktestingContext, useStartBacktesting } from "../../../context/BotBacktestingProvider";

export default function StartBacktestingButton() {
  const isBacktesting = useBotIsBacktestingContext()
  const startBacktesting = useStartBacktesting()
  return !isBacktesting && (
    <Button onClick={startBacktesting} variant="outlined" color="success">
      <FontAwesomeIcon icon={faPlay} /><span style={{ marginLeft: "5px" }}>Start Backtest</span>
    </Button>
  );
}

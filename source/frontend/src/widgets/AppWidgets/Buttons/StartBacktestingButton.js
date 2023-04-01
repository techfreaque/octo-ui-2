import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useBotIsBacktestingContext, useStartBacktesting } from "../../../context/actions/BotBacktestingProvider";
import { useMemo } from "react";
import WarningButton from "../../../components/Buttons/WarningButton";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";

export default function StartBacktestingButton() {
  const isBacktesting = useBotIsBacktestingContext()
  const startBacktesting = useStartBacktesting()
  const botColors = useBotColorsContext();
  return useMemo(() => {
  return !isBacktesting && (
    <WarningButton 
    onClick={startBacktesting} 
    color={botColors.success}
    icon={<FontAwesomeIcon icon={faPlay} style={{marginRight:"8px"}}/>}
    text="Start Backtest"
    />
  );
      }, [botColors.success, isBacktesting, startBacktesting])
}

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import {useBotIsBacktestingContext, useStartBacktesting} from "../../../context/actions/BotBacktestingProvider";
import {useMemo} from "react";
import AntButton from "../../../components/Buttons/AntButton";
import {useBotColorsContext} from "../../../context/config/BotColorsProvider";

export default function StartBacktestingButton() {
    const isBacktesting = useBotIsBacktestingContext()
    const startBacktesting = useStartBacktesting()
    const botColors = useBotColorsContext();
    return useMemo(() => {
        return ! isBacktesting && (<AntButton onClick={startBacktesting}
            color={
                botColors.success
            }
            icon={
                (<FontAwesomeIcon icon={faPlay}
                    style={
                        {marginRight: "8px"}
                    }/>)
            }
            text="Start Backtest"/>);
    }, [botColors.success, isBacktesting, startBacktesting])
}

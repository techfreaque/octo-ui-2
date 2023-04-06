import {faPlay} from "@fortawesome/free-solid-svg-icons";
import {useBotIsBacktestingContext, useStartBacktesting} from "../../../context/actions/BotBacktestingProvider";
import {useMemo} from "react";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";

export default function StartBacktestingButton() {
    const isBacktesting = useBotIsBacktestingContext()
    const startBacktesting = useStartBacktesting()
    return useMemo(() => {
        return ! isBacktesting && (<AntButton onClick={startBacktesting}
            buttonType={buttonTypes.success}
            faIconComponent={faPlay}
            text="Start Backtest"/>);
    }, [isBacktesting, startBacktesting])
}

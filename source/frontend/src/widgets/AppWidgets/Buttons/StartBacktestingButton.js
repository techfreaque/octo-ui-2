import {faPlay} from "@fortawesome/free-solid-svg-icons";
import {useBotIsBacktestingContext, useBotIsDataCollectingContext, useStartBacktesting} from "../../../context/actions/BotBacktestingProvider";
import {useMemo} from "react";
import AntButton, {buttonTypes} from "../../../components/Buttons/AntButton";
import {useIsDemoMode} from "../../../context/data/BotInfoProvider";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";

export default function StartBacktestingButton() {
    const isBacktesting = useBotIsBacktestingContext()
    const startBacktesting = useStartBacktesting()
    const isDataCollecting = useBotIsDataCollectingContext()
    const isOnline = useIsBotOnlineContext()
    const isDemo = useIsDemoMode()
    return useMemo(() => {
        return ! isBacktesting && (
            <AntButton onClick={startBacktesting}
                disabled={
                    isDataCollecting || ! isOnline || isDemo
                }

                buttonType={
                    buttonTypes.success
                }
                faIconComponent={faPlay}
                text="Start Backtest"/>
        );
    }, [
        isBacktesting,
        isDataCollecting,
        isDemo,
        isOnline,
        startBacktesting
    ])
}

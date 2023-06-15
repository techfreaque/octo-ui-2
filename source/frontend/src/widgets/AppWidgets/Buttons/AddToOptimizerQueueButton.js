import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useBotIsOptimizingContext, useAddToOptimizerQueue} from "../../../context/actions/BotOptimizerProvider";
import {useMemo} from "react";
import AntButton, {buttonTypes} from "../../../components/Buttons/AntButton";
import {useBotInfoContext, useIsDemoMode} from "../../../context/data/BotInfoProvider";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";

export default function AddToOptimizerQueueButton() {
    const isOptimizer = useBotIsOptimizingContext()
    const AddToOptimizerQueue = useAddToOptimizerQueue()
    const botInfo = useBotInfoContext()
    const uiProInstalled = botInfo?.ui_pro_installed
    const isOnline = useIsBotOnlineContext()
    const isDemo = useIsDemoMode()
    return useMemo(() => {
        return ! isOptimizer && (
            <AntButton onClick={AddToOptimizerQueue}
                buttonType={
                    buttonTypes.success
                }
                faIconComponent={faPlus}
                text="Add to Queue"
                marginRight="5px"
                disabled={
                    ! uiProInstalled || ! isOnline || isDemo
                }/>
        );
    }, [AddToOptimizerQueue, isDemo, isOnline, isOptimizer, uiProInstalled])
}

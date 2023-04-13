import {useOptimizerEditorCounterContext} from "../../../context/config/OptimizerEditorProvider";
import {useMemo} from "react";
import NumberTag from "../../../components/Notifications/NumberTag";
import {useBotColorsContext} from "../../../context/config/BotColorsProvider";

export default function OptimizerRunsToBeAdded() {
    const optimizerCounter = useOptimizerEditorCounterContext()
    const botColors = useBotColorsContext();
    return useMemo(() => {
        return (<NumberTag color={
                botColors?.tags.primary
            }
            count={optimizerCounter}
            text="Possible combinations"/>)
    }, [
        botColors?.tags.primary,
        optimizerCounter
    ])
}

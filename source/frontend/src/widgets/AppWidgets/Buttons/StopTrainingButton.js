import {faStop} from "@fortawesome/free-solid-svg-icons";
import {useStopTraining} from "../../../context/actions/BotOptimizerProvider";
import {useMemo} from "react";
import AntButton, {buttonTypes} from "../../../components/Buttons/AntButton";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";

export default function StopTrainingButton() {
    const botInfo = useBotInfoContext()
    const stopTraining = useStopTraining()
    return useMemo(() => {
        return(botInfo?.any_neural_net_active && botInfo?.should_stop_training) ? <AntButton buttonType={
                buttonTypes.warning
            }
            style={{marginRight: "5px"}}
            faIconComponent={faStop}
            disabled={true}
            text="Training is About to stop"/> : botInfo?.any_neural_net_active && (
            <AntButton onClick={stopTraining}
                buttonType={
                    buttonTypes.warning
                }
                style={{marginRight: "5px"}}
                faIconComponent={faStop}
                text="Stop Training"/>
        );
    }, [botInfo?.any_neural_net_active, botInfo?.should_stop_training, stopTraining])
}

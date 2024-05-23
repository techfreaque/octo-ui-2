import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";

import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { useStopTraining } from "../../../context/actions/BotOptimizerProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";

export default function StopTrainingButton() {
  const botInfo = useBotInfoContext();
  const stopTraining = useStopTraining();
  return useMemo(() => {
    return botInfo?.any_neural_net_active && botInfo?.should_stop_training ? (
      <AntButton
        buttonType={buttonTypes.warning}
        style={{ marginRight: "5px" }}
        faIconComponent={faStop}
        disabled={true}
      >
        Training is About to stop
      </AntButton>
    ) : (
      botInfo?.any_neural_net_active && (
        <AntButton
          onClick={stopTraining}
          buttonType={buttonTypes.warning}
          style={{ marginRight: "5px" }}
          faIconComponent={faStop}
        >
          Stop Training
        </AntButton>
      )
    );
  }, [
    botInfo?.any_neural_net_active,
    botInfo?.should_stop_training,
    stopTraining,
  ]);
}

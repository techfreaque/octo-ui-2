import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import { Trans } from "react-i18next";

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
        <Trans i18nKey="training-is-about-to-stop"></Trans>
      </AntButton>
    ) : (
      botInfo?.any_neural_net_active && (
        <AntButton
          onClick={stopTraining}
          buttonType={buttonTypes.warning}
          style={{ marginRight: "5px" }}
          faIconComponent={faStop}
        >
          <Trans i18nKey="stop-training"></Trans>
        </AntButton>
      )
    );
  }, [
    botInfo?.any_neural_net_active,
    botInfo?.should_stop_training,
    stopTraining,
  ]);
}

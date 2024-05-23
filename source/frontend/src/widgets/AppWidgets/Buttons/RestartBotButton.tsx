import { useMemo } from "react";
import { Trans } from "react-i18next";

import AntButton, {
  ButtonType,
  buttonTypes,
} from "../../../components/Buttons/AntButton";
import { useIsDemoMode } from "../../../context/data/BotInfoProvider";
import {
  useIsBotOnlineContext,
  useRestartBot,
} from "../../../context/data/IsBotOnlineProvider";

export default function RestartBotButton({
  buttonType = buttonTypes.warning,
  onClick,
}: {
  buttonType?: ButtonType;
  onClick?: () => void;
}) {
  const isOnline = useIsBotOnlineContext();
  const restartBot = useRestartBot();
  const isDemo = useIsDemoMode();
  return useMemo(() => {
    return (
      <AntButton
        disabled={!isOnline || isDemo}
        onClick={() => {
          restartBot();
          onClick?.();
        }}
        block={true}
        buttonType={buttonType}
        antIcon={"ReloadOutlined"}
        spin={!isOnline}
      >
        <Trans i18nKey="buttons.restartBot" />
      </AntButton>
    );
  }, [buttonType, isDemo, isOnline, onClick, restartBot]);
}

import { ReloadOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { Trans } from "react-i18next";

import type { ButtonType } from "../../../components/Buttons/AntButton";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import type { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import { useIsDemoMode } from "../../../context/data/BotInfoProvider";
import {
  useIsBotOnlineContext,
  useRestartBot,
} from "../../../context/data/IsBotOnlineProvider";

export default function RestartBotButton({
  buttonType = buttonTypes.warning,
  onClick,
}: UiLayoutPageLayoutType & {
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
        icon={<ReloadOutlined spin={!isOnline} height="24px" width="24px" />}
      >
        <Trans i18nKey="powerMenu.restartBot" />
      </AntButton>
    );
  }, [buttonType, isDemo, isOnline, onClick, restartBot]);
}

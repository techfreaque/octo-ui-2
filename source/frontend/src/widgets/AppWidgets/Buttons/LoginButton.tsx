import { useMemo } from "react";
import { Trans } from "react-i18next";

import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { backendRoutes } from "../../../constants/backendConstants";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useIsDemoMode } from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function LoginButton() {
  const isOnline = useIsBotOnlineContext();
  const botDomain = useBotDomainContext();
  const isDemo = useIsDemoMode();
  return useMemo(() => {
    return isDemo ? (
      <AntButton
        disabled={!isOnline}
        href={botDomain + backendRoutes.loginBot}
        block={true}
        buttonType={buttonTypes.warning}
        antIcon="LogoutOutlined"
      >
        <Trans i18nKey="buttons.login" />
      </AntButton>
    ) : (
      <></>
    );
  }, [isOnline, isDemo, botDomain]);
}

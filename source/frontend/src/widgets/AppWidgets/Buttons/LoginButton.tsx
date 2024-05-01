import { useMemo } from "react";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import { backendRoutes } from "../../../constants/backendConstants";
import { useIsDemoMode } from "../../../context/data/BotInfoProvider";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { Trans } from "react-i18next";

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

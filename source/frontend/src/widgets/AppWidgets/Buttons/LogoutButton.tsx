import { useMemo, useState } from "react";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import {
  useIsBotOnlineContext,
  useUpdateIsBotOnlineContext,
} from "../../../context/data/IsBotOnlineProvider";
import { useNavigate } from "react-router-dom";
import { backendRoutes } from "../../../constants/backendConstants";
import { logOutBot } from "../../../api/actions";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { Trans } from "react-i18next";

export default function LogoutButton({ onClick }: { onClick?: () => void }) {
  const [isLoading, setIsloading] = useState(false);
  const updateIsOnline = useUpdateIsBotOnlineContext();
  const isOnline = useIsBotOnlineContext();
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext();
  const disabled = isLoading || !isOnline;
  const navigate = useNavigate();

  function onLoggedOut() {
    navigate(backendRoutes.loginBot);
  }
  return useMemo(() => {
    return botInfo?.can_logout ? (
      <AntButton
        disabled={disabled}
        onClick={() => {
          logOutBot(botDomain, updateIsOnline, setIsloading, onLoggedOut);
          onClick?.();
        }}
        block={true}
        buttonType={buttonTypes.warning}
        antIcon="LogoutOutlined"
      >
        <Trans i18nKey="buttons.logout" />
      </AntButton>
    ) : (
      <></>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botDomain, disabled, updateIsOnline, onClick]);
}

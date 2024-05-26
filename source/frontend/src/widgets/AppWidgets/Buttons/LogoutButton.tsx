import { LogoutOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { logOutBot } from "../../../api/actions";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { backendRoutes } from "../../../constants/backendConstants";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import {
  useIsBotOnlineContext,
  useUpdateIsBotOnlineContext,
} from "../../../context/data/IsBotOnlineProvider";

export default function LogoutButton({
  onClick,
}: UiLayoutPageLayoutType & { onClick?: () => void }) {
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
        icon={<LogoutOutlined height="24px" width="24px" />}
      >
        <Trans i18nKey="powerMenu.logout" />
      </AntButton>
    ) : (
      <></>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botDomain, disabled, updateIsOnline, onClick]);
}

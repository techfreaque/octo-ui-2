import { StopOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { Trans } from "react-i18next";

import { stopBot } from "../../../api/actions";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import type { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import { useIsDemoMode } from "../../../context/data/BotInfoProvider";
import {
  useIsBotOnlineContext,
  useUpdateIsBotOnlineContext,
} from "../../../context/data/IsBotOnlineProvider";

export default function StopBotButton({
  onClick,
}: UiLayoutPageLayoutType & { onClick?: () => void }) {
  const [isLoading, setIsloading] = useState(false);
  const updateIsOnline = useUpdateIsBotOnlineContext();
  const isOnline = useIsBotOnlineContext();
  const botDomain = useBotDomainContext();
  const isDemo = useIsDemoMode();
  return useMemo(() => {
    return (
      <AntButton
        disabled={isLoading || !isOnline || isDemo}
        block={true}
        onClick={() => {
          stopBot(botDomain, updateIsOnline, setIsloading);
          onClick?.();
        }}
        buttonType={buttonTypes.error}
        icon={<StopOutlined height="24px" width="24px" />}
      >
        <Trans i18nKey="powerMenu.stopBot" />
      </AntButton>
    );
  }, [botDomain, isDemo, isLoading, isOnline, onClick, updateIsOnline]);
}

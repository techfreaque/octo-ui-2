import { Tooltip } from "antd";
import { useMemo, useState } from "react";
import { Trans } from "react-i18next";

import { updateBot } from "../../../api/actions";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useIsDemoMode } from "../../../context/data/BotInfoProvider";
import {
  useIsBotOnlineContext,
  useUpdateIsBotOnlineContext,
} from "../../../context/data/IsBotOnlineProvider";

export default function UpdateBotButton({ onClick }: { onClick: () => void }) {
  const [isLoading, setIsloading] = useState(false);
  const updateIsOnline = useUpdateIsBotOnlineContext();
  const isOnline = useIsBotOnlineContext();
  const botDomain = useBotDomainContext();
  const isDemo = useIsDemoMode();
  return useMemo(() => {
    const disabled = isLoading || !isOnline || isDemo;
    return (
      <Tooltip
        title="Updating your bot from the UI will be supported soon!"
        placement="left"
      >
        <div>
          <AntButton
            disabled={true || disabled}
            onClick={() => {
              updateBot(botDomain, updateIsOnline, setIsloading);
              onClick?.();
            }}
            block={true}
            buttonType={buttonTypes.warning}
            antIcon="DownloadOutlined"
          >
            <Trans i18nKey="buttons.updateBot" />
          </AntButton>
        </div>
      </Tooltip>
    );
  }, [botDomain, isDemo, isLoading, isOnline, onClick, updateIsOnline]);
}

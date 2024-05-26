import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { Trans } from "react-i18next";

import { closeAllPositions } from "../../../api/actions";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useIsDemoMode } from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function CloseAllPositionsButton() {
  const [isClosing, setIsClosing] = useState(false);
  const isOnline = useIsBotOnlineContext();
  const botDomain = useBotDomainContext();
  const isDemo = useIsDemoMode();
  return useMemo(() => {
    return (
      <AntButton
        disabled={!isOnline || isClosing || isDemo}
        onClick={() => closeAllPositions(botDomain, setIsClosing)}
        buttonType={buttonTypes.error}
        faIconComponent={faStop}
      >
        <Trans i18nKey="close-all-positions" />
      </AntButton>
    );
  }, [botDomain, isClosing, isDemo, isOnline]);
}

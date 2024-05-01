import { useMemo, useState } from "react";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { closeAllPositions } from "../../../api/actions";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { useIsDemoMode } from "../../../context/data/BotInfoProvider";

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
        Close all positions
      </AntButton>
    );
  }, [botDomain, isClosing, isDemo, isOnline]);
}

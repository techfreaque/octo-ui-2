import React, { useMemo, useState } from "react";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { closeAllPositions } from "../../../api/actions";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";

export default function CloseAllPositionsButton() {
  const [isClosing, setIsClosing] = useState(false)
  const isOnline = useIsBotOnlineContext()
  const botDomain = useBotDomainContext();


  return useMemo(() => {
    return (
      <AntButton 
        disabled={!isOnline ||  isClosing} onClick={() => closeAllPositions(botDomain, setIsClosing)} 
        buttonType= {buttonTypes.error}
        faIconComponent = {faStop}
        text = "Close all positions"
      />
    );
  }, [botDomain, isClosing, isOnline])
}

import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { closeAllPositions } from "../../../api/actions";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import AntButton from "../../../components/Buttons/AntButton";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";

export default function CloseAllPositionsButton() {
  const [isClosing, setIsClosing] = useState(false)
  const isOnline = useIsBotOnlineContext()
  const botDomain = useBotDomainContext();
  const botColors = useBotColorsContext();

  return useMemo(() => {
    return (
      <AntButton 
        disabled={!isOnline ||  isClosing} onClick={() => closeAllPositions(botDomain, setIsClosing)} 
        color= {botColors.error}
        icon = {(<FontAwesomeIcon icon={faStop} style={{ marginRight: "5px" }}/>)}
        text = "Close all positions"
      />
    );
  }, [botColors.error, botDomain, isClosing, isOnline])
}

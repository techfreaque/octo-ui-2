import React, { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { closeAllPositions } from "../../../api/actions";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function CloseAllPositionsButton() {
  const [isClosing, setIsClosing] = useState(false)
  const isOnline = useIsBotOnlineContext()
  const botDomain = useBotDomainContext();
  return useMemo(() => {
    return (
      <Button disabled={!isOnline ||  isClosing} onClick={() => closeAllPositions(botDomain, setIsClosing)} variant="outlined" color="error">
        <FontAwesomeIcon
          icon={faStop}
          style={{ marginRight: "5px" }}
        />
        Close all positions
      </Button>
    );
  }, [botDomain, isClosing, isOnline])
}

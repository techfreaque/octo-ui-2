import React, { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { stopBot } from "../../../api/actions";
import { useIsBotOnlineContext, useUpdateIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function StopBotButton() {
  const [isLoading, setIsloading] = useState(false);
  const updateIsOnline = useUpdateIsBotOnlineContext()
  const isOnline = useIsBotOnlineContext()
  const botDomain = useBotDomainContext();
  return useMemo(() => {
    return (
      <Button disabled={isLoading || !isOnline} onClick={() => stopBot(botDomain, updateIsOnline, setIsloading)} variant="outlined" color="error">
        <FontAwesomeIcon
          icon={faStop}
          style={{ marginRight: "5px" }}
        />
        Stop Bot
      </Button>
    );
  }, [botDomain, isLoading, isOnline, updateIsOnline])
}

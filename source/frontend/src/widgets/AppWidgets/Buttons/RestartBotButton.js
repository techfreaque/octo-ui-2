import React, { useState } from "react";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { restartBot } from "../../../api/actions";
import { useIsBotOnlineContext, useUpdateIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function RestartBotButton() {
  const [isLoading, setIsloading] = useState(false);
  const updateIsOnline = useUpdateIsBotOnlineContext()
  const isOnline = useIsBotOnlineContext()
  const botDomain = useBotDomainContext();
  const disabled = isLoading || !isOnline
  return (
    <Button disabled={disabled} onClick={() => restartBot(botDomain, updateIsOnline, setIsloading)} variant="outlined" color="warning">
      <FontAwesomeIcon
        icon={faArrowRotateRight}
        className={disabled ? "fa-spin" : ""}
        style={{ marginRight: "5px" }}
      />
      Restart Bot
    </Button>
  );
}

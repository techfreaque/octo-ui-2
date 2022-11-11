import React, { useState } from "react";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useIsBotOnlineContext, useUpdateIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import { updateBot } from "../../../api/actions";

export default function UpdateBotButton() {
  const [isLoading, setIsloading] = useState(false);
  const updateIsOnline = useUpdateIsBotOnlineContext()
  const isOnline = useIsBotOnlineContext()
  const botDomain = useBotDomainContext();
  const disabled = isLoading || !isOnline
  return (
    <Button disabled={disabled} onClick={() => updateBot(botDomain, updateIsOnline, setIsloading)} variant="outlined" color="warning">
      <FontAwesomeIcon
        icon={faDownload}
        style={{ marginRight: "5px" }}
      />
      Update Bot
    </Button>
  );
}

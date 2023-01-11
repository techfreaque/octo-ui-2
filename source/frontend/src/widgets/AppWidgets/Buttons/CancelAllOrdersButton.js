import React, { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { cancelAllOrders } from "../../../api/actions";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function CancelAllOrdersButton() {
  const [isCancelling, setIsCancelling] = useState(false)
  const isOnline = useIsBotOnlineContext()
  const botDomain = useBotDomainContext();
  return useMemo(() => {
    return (
      <Button disabled={!isOnline || isCancelling}
        onClick={() => cancelAllOrders(botDomain, setIsCancelling)}
        variant="outlined" color="warning">
        <FontAwesomeIcon
          icon={faStop}
          style={{ marginRight: "5px" }}
        />
        Cancel all orders
      </Button>
    );
  }, [botDomain, isCancelling, isOnline])
}

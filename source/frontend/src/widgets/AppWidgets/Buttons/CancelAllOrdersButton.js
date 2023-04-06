import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { cancelAllOrders } from "../../../api/actions";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import AntButton from "../../../components/Buttons/AntButton";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";

export default function CancelAllOrdersButton() {
  const [isCancelling, setIsCancelling] = useState(false)
  const isOnline = useIsBotOnlineContext()
  const botDomain = useBotDomainContext();
  const botColors = useBotColorsContext();

  return useMemo(() => {
    return (
      <AntButton 
        disabled={!isOnline || isCancelling}
        onClick={() => cancelAllOrders(botDomain, setIsCancelling)}
        color={botColors.warning}
        icon = {(<FontAwesomeIcon icon={faStop} style={{ marginRight: "5px" }}/>)}
        text="Cancel All Orders"
      />
    );
  }, [botColors.warning, botDomain, isCancelling, isOnline])
}

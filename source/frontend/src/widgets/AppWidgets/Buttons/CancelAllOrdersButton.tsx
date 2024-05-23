import { faStop } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";

import { cancelAllOrders } from "../../../api/actions";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useIsDemoMode } from "../../../context/data/BotInfoProvider";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";

export default function CancelAllOrdersButton() {
  const [isCancelling, setIsCancelling] = useState(false);
  const isOnline = useIsBotOnlineContext();
  const botDomain = useBotDomainContext();
  const color = buttonTypes.warning;
  const isDemo = useIsDemoMode();
  return useMemo(() => {
    return (
      <AntButton
        disabled={!isOnline || isCancelling || isDemo}
        onClick={() => cancelAllOrders(botDomain, setIsCancelling)}
        buttonType={color}
        faIconComponent={faStop}
        marginRight="5px"
      >
        Cancel All Orders
      </AntButton>
    );
  }, [botDomain, color, isCancelling, isDemo, isOnline]);
}

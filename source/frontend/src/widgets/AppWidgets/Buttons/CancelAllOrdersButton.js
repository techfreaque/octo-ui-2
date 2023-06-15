import React, {useMemo, useState} from "react";
import {faStop} from "@fortawesome/free-solid-svg-icons";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {cancelAllOrders} from "../../../api/actions";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import AntButton, {buttonTypes} from "../../../components/Buttons/AntButton";
import {useIsDemoMode} from "../../../context/data/BotInfoProvider";

export default function CancelAllOrdersButton() {
    const [isCancelling, setIsCancelling] = useState(false)
    const isOnline = useIsBotOnlineContext()
    const botDomain = useBotDomainContext();
    const color = buttonTypes.warning;
    const isDemo = useIsDemoMode()
    return useMemo(() => {
        return (
            <AntButton disabled={
                    ! isOnline || isCancelling || isDemo
                }
                onClick={
                    () => cancelAllOrders(botDomain, setIsCancelling)
                }
                buttonType={color}
                faIconComponent={faStop}
                text="Cancel All Orders"
                marginRight="5px"/>
        );
    }, [botDomain, color, isCancelling, isDemo, isOnline])
}

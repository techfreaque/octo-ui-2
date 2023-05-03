import React, {useMemo, useState} from "react";
import {faStop} from "@fortawesome/free-solid-svg-icons";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {stopBot} from "../../../api/actions";
import {useIsBotOnlineContext, useUpdateIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {Trans} from "react-i18next";
import AntButton, {buttonTypes} from "../../../components/Buttons/AntButton";

export default function StopBotButton({onClick}) {
    const [isLoading, setIsloading] = useState(false);
    const updateIsOnline = useUpdateIsBotOnlineContext()
    const isOnline = useIsBotOnlineContext()
    const botDomain = useBotDomainContext();
    return useMemo(() => {
        return (<AntButton disabled={
                isLoading || ! isOnline
            }
            block={true}
            onClick={
                () => {
                    stopBot(botDomain, updateIsOnline, setIsloading)
                    onClick ?. ()

                }
            }
            buttonType={
                buttonTypes.error
            }
            faIconComponent={faStop}
            text={
                (<Trans i18nKey="buttons.stopBot"/>)
            }/>);
    }, [botDomain, isLoading, isOnline, onClick, updateIsOnline])
}

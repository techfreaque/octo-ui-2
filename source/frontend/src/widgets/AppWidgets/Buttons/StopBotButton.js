import React, {useMemo, useState} from "react";
import {faStop} from "@fortawesome/free-solid-svg-icons";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {stopBot} from "../../../api/actions";
import {useIsBotOnlineContext, useUpdateIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {Trans} from "react-i18next";
import AntButton, {buttonTypes} from "../../../components/Buttons/AntButton";
import {useIsDemoMode} from "../../../context/data/BotInfoProvider";

export default function StopBotButton({onClick}) {
    const [isLoading, setIsloading] = useState(false);
    const updateIsOnline = useUpdateIsBotOnlineContext()
    const isOnline = useIsBotOnlineContext()
    const botDomain = useBotDomainContext();
    const isDemo = useIsDemoMode()
    return useMemo(() => {
        return (
            <AntButton disabled={
                    isLoading || ! isOnline || isDemo
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
                    (
                        <Trans i18nKey="buttons.stopBot"/>
                    )
                }/>
        );
    }, [botDomain, isDemo, isLoading, isOnline, onClick, updateIsOnline])
}

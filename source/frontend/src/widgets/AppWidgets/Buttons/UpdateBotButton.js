import React, {useMemo, useState} from "react";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {useIsBotOnlineContext, useUpdateIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {updateBot} from "../../../api/actions";
import {Trans} from "react-i18next";
import AntButton, {buttonTypes} from "../../../components/Buttons/AntButton";

export default function UpdateBotButton() {
    const [isLoading, setIsloading] = useState(false);
    const updateIsOnline = useUpdateIsBotOnlineContext()
    const isOnline = useIsBotOnlineContext()
    const botDomain = useBotDomainContext();
    const disabled = isLoading || ! isOnline

    return useMemo(() => {
        return (<AntButton disabled={disabled}
            onClick={
                () => updateBot(botDomain, updateIsOnline, setIsloading)
            }
            block={true}
            buttonType={
                buttonTypes.warning
            }
            antIcon="DownloadOutlined"
            text={
                <Trans
            i18nKey="buttons.updateBot"/>
            }/>)
    }, [botDomain, disabled, updateIsOnline])
}

import React, {useMemo, useState} from "react";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {useIsBotOnlineContext, useUpdateIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {updateBot} from "../../../api/actions";
import {Trans} from "react-i18next";
import AntButton, {buttonTypes} from "../../../components/Buttons/AntButton";
import { Tooltip } from "antd";

export default function UpdateBotButton({onClick}) {
    const [isLoading, setIsloading] = useState(false);
    const updateIsOnline = useUpdateIsBotOnlineContext()
    const isOnline = useIsBotOnlineContext()
    const botDomain = useBotDomainContext();
    const disabled = isLoading || ! isOnline
    return useMemo(() => {
        return (
            <Tooltip title="Updating your bot from the UI will be supported soon!" placement="left" >
                <div>
                <AntButton disabled={true || disabled
            }
            onClick={
                () => {
                    updateBot(botDomain, updateIsOnline, setIsloading)
                    onClick ?. ()
                }
            }     
            block={true}
            buttonType={
                buttonTypes.warning
            }
            antIcon="DownloadOutlined"
            text={
                <Trans
            i18nKey="buttons.updateBot"/>
            } />
                </div>
            </Tooltip>
                )
    }, [botDomain, disabled, onClick, updateIsOnline])
}

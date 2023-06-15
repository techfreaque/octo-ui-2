import React, {useMemo} from "react";
import {useIsBotOnlineContext, useRestartBot} from "../../../context/data/IsBotOnlineProvider";
import {Trans} from "react-i18next";
import AntButton, {buttonTypes} from "../../../components/Buttons/AntButton";
import {useIsDemoMode} from "../../../context/data/BotInfoProvider";

export default function RestartBotButton({
    buttonType = buttonTypes.warning,
    onClick
}) {
    const isOnline = useIsBotOnlineContext()
    const restartBot = useRestartBot()
    const isDemo = useIsDemoMode()
    return useMemo(() => {
        return (
            <AntButton disabled={
                    ! isOnline || isDemo
                }
                onClick={
                    () => {
                        restartBot()
                        onClick ?. ()
                    }
                }
                block={true}
                buttonType={buttonType}
                antIcon={"ReloadOutlined"}
                spin={
                    ! isOnline
                }
                text={
                    <Trans
                i18nKey="buttons.restartBot"/>
                }/>
        );
    }, [buttonType, isDemo, isOnline, onClick, restartBot])
}

import React, {useMemo} from "react";
import {useIsBotOnlineContext, useRestartBot} from "../../../context/data/IsBotOnlineProvider";
import {Trans} from "react-i18next";
import AntButton, {buttonTypes} from "../../../components/Buttons/AntButton";

export default function RestartBotButton({
    buttonType = buttonTypes.warning,
    onClick
}) {
    const isOnline = useIsBotOnlineContext()
    const restartBot = useRestartBot()
    return useMemo(() => {
        return (<AntButton disabled={
                ! isOnline
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
            }/>);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline, onClick])
}

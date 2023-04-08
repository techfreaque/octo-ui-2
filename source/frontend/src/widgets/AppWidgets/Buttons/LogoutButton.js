import React, {useMemo, useState} from "react";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {useIsBotOnlineContext, useUpdateIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {useNavigate} from "react-router-dom";
import {backendRoutes} from "../../../constants/backendConstants";
import {logOutBot} from "../../../api/actions";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import { Trans } from "react-i18next";

export default function LogoutButton() {
    const [isLoading, setIsloading] = useState(false);
    const updateIsOnline = useUpdateIsBotOnlineContext()
    const isOnline = useIsBotOnlineContext()
    const botDomain = useBotDomainContext();
    const botInfo = useBotInfoContext();
    const disabled = isLoading || ! isOnline
    const navigate = useNavigate();

    function onLoggedOut() {
        navigate(backendRoutes.loginBot);
    }
    return useMemo(() => {
        return botInfo?.can_logout && (
            <AntButton disabled={disabled}
                onClick={
                    // onLoggedOut
                    () => logOutBot(botDomain, updateIsOnline, setIsloading, onLoggedOut)
                }
                block={true}
                buttonType={buttonTypes.warning}
                antIcon= "LogoutOutlined"
                text= {<Trans i18nKey="buttons.logout"/>}
            />
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [botDomain, disabled, updateIsOnline])
}

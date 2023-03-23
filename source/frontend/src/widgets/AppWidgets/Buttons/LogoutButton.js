import React, {useMemo, useState} from "react";
import Button from "@mui/material/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock} from "@fortawesome/free-solid-svg-icons";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {useIsBotOnlineContext, useUpdateIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {useNavigate} from "react-router-dom";
import {backendRoutes} from "../../../constants/backendConstants";
import {logOutBot} from "../../../api/actions";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";

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
            <Button disabled={disabled}
                onClick={
                    () => logOutBot(botDomain, updateIsOnline, setIsloading, onLoggedOut)
                }
                variant="outlined"
                color="warning">
                <FontAwesomeIcon icon={faLock}
                    className={
                        disabled ? "fa-spin" : ""
                    }
                    style={
                        {marginRight: "5px"}
                    }/>
                Log out from Bot
            </Button>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [botDomain, disabled, updateIsOnline])
}

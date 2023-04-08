import React, {useMemo} from "react";
import Button from "@mui/material/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRotateRight} from "@fortawesome/free-solid-svg-icons";
import {useIsBotOnlineContext, useRestartBot} from "../../../context/data/IsBotOnlineProvider";
import { Trans } from "react-i18next";

export default function RestartBotButton() {
    const isOnline = useIsBotOnlineContext()
    const restartBot = useRestartBot()
    return useMemo(() => {
        return (
            <Button disabled={
                    ! isOnline
                }
                onClick={restartBot}
                variant="outlined"
                color="warning">
                <FontAwesomeIcon icon={faArrowRotateRight}
                    className={
                        isOnline ? "" : "fa-spin"
                    }
                    style={
                        {marginRight: "5px"}
                    }/>
                <Trans i18nKey="buttons.restartBot" />
            </Button>
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline])
}

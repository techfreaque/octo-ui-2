import { faRefresh } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Alert, Button } from "@mui/material"
import { useState } from "react"
import { resetTentaclesConfig } from "../../../api/actions"
import { useBotDomainContext } from "../../../context/config/BotDomainProvider"
import { getEnabledTentaclesList, useFetchCurrentTentaclesConfig } from "../../../context/config/TentaclesConfigProvider"
import { useBotInfoContext } from "../../../context/data/BotInfoProvider"
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider"

export default function ResetTentaclesConfigsButton() {
    const botInfo = useBotInfoContext()
    const botDomain = useBotDomainContext()
    const isOnline = useIsBotOnlineContext()
    const [isResetting, setIsResetting] = useState(false)
    const fetchCurrentTentaclesConfig = useFetchCurrentTentaclesConfig()
    const tentacles = getEnabledTentaclesList(botInfo)
    function handleResetTentacles() {
        setIsResetting(true)
        resetTentaclesConfig(tentacles, botDomain, setIsResetting, fetchCurrentTentaclesConfig)
    }
    return <>
        <h3 class="card-title level-1 je-object__title" style={{ display: "inline-block", marginLeft: "5px" }}>
            <label>Reset current Trading mode</label>
        </h3>
        <Alert severity="warning" style={{ maxWidth: "330px", marginLeft: "30px" }}>
            Resets the following tentacle settings to the defaults:
            <ul>
                {tentacles.map(tentacle => (<li>{tentacle}</li>))}
            </ul>
        </Alert>
        <Button disabled={isResetting || !isOnline} onClick={handleResetTentacles}
            variant="outlined" color="error" style={{ marginLeft: "30px" }}>
            <FontAwesomeIcon
                icon={faRefresh}
                style={{ marginRight: "5px" }}
            />
            Reset all tentacles settings
        </Button>
    </>
}
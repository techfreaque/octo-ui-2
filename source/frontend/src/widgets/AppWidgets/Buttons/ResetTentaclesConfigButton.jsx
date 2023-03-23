import { faRefresh } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Alert, Button } from "@mui/material"
import { useState } from "react"
import { resetTentaclesConfig } from "../../../api/actions"
import ResetConfig from "../../../components/UserInputs/ResetConfig"
import { useBotDomainContext } from "../../../context/config/BotDomainProvider"
import { getEnabledTentaclesList, useFetchCurrentTentaclesConfig } from "../../../context/config/TentaclesConfigProvider"
import { useBotInfoContext } from "../../../context/data/BotInfoProvider"
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider"

export default function ResetTentaclesConfigsButton() {
    const botInfo = useBotInfoContext()
    const botDomain = useBotDomainContext()
    const [isResetting, setIsResetting] = useState(false)
    const fetchCurrentTentaclesConfig = useFetchCurrentTentaclesConfig()
    const tentacles = getEnabledTentaclesList(botInfo)
    function handleResetTentacles() {
        setIsResetting(true)
        resetTentaclesConfig(tentacles, botDomain, setIsResetting, fetchCurrentTentaclesConfig)
    }
    return <ResetConfig title={"Reset current trading mode settings"}
        description={<>Resets the following tentacle settings to the defaults:
            <ul>
                {tentacles.map(tentacle => (<li>{tentacle}</li>))}
            </ul></>}
        resetButtonText={"Reset all tentacles settings"}
        isResetting={isResetting}
        handleReset={handleResetTentacles}/>
}
import {useState} from "react"
import {resetTentaclesConfig} from "../../../api/actions"
import ResetConfig from "../../../components/UserInputs/ResetConfig"
import {useBotDomainContext} from "../../../context/config/BotDomainProvider"
import {getEnabledTradingTentaclesList, useFetchCurrentTradingTentaclesConfig} from "../../../context/config/TentaclesConfigProvider"
import {useBotInfoContext} from "../../../context/data/BotInfoProvider"

export default function ResetTentaclesConfigsButton() {
        const botInfo = useBotInfoContext()
        const botDomain = useBotDomainContext()
        const [isResetting, setIsResetting] = useState(false)
        const fetchCurrentTentaclesConfig = useFetchCurrentTradingTentaclesConfig()
        const tentacles = getEnabledTradingTentaclesList(botInfo)
        function handleResetTentacles() {
            setIsResetting(true)
            resetTentaclesConfig(tentacles, botDomain, setIsResetting, fetchCurrentTentaclesConfig)
        }
        return <ResetConfig title={"Reset current trading mode settings"}
        description={<>Resets the following tentacle settings to the defaults:
            <ul>
                {tentacles.map(tentacle =>(<li> {tentacle}</li>)
    )
}
</ul></>}resetButtonText = {
"Reset all tentacles settings"}isResetting = {
isResetting}handleReset = {
handleResetTentacles} />}

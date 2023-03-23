import { useState } from "react"
import createNotification from "../../../components/Notifications/Notification";
import ResetConfig from "../../../components/UserInputs/ResetConfig"
import {useSaveTentaclesConfigAndSendAction} from "../../../context/config/TentaclesConfigProvider";
import {sendActionCommandToTradingMode} from "./SendActionCommandToTradingMode"

const CLEAR_PLOTTING_CACHE = "clear_plotting_cache"

export default function ResetTentaclesPlotCacheButton() {
    const [isResetting, setIsResetting] = useState(false)
    const saveTentaclesConfigAndSendAction = useSaveTentaclesConfigAndSendAction()
    function successCallback(){
        setIsResetting(false)
        createNotification("Successfully cleared plotting cache")
    }
    function failCallback(){
        setIsResetting(false)
        createNotification("Failed to reset plotting cache")
    }
    function handleResetPlotCache() {
        setIsResetting(true)
        sendActionCommandToTradingMode(CLEAR_PLOTTING_CACHE, saveTentaclesConfigAndSendAction, setIsResetting, successCallback, failCallback)
    }
    return <ResetConfig title="Reset trading mode plotting cache"
        description="Resets the plotting cache for thiplotting cacheall tentacles settings"
        resetButtonText="Reset trading mode plotting cache"
        isResetting={isResetting}
        handleReset={handleResetPlotCache}/>
}

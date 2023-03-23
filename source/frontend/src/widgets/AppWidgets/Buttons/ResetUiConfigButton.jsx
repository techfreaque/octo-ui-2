import { useState } from "react"
import createNotification from "../../../components/Notifications/Notification"
import ResetConfig from "../../../components/UserInputs/ResetConfig"
import { useFetchUiConfig, useSaveUiConfig } from "../../../context/config/UiConfigProvider"

export default function ResetUiConfigButton() {
    const saveUiConfig = useSaveUiConfig()
    const fetchConfig = useFetchUiConfig()
    const [isResetting, setIsResetting] = useState(false)
    function handleResetLayout() {
        setIsResetting(true)
        const success = () => {
            fetchConfig()
            setIsResetting(false)
            createNotification("Successfully resetted octo UI2 config")
        }
        const failed = () => {
            setIsResetting(false)
            createNotification("Failed to reset octo UI2 config")
        }
        saveUiConfig({
            backtesting_analysis_settings: {},
            backtesting_run_settings: {},
            bot_ui_layout: [],
            bot_ui_layout2: {},
            "current-live-id": 1,
            display_settings: {},
            live_analysis_settings: {},
            optimization_campaign: {},
            optimizer_campaigns_to_load: {},
            optimizer_inputs: {},
            optimizer_run_settings: {},

        }, success, failed, true)
    }
    return <ResetConfig title={"Reset all octo UI2 Settings"}
        description={<>Resets the following settings:
            <ul>
                <li>
                    Backtesting Settings
                </li>
                <li>
                    Optimizer Settings
                </li>
                <li>
                    Trading Analysis Settings
                </li>
                <li>
                    Display Settings
                </li>
                <li>
                    Page Builder Page Layout
                </li>
            </ul></>}
        resetButtonText={"Reset all octo UI2 Settings"}
        isResetting={isResetting}
        handleReset={handleResetLayout}/>
}
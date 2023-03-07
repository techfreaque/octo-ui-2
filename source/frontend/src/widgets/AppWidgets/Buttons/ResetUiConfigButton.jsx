import { faRefresh } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Alert, Button } from "@mui/material"
import { useState } from "react"
import createNotification from "../../../components/Notifications/Notification"
import { useFetchUiConfig, useSaveUiConfig } from "../../../context/config/UiConfigProvider"
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider"

export default function ResetUiConfigButton() {
    const saveUiConfig = useSaveUiConfig()
    const fetchConfig = useFetchUiConfig()
    const isOnline = useIsBotOnlineContext()
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
    return <>
        <h3 class="card-title level-1 je-object__title" style={{ display: "inline-block", marginLeft: "5px" }}>
            <label>Reset all octo UI2 Settings</label>
        </h3>
        <Alert severity="warning" style={{ maxWidth: "330px", marginLeft: "30px" }}>
            Resets the following settings:
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
            </ul>
        </Alert>
        <Button disabled={isResetting || !isOnline} onClick={handleResetLayout}
            variant="outlined" color="error" style={{ marginLeft: "30px" }}>
            <FontAwesomeIcon
                icon={faRefresh}
                style={{ marginRight: "5px" }}
            />
            Reset all octo UI2 Settings
        </Button>
    </>
}
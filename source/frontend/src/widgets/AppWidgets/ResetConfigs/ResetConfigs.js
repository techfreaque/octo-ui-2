import {Button} from 'antd'
import React, {useState} from 'react'
import { useBotDomainContext } from '../../../context/config/BotDomainProvider'
import { useBotInfoContext } from '../../../context/data/BotInfoProvider'
import { useFetchUiConfig, useSaveUiConfig } from '../../../context/config/UiConfigProvider'
import { getEnabledTradingTentaclesList, useFetchCurrentTradingTentaclesConfig, useSaveTentaclesConfigAndSendAction } from '../../../context/config/TentaclesConfigProvider'
import { backendRoutes } from '../../../constants/backendConstants'
import createNotification from '../../../components/Notifications/Notification'
import { sendActionCommandToTradingMode } from '../Buttons/SendActionCommandToTradingMode'
import { resetStorage, resetTentaclesConfig } from '../../../api/actions'
import ResetIndividual from './ResetIndividual'
import { projectName } from '../../../constants/frontendConstants'


export default function ResetConfigs() {
    const [checkedList, setCheckedList] = useState({})
    const [isResetting, setIsResetting] = useState()
    const botDomain = useBotDomainContext()
    const botInfo = useBotInfoContext()
    const saveUiConfig = useSaveUiConfig()
    const fetchCurrentTentaclesConfig = useFetchCurrentTradingTentaclesConfig()
    const tentacles = getEnabledTradingTentaclesList(botInfo)
    const storages = {
        resetAllUIConfig: {
            key: "resetAllUIConfig",
            title: `Reset all ${projectName} Settings`,
            description: (<>
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
            </>)
        },
        resetTradingModePlottingCache: {
            key: "resetTradingModePlottingCache",
            title: "Reset trading mode plotting cache",
            description: 'Resets the plotting cache for thiplotting cacheall tentacles settings'
        },
        resetTradingmodeSettings: {
            key: "resetTradingmodeSettings",
            title: "Reset current trading mode settings",
            description: (<>
                Resets the following tentacle settings to the defaults:
                <ul>
                    {tentacles.map(tentacle=>(<li key={tentacle}>{tentacle}</li>))}
                </ul>
            </>
                )
        },
        resetPortfolioHistory: {
            key: "resetPortfolioHistory",
            title: "Reset the Portfolio History",
            description: 'Resets the portfolio history',
            api: backendRoutes.clearPortfolioHistory
        },
        resetOrdersHistory: {
            key: "resetOrdersHistory",
            title: "Reset the Orders History",
            description: "Resets the orders history",
            api: backendRoutes.clearOrdersHistory
        },
        resetTradesHistory: {
            key: "resetTradesHistory",
            title: "Reset the Trades History",
            description: "Resets the trades history",
            api: backendRoutes.clearTradesHistory
        },
        resetTransactionsHistory: {
            key: "resetTransactionsHistory",
            title: "Reset the Transactions History",
            description: "Resets the transactions history",
            api: backendRoutes.clearTransactionsHistory
        }
    };
    
    const fetchConfig = useFetchUiConfig()
    const saveTentaclesConfigAndSendAction = useSaveTentaclesConfigAndSendAction()

    function handleCheckboxClick(key, state) {
        setCheckedList(prevCheckedList => {
            const newCheckedList = {
                ...prevCheckedList
            }
            newCheckedList[key] = ! newCheckedList[key]
            return newCheckedList
        })
    }

    function toggleSelectAll() {
        setCheckedList(prevCheckedList => {
            const isAllSelected = Object.keys(storages).every(thisKey => (prevCheckedList[thisKey]))
            const newSelected = {}
            if (! isAllSelected) {
                Object.keys(storages).forEach(thisKey => {
                    newSelected[thisKey] = true
                })
            }
            return newSelected
        })
    }

    function handleResetUiConfig() {
        setIsResetting(true)
        const success = () => {
            fetchConfig()
            setIsResetting(false)
            createNotification(`Successfully resetted ${projectName} config`)
        }
        const failed = () => {
            setIsResetting(false)
            createNotification(`Failed to reset ${projectName} config`)
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
            optimizer_run_settings: {}

        }, success, failed, true)
    }

    function handleResetPlotCache() {
        const CLEAR_PLOTTING_CACHE = "clear_plotting_cache"
        function successCallback() {
            setIsResetting(false)
            createNotification("Successfully cleared plotting cache")
        }
        function failCallback() {
            setIsResetting(false)
            createNotification("Failed to reset plotting cache")
        }
        setIsResetting(true)
        sendActionCommandToTradingMode(CLEAR_PLOTTING_CACHE, saveTentaclesConfigAndSendAction, setIsResetting, successCallback, failCallback)
    }

    function handleResetTentacles() {
        setIsResetting(true)
        resetTentaclesConfig(tentacles, botDomain, setIsResetting, fetchCurrentTentaclesConfig)
    }
    function handleResetStorage(storagekey) {
        setIsResetting(true)
        const storage = storages[storagekey]
        resetStorage(storage, botDomain, setIsResetting, fetchCurrentTentaclesConfig)
    }
    function handleReset() {
        const keysToReset = Object.keys(checkedList)
        if (keysToReset.includes(storages.resetAllUIConfig.key)) {
            handleResetUiConfig()
        }
        if (keysToReset.includes(storages.resetTradingModePlottingCache.key)) {
            handleResetPlotCache()
        }
        if (keysToReset.includes(storages.resetTradingmodeSettings.key)) {
            handleResetTentacles()
        }
        if (keysToReset.includes(storages.resetPortfolioHistory.key)) {
            handleResetStorage(storages.resetPortfolioHistory.key)
        }
        if (keysToReset.includes(storages.resetOrdersHistory.key)) {
            handleResetStorage(storages.resetOrdersHistory.key)
        }
        if (keysToReset.includes(storages.resetTradesHistory.key)) {
            handleResetStorage(storages.resetTradesHistory.key)
        }
        if (keysToReset.includes(storages.resetTransactionsHistory.key)) {
            handleResetStorage(storages.resetTransactionsHistory.key)
        }
    }
    return (<div style={
        {
            margin: "25px"
        }
    }>
            {Object.keys(storages).map(storageKey => (
                <ResetIndividual title={
                    storages[storageKey].title
                }
                    key={storages[storageKey].key}
                titleKey={
                    storages[storageKey].key
                }
                description={
                    storages[storageKey].description
                }
                handleCheckboxClick={handleCheckboxClick}
                checkedList={checkedList}/>
           ))}

            <div style={
                {
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'right'
                }
            }>
                <Button onClick={toggleSelectAll}
                    danger>Select All</Button>
                <Button disabled={
                        isResetting || !Boolean(Object.keys(checkedList).length)
                    }
                    onClick={handleReset}
                    type="primary"
                    danger
                    style={
                        {marginLeft: '10px'}
                }>Reset Selected</Button>
            </div>
    </div>)
}

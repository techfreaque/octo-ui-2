import {useState} from "react"
import {resetStorage} from "../../../api/actions"
import ResetConfig from "../../../components/UserInputs/ResetConfig"
import {backendRoutes} from "../../../constants/backendConstants"
import {useBotDomainContext} from "../../../context/config/BotDomainProvider"
import {useFetchCurrentTradingTentaclesConfig} from "../../../context/config/TentaclesConfigProvider"

const storages = {

    portfolioHistory: {
        name: "portfolioHistory",
        api: backendRoutes.clearPortfolioHistory,
        title: "Portfolio History",
        description: "Resets the portfolio history"
    },
    ordersHistory: {
        name: "ordersHistory",
        api: backendRoutes.clearOrdersHistory,
        title: "Orders History",
        description: "Resets the orders history"
    },
    tradesHistory: {
        name: "tradesHistory",
        api: backendRoutes.clearTradesHistory,
        title: "Trades History",
        description: "Resets the trades history"
    },
    transactionsHistory: {
        name: "transactionsHistory",
        api: backendRoutes.clearTransactionsHistory,
        title: "Transactions History",
        description: "Resets the transactions history"
    },
}

export const availableStorages = [storages.portfolioHistory.name, storages.ordersHistory.name, storages.tradesHistory.name, storages.transactionsHistory.name]

export default function ResetHistoryStorageButton({storageName}) {
    const botDomain = useBotDomainContext()
    const [isResetting, setIsResetting] = useState(false)
    const fetchCurrentTentaclesConfig = useFetchCurrentTradingTentaclesConfig()
    const storage = storages[storageName]
    function handleResetStorage() {
        setIsResetting(true)
        resetStorage(storage, botDomain, setIsResetting, fetchCurrentTentaclesConfig)
    }
    return <ResetConfig
        title={`Reset the ${storage.title}`}
        resetButtonText={`Reset ${storage.title}`}
        description={storage.description}
        isResetting={isResetting}
        handleReset={handleResetStorage}/>
}

export const basePath = "/octo_ui2";
export const apiPath = "/api";
export const advancedPath = "/advanced";

export const backendRoutes = {
    frontendEntry: `${basePath}/home`,
    botInfo: `${basePath}/bot-info`,
    botConfig: `${basePath}/bot-config`,
    plottedData: `${basePath}/plotted_data`,
    plottedRunData: `${basePath}/plotted_run_data`,
    botPortfolio: `${basePath}/portfolio`,
    symbolsInfo: `${basePath}/symbols-info`,
    appStore: `${basePath}/app-store`,
    daemons: `${basePath}/daemons`,
    resetDaemons: `${basePath}daemons/reset`,
    fetchTentaclesConfig: `${basePath}/tentacles_config`,
    updateTentaclesConfigAndSendCommand: `${basePath}/trading_mode_command`,
    backtestingRunData: `${basePath}/backtesting_runs`,
    cancelAllOrders: `${basePath}/orders/cancel_all`,
    closeAllPositions: `${basePath}/positions/close_all`,
    liveRunData: `${basePath}/live_run_data`,
    UIConfig: `${basePath}/ui_config`,
    optimizerQueueUpdate: `${basePath}/optimizer/update`,
    optimizerAddToQueue: `${basePath}/optimizer/add`,
    optimizerGetQueue: `${basePath}/optimizer/get`,
    logoutBot: `${basePath}/logout`,

    installApp: `${advancedPath}/tentacle_packages?update_type=add_package`,
    optimizerStop: `${advancedPath}/strategy-optimizer?update_type=cancel_optimizer`,

    profileMedia: "/profile_media/user/profiles",
    staticImg: "/static/img",
    manageSymbol: "/profile",
    exchangeLogo: "/exchange_logo",
    currencyLogos: "/currency_logos",
    updateProfileInfo: `${basePath}/update_profile_info`,
    duplicateProfile: "/profiles_management/duplicate?profile_id=",
    deleteProfile: "/profiles_management/remove",
    importProfile: "/profiles_management/download",
    exportProfile: "/profiles_management/export?profile_id=",
    config: "/config",
    restartBot: "/commands/restart",
    stopBot: "/commands/stop",
    updateBot: "/commands/update",
    loginBot: "/login",

    updateTentaclesConfig: "/config_tentacles?action=update&reload=true",
    resetTentaclesConfig: "/config_tentacle?action=factory_reset&reload=true",
    backtesting: "/backtesting",
    backtestingStart: "/backtesting?action_type=start_backtesting_with_current_bot_data&source=strategy_design&reset_tentacle_config=False&auto_stop=True",
    backtestingStop: "/backtesting?action_type=stop_backtesting",

    clearPortfolioHistory: `${apiPath}/clear_portfolio_history`,
    clearOrdersHistory: `${apiPath}/clear_orders_history`,
    clearTradesHistory: `${apiPath}/clear_trades_history`,
    clearTransactionsHistory: `${apiPath}/clear_transactions_history`,
    getAllOrders: `${apiPath}/orders`,
    cancelOrder: `${apiPath}/orders?action=cancel_order`,
    getAllPositions: `${apiPath}/positions`,
    closePosition: `${apiPath}/positions?action=close_position`,
    getAllTrades: `${apiPath}/trades`,

    strategyDesignDeleteRunData: "/strategy_design/run_data?action=delete",
    optimizerStart: "/strategy_design/strategy_design_start_optimizerstart",
    cacheActionDeleteCurrentCache: "/strategy_design/cacheclear_plotted_cache",
    cacheActionDeleteAllCache: "/strategy_design/cacheclear_all_cache"


}

export const ID_SEPARATOR = "_------_";
export const TENTACLE_SEPARATOR = "###";
export const MAX_SEARCH_LABEL_SIZE = 32;
export const TIMESTAMP_DATA = [
    "timestamp",
    "start time",
    "end time",
    "start_time",
    "end_time"
];
export const ID_DATA = ["id", "backtesting id", "optimizer id"];
export const METADATA_HIDDEN_FIELDS = ["backtesting files", "user inputs"]
export const METADATA_UNDISPLAYED_FIELDS = ["children"]
export const CUSTOM_USER_INPUT_PATH_SEPARATOR = "/"
export const _INPUT_SEPARATOR = "_------_";

export const hidden_class = "d-none"

export const CURRENT_BOT_DATA = "current_bot_data"
export const OPTIMIZER_CAMPAIGNS_TO_LOAD_KEY = "optimizer_campaigns_to_load";
export const OPTIMIZER_RUN_SETTINGS_KEY = "optimizer_run_settings";
export const OPTIMIZER_CAMPAIGN_KEY = "optimization_campaign";
export const OPTIMIZER_INPUTS_KEY = "optimizer_inputs";
export const CURRENT_LIVE_ID_KEY = "current-live-id";
export const BACKTESTING_RUN_SETTINGS_KEY = "backtesting_run_settings";
export const DISPLAY_SETTINGS_KEY = "display_settings"
export const DISPLAYED_ELEMENTS_KEY = "displayed_elements"
export const GRAPHS_KEY = "graphs"

export const CANDLES_PLOT_SOURCES = ["open", "high", "low", "close"];
export const ALL_PLOT_SOURCES = ["y", "z", "volume"].concat(CANDLES_PLOT_SOURCES);

export const botLayoutKey = "bot_ui_layout2"
export const oldBotLayoutKey = "bot_ui_layout"

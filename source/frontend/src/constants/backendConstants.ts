/* eslint-disable i18next/no-literal-string */
export const basePath = "/octo_ui2";
export const proBasePath = "/octo_ui2_pro";
export const apiPath = "/api";
export const advancedPath = "/advanced";

export const backendRoutes = {
  frontendEntry: `${basePath}/home`,
  botInfo: `${basePath}/bot-info`,
  exchangeInfo: `${basePath}/exchanges-info`,
  exchangesList: `${basePath}/exchanges-list`,
  // servicesInfo: `${basePath}/services-info`,
  botConfig: `${basePath}/bot-config`,
  plottedData: `${basePath}/plotted_data`,
  plottedRunData: `${basePath}/plotted_run_data`,
  botPortfolio: `${basePath}/portfolio`,
  symbolsInfo: `${basePath}/symbols-info`,
  octobotHome: "/home",
  appStoreFree: "/free/repo",
  appStoreLogin: "/login",
  appStoreLogout: "/logout",
  appStoreSignup: "/register",
  appStoreUpload: "/upload_app",
  appStoreRate: "/rate_app",
  appUnpublishApp: "/unpublish_app",
  appDeleteApp: "/delete_app",
  appPublishApp: "/publish_app",
  appStoreCreatePayment: "/create-payment",
  appStoreCheckPayment: "/check-payment",
  appStoreUsers: "/users",
  appStoreAffiliateDashboard: "/affiliate_dashboard",
  appStorePayments: "/get-payments",
  appStoreDeleteUser: "/delete-user",
  packagesData: `${basePath}/tentacles-info`,
  appStorePremium: "/premium/repo",
  daemons: `${basePath}/daemons`,
  resetDaemons: `${basePath}daemons/reset`,
  fetchTentaclesConfig: `${basePath}/tentacles_config`,
  updateTentaclesConfigAndSendCommand: `${basePath}/trading_mode_command`,
  backtestingRunData: `${basePath}/backtesting_runs/get`,
  deleteRunData: `${basePath}/backtesting_runs/delete`,
  cancelAllOrders: `${basePath}/orders/cancel_all`,
  closeAllPositions: `${basePath}/positions/close_all`,
  liveRunData: `${basePath}/live_run_data`,
  uIConfig: `${basePath}/ui_config`,
  logoutBot: `${basePath}/logout`,
  getLogs: `${basePath}/logs`,
  exportLogs: "/export_logs",

  proConfig: `${proBasePath}/pro_config`,
  optimizerQueueUpdate: `${proBasePath}/optimizer/update`,
  optimizerAddToQueue: `${proBasePath}/optimizer/add`,
  optimizerGetQueue: `${proBasePath}/optimizer/get`,
  optimizerStart: `${proBasePath}/optimizer/start`,

  installApp: `${basePath}/tentacle_packages?update_type=add_package`,
  uninstallApp: `${basePath}/tentacle_packages?update_type=uninstall_modules`,
  optimizerStop: `${advancedPath}/strategy-optimizer?update_type=cancel_optimizer`,
  trainingStop: `${basePath}/stop_training`,

  profileMedia: `${basePath}/profile_media/user/profiles`,
  staticImg: "/static/img",
  manageSymbol: "/profile",
  exchangeLogo: "/exchange_logo",
  currencyLogos: "/currency_logos",
  updateProfileInfo: `${basePath}/update_profile_info`,
  duplicateProfile: `${basePath}/update_profile/duplicate?profile_id=`,
  selectProfile: `${basePath}/update_profile/select?profile_id=`,
  deleteProfile: "/profiles_management/remove",
  importProfile: "/profiles_management/import",
  importProfileFromUrl: `/${basePath}/profiles/import`,
  exportApp: `/${basePath}/export_tentacle/`,
  exportProfile: "/profiles_management/export?profile_id=",
  config: "/config",
  restartBot: "/commands/restart",
  stopBot: "/commands/stop",
  updateBot: "/commands/update",
  loginBot: "/login",

  updateTentaclesConfig: "/config_tentacles?action=update&reload=true",
  updateTentaclesConfigAndReRun:
    "/config_tentacles?action=update&reload_scripts=true",
  updateTentaclesConfigNoReload: "/config_tentacles?action=update",
  resetTentaclesConfig: "/config_tentacle?action=factory_reset&reload=true",
  backtesting: "/backtesting",
  backtestingStart:
    "/backtesting?action_type=start_backtesting_with_current_bot_data&source=strategy_design&reset_tentacle_config=False&auto_stop=True",
  backtestingStop: "/backtesting?action_type=stop_backtesting",

  clearPortfolioHistory: `${apiPath}/clear_portfolio_history`,
  clearOrdersHistory: `${apiPath}/clear_orders_history`,
  clearTradesHistory: `${apiPath}/clear_trades_history`,
  clearTransactionsHistory: `${apiPath}/clear_transactions_history`,
  getAllOrders: `${apiPath}/orders`,
  cancelOrder: `${apiPath}/orders?action=cancel_order`,
  cancelOrders: `${apiPath}/orders?action=cancel_orders`,
  getAllPositions: `${apiPath}/positions`,
  closePosition: `${apiPath}/positions?action=close_position`,
  getAllTrades: `${apiPath}/trades`,

  cacheActionDeleteCurrentCache: "/strategy_design/cacheclear_plotted_cache",
  cacheActionDeleteAllCache: "/strategy_design/cacheclear_all_cache",
};

export const ID_SEPARATOR = "_------_";
export const TENTACLE_SEPARATOR = "###";
export const MAX_SEARCH_LABEL_SIZE = 32;
export const TIMESTAMP_DATA = [
  "timestamp",
  "start time",
  "end time",
  "start_time",
  "end_time",
];
export const ID_DATA = ["id", "backtesting id", "optimizer id"];
export const METADATA_HIDDEN_FIELDS = [
  "backtesting files",
  "user inputs",
  "end portfolio",
  "start portfolio",
  "R² end balance",
  "duration",
  "trades",
  "name",
  "leverage",
  "markets profitability",
  "future_contracts",
  "start_time",
  "end_time",
  "ref_market",
  "exchanges",
  "trading_type",
  "timestamp",
];
export const METADATA_ADVANCED_HIDDEN_FIELDS = ["user inputs"];
export const METADATA_UNDISPLAYED_FIELDS = ["user inputs"];
export const CUSTOM_USER_INPUT_PATH_SEPARATOR = "/";
export const INPUT_SEPARATOR = "_------_";

export const hidden_class = "d-none";

export const CURRENT_BOT_DATA = "current_bot_data";
export const OPTIMIZER_CAMPAIGNS_TO_LOAD_KEY = "optimizer_campaigns_to_load";
export const OPTIMIZER_RUN_SETTINGS_KEY = "optimizer_run_settings";
export const OPTIMIZER_CAMPAIGN_KEY = "optimization_campaign";
export const OPTIMIZER_INPUTS_KEY = "optimizer_inputs";
export const CURRENT_LIVE_ID_KEY = "current-live-id";
export const BACKTESTING_RUN_SETTINGS_KEY = "backtesting_run_settings";
export const DISPLAY_SETTINGS_KEY = "display_settings";
export const DISPLAYED_ELEMENTS_KEY = "displayed_elements";
export const GRAPHS_KEY = "graphs";

export type CanldesPlotSourceType = "open" | "high" | "low" | "close";
export type PlotSourceType = "x" | "y" | "z" | "volume" | CanldesPlotSourceType;

export const CANDLES_PLOT_SOURCES: CanldesPlotSourceType[] = [
  "open",
  "high",
  "low",
  "close",
];
export const ALL_PLOT_SOURCES: PlotSourceType[] = ["y", "z", "volume"].concat(
  CANDLES_PLOT_SOURCES
) as PlotSourceType[];

export const botLayoutKey = "bot_ui_layout2";

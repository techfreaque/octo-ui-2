import { CURRENT_BOT_DATA } from "../../../constants/backendConstants";

const DISPLAYED_ELEMENTS_KEYS = ["main-chart", "sub-chart", "backtesting-run-overview", "backtesting-details", "list-of-trades-part"]
const DISPLAYED_ELEMENTS_TITLES = [
    "main-chart: Display plotted elements on the main chart section ",
    "sub-chart: Display plotted elements on the sub chart section ",
    "backtesting-run-overview: Display plotted elements on the backtesting run overview section ",
    "backtesting-details: Display elements on the backtesting run details section ",
    "list-of-trades-part: Display elements on the list of trades section "]


export function getUiConfigSchema(configKey, dataFiles, currentSymbols) {
    const dataFilevalues = [CURRENT_BOT_DATA]
    const dataFilesTitles = [`Currently traded asset(s): ${currentSymbols}`,]
    dataFiles.forEach(dataFile => {
        dataFilevalues.push(dataFile[0])
        dataFilesTitles.push(`${dataFile[1].symbols} for ${dataFile[1].time_frames} from ${dataFile[1].start_date} to from ${dataFile[1].end_date}`)
    })
    const uiConfigSchema = {
        type: "object",
        title: "UI Config",
        properties: {
            backtesting_analysis_settings: {
                type: "object",
                title: "Backtesting Analysis Settings",
                properties: {
                    "display_backtest_details": {
                        type: "boolean",
                        format: "checkbox",
                        fieldType: "boolean"
                    },
                    "display_trades_and_positions": {
                        type: "boolean",
                        title: "display_trades_and_positions",
                        format: "checkbox",
                        fieldType: "boolean"
                    },
                    "plot_best_case_growth_on_backtesting_chart": {
                        type: "boolean",
                        title: "plot_best_case_growth_on_backtesting_chart",
                        format: "checkbox",
                        fieldType: "boolean"
                    },
                    "plot_funding_fees_on_backtesting_chart": {
                        type: "boolean",
                        title: "plot_funding_fees_on_backtesting_chart",
                        format: "checkbox",
                        fieldType: "boolean"
                    },
                    "plot_pnl_on_backtesting_chart": {
                        type: "boolean",
                        title: "plot_pnl_on_backtesting_chart",
                        format: "checkbox",
                        fieldType: "boolean",
                        "default": true
                    },
                    "plot_pnl_on_main_chart": {
                        type: "boolean",
                        title: "plot_pnl_on_main_chart",
                        format: "checkbox",
                        fieldType: "boolean"
                    },
                    "plot_trade_gains_on_backtesting_chart": {
                        type: "boolean",
                        title: "plot_trade_gains_on_backtesting_chart",
                        format: "checkbox",
                        fieldType: "boolean"
                    },
                    "plot_trade_gains_on_main_chart": {
                        type: "boolean",
                        title: "plot_trade_gains_on_main_chart",
                        format: "checkbox",
                        fieldType: "boolean"
                    },
                    "plot_win_rate_on_backtesting_chart": {
                        type: "boolean",
                        title: "plot_win_rate_on_backtesting_chart",
                        format: "checkbox",
                        fieldType: "boolean"
                    },
                    "plot_wins_and_losses_count_on_backtesting_chart": {
                        type: "boolean",
                        title: "plot_wins_and_losses_count_on_backtesting_chart",
                        format: "checkbox",
                        fieldType: "boolean"
                    }
                }
            },
            backtesting_run_settings: {
                type: "object",
                title: "Backtesting Run Settings",
                properties: {
                    data_source: {
                        type: "string",
                        title: "Backtest on",
                        enum: dataFilevalues,
                        options: { enum_titles: dataFilesTitles }
                    },
                    exchange_type: {
                        type: "string",
                        title: "Exchange type",
                        enum: [
                            "use_current_profile",
                            "spot",
                            "margin",
                            "linear_perpetual",
                            "inverse_perpetual",
                        ],
                        options: {
                            enum_titles: [
                                "Current Profile Settings",
                                "Spot",
                                "Margin",
                                "Futures: Linear Perpetual",
                                "Futures: Inverse Perpetual",
                            ]
                        }
                    },
                    start_timestamp: {
                        type: "integer",
                        format: "date",
                        title: "Start Date"

                    },
                    end_timestamp: {
                        type: "integer",
                        format: "date",
                        title: "End Date"
                    }
                }
            },
            display_settings: {
                type: "object",
                title: "Display Settings",
                "options": {
                    "grid_columns": 12,
                },
                properties: {
                    displayed_elements: {
                        "type": "array",
                        "uniqueItems": true,
                        "format": "select2",
                        "options": {
                            "grid_columns": 12,
                            "select2": {
                                "tags": true
                            },
                        },
                        title: "Elements to render",
                        items: {
                            enum: DISPLAYED_ELEMENTS_KEYS,
                            type: "string",
                            "options": { enum_titles: DISPLAYED_ELEMENTS_TITLES },
                        },
                    },
                    graphs: {
                        type: "object",
                        title: "Graphs",
                        properties: {
                            max_candles_before_line_display: {
                                title: "Candles to display before line(s) ",
                                "options": {
                                    "grid_columns": 12,
                                },
                                type: "number",
                                format: "number",
                                minimum: 0
                            },
                            max_candles_line_sources: {
                                "type": "array",
                                "uniqueItems": true,
                                "format": "select2",
                                "options": {
                                    "grid_columns": 12,
                                    "select2": {
                                        "tags": true
                                    },
                                },
                                title: "Line(s) sources",
                                items: {
                                    enum: ["open", "high", "low", "close"],
                                    type: "string",
                                    "options": {
                                        enum_titles: ["Open", "High", "Low", "Close"],
                                    },
                                },
                            },
                            display_unified_tooltip: {
                                title: "Display tooltips: Display tooltips on graphs (slower)",
                                type: "boolean",
                                format: "checkbox",
                                fieldType: "boolean",
                                "options": {
                                    "grid_columns": 12,
                                }
                            },
                            display_use_log_scale: {
                                title: "Use log scale: Displays all graphs with log scale except data with negative values",
                                type: "boolean",
                                format: "checkbox",
                                fieldType: "boolean",
                                "options": {
                                    "grid_columns": 12,
                                }
                            },
                        }
                    },
                }
            },
            optimizer_run_settings: {
                type: "object",
                title: "Optimizer Run Settings",
                properties: {
                    idle_cores: {
                        title: "CPU cores to leave idle :",
                        type: "number",
                        format: "number",
                        minimum: 0
                    },
                    optimizer_id: {
                        title: "Optimizer id :",
                        type: "number",
                        format: "number",
                        minimum: 1
                    },
                    queue_size: {
                        title: "Amount of random runs added to the queue:",
                        type: "number",
                        format: "number",
                        minimum: 1
                    },
                    notify_when_complete: {
                        title: "notify when completed",
                        type: "boolean",
                        format: "checkbox",
                        fieldType: "boolean"
                    },
                    exchange_type: {
                        type: "string",
                        title: "Exchange type",
                        enum: [
                            "use_current_profile",
                            "spot",
                            "margin",
                            "linear_perpetual",
                            "inverse_perpetual",
                        ],
                        options: {
                            enum_titles: [
                                "Current Profile Settings",
                                "Spot",
                                "Margin",
                                "Futures: Linear Perpetual",
                                "Futures: Inverse Perpetual",
                            ]
                        }
                    },
                    data_source: {
                        type: "string",
                        title: "Backtest on",
                        enum: dataFilevalues,
                        options: { enum_titles: dataFilesTitles }
                    },
                    start_timestamp: {
                        type: "integer",
                        format: "date",
                        title: "Start Date"
                    },
                    end_timestamp: {
                        type: "integer",
                        format: "date",
                        title: "End Date"
                    },
                }
            },
            optimizer_inputs: {
                type: "object",
                title: "Optimizer Setup",
                properties: {
                    user_inputs: {
                        type: "object",
                        title: "User Inputs",
                        format: "tabs",
                        properties: {}
                    },
                    filters_settings: {
                        type: "array",
                        title: "Optimizer Filter"
                    }
                }
            },
            optimization_campaign: {
                type: "object",
                title: "Campaign Name",
                properties: {
                    name: {
                        type: "string",
                        title: "Campaign Name"
                    }
                }
            },
            optimizer_campaigns_to_load: {
                type: "object",
                title: "Campaigns to load",
                patternProperties: {
                    "^.*$": {
                        type: "boolean",
                        format: "checkbox",
                        fieldType: "boolean"
                    }
                }
            }

        }
    };
    return uiConfigSchema.properties[configKey]
}
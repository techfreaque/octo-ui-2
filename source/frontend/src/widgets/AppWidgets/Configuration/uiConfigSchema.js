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
    dataFiles?.forEach(dataFile => {
        dataFilevalues.push(dataFile[0])
        dataFilesTitles.push(`${dataFile[1].symbols} for ${dataFile[1].time_frames} from ${dataFile[1].start_date} to from ${dataFile[1].end_date}`)
    })
    function selectableChartlocation(name, title) {
        return {
            [name]: {
                type: "string",
                title: title,
                enum: [
                    "main-chart",
                    "sub-chart",
                    "backtesting-run-overview",
                ],
                options: {
                    enum_titles: [
                        "Main Chart",
                        "Main Sub-Chart",
                        "Secondary-Chart"
                    ]
                }
            },
        }
    }
    const uiConfigSchema = {
        type: "object",
        title: "UI Config",
        properties: {
            backtesting_analysis_settings: {
                type: "object",
                title: "Trade Analysis Settings",
                properties: {
                    backtesting_plot_settings: {
                        type: "object",
                        title: "Plot Settings",
                        properties: {
                            "plot_unrealized_portfolio": {
                                type: "boolean",
                                title: "Plot unrealized portfolio value",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                            ...selectableChartlocation("chart_location_unrealized_portfolio_value", "Chart location unrealized portfolio value"),
                            "plot_realized_portfolio": {
                                type: "boolean",
                                title: "Plot realized portfolio value",
                                format: "checkbox",
                                fieldType: "boolean",
                                "default": true
                            },
                            ...selectableChartlocation("chart_location_realized_portfolio_value", "Chart location realized portfolio value"),
                            "plot_trade_gains": {
                                type: "boolean",
                                title: "Plot realized gains per trade",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                            ...selectableChartlocation("chart_location_trade_gains", "Chart location realized gains per trade"),
                            "plot_funding_fees": {
                                type: "boolean",
                                title: "Plot funding fees",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                            ...selectableChartlocation("chart_location_funding_fees", "Chart location funding fees"),
                            "plot_best_case_growth": {
                                type: "boolean",
                                title: "Plot best case portfolio value",
                                format: "checkbox",
                                fieldType: "boolean",
                                "default": true
                            },
                            ...selectableChartlocation("chart_location_best_case_growth", "Chart location best case portfolio value"),
                            "plot_win_rate": {
                                type: "boolean",
                                title: "Plot best case portfolio value",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                            ...selectableChartlocation("chart_location_win_rate", "Chart location win rate"),
                            "plot_wins_and_losses_count": {
                                type: "boolean",
                                title: "Plot wins and losses count",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                            ...selectableChartlocation("chart_location_wins_and_losses_count", "Chart location wins and losses count"),
                            "plot_withdrawals": {
                                type: "boolean",
                                title: "Plot withdrawals",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                            ...selectableChartlocation("chart_location_withdrawals", "Chart location withdrawals"),
                        }
                    },
                    backtesting_table_settings: {
                        type: "object",
                        title: "Table Settings",
                        properties: {
                            "display_trades_and_positions": {
                                type: "boolean",
                                title: "Display Trades and Positions Table",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                            "display_withdrawals_table": {
                                type: "boolean",
                                title: "Display withdrawals table",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                        }
                    },
                    backtesting_analysis_report_settings: {
                        type: "object",
                        title: "Analysis Report Settings",
                        properties: {

                            "display_analysis_report": {
                                type: "boolean",
                                format: "checkbox",
                                title: "Display Analysis Report",
                                fieldType: "boolean"
                            },
                            "display_analysis_report_general": {
                                type: "boolean",
                                format: "checkbox",
                                title: "Display Analysis Report General",
                                fieldType: "boolean"
                            },
                            "display_analysis_report_performances": {
                                type: "boolean",
                                format: "checkbox",
                                title: "Display Analysis Report Performances",
                                fieldType: "boolean"
                            },
                            "display_analysis_report_details": {
                                type: "boolean",
                                format: "checkbox",
                                title: "Display Analysis Report Details",
                                fieldType: "boolean"
                            },
                            "display_analysis_report_strategy_settings": {
                                type: "boolean",
                                format: "checkbox",
                                title: "Display Analysis Report Strategy Settings",
                                fieldType: "boolean"
                            },
                        }
                    }
                }
            },
            live_analysis_settings: {
                type: "object",
                title: "Trade Analysis Settings",
                properties: {
                    live_plot_settings: {
                        type: "object",
                        title: "Plot Settings",
                        properties: {
                            "plot_unrealized_portfolio": {
                                type: "boolean",
                                title: "Plot unrealized portfolio value",
                                format: "checkbox",
                                fieldType: "boolean",
                                "default": true
                            },
                            ...selectableChartlocation("chart_location_unrealized_portfolio_value", "Chart location unrealized portfolio value"),
                            "plot_realized_portfolio": {
                                type: "boolean",
                                title: "Plot realized portfolio value",
                                format: "checkbox",
                                fieldType: "boolean",
                                "default": true
                            },
                            ...selectableChartlocation("chart_location_realized_portfolio_value", "Chart location realized portfolio value"),
                            "plot_trade_gains": {
                                type: "boolean",
                                title: "Plot realized gains per trade",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                            ...selectableChartlocation("chart_location_trade_gains", "Chart location realized gains per trade"),
                            "plot_funding_fees": {
                                type: "boolean",
                                title: "Plot funding fees",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                            ...selectableChartlocation("chart_location_funding_fees", "Chart location funding fees"),
                            "plot_best_case_growth": {
                                type: "boolean",
                                title: "Plot best case portfolio value",
                                format: "checkbox",
                                fieldType: "boolean",
                            },
                            ...selectableChartlocation("chart_location_best_case_growth", "Chart location best case portfolio value"),
                            "plot_win_rate": {
                                type: "boolean",
                                title: "Plot best case portfolio value",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                            ...selectableChartlocation("chart_location_win_rate", "Chart location win rate"),
                            "plot_wins_and_losses_count": {
                                type: "boolean",
                                title: "Plot wins and losses count",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                            ...selectableChartlocation("chart_location_wins_and_losses_count", "Chart location wins and losses count"),
                            "plot_withdrawals": {
                                type: "boolean",
                                title: "Plot withdrawals",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                            ...selectableChartlocation("chart_location_withdrawals", "Chart location withdrawals"),
                        }
                    },
                    live_table_settings: {
                        type: "object",
                        title: "Table Settings",
                        properties: {
                            "display_trades_and_positions": {
                                type: "boolean",
                                title: "Display trades and positions table",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                            "display_withdrawals_table": {
                                type: "boolean",
                                title: "Display withdrawals table",
                                format: "checkbox",
                                fieldType: "boolean"
                            },
                        }
                    },
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
                        default: DISPLAYED_ELEMENTS_KEYS,

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
                                minimum: 0,
                                default: 50000,
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
                                default: ["open", "high", "low", "close"],

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
                                },
                                default: true,
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
                        title: "Optimization campaign name",
                        default: "default_campaign"
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
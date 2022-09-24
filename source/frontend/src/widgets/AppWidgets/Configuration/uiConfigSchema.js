export const uiConfigSchema = {
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
                    enum: [
                        "use_current_profile",

                    ],
                    options: {
                        enum_titles: ["Currently traded asset(s)",]
                    }
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
                    enum: [
                        "use_current_profile",
                    ],
                    options: {
                        enum_titles: ["Currently traded asset(s)",]
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

import { t } from "i18next";

import { CURRENT_BOT_DATA } from "../../../constants/backendConstants";
import { UiConfigKeyType } from "../../../context/config/UiConfigProvider";
import { DataFilesType } from "../../../context/data/BotInfoProvider";

export function getUiConfigSchema(
  configKey: UiConfigKeyType,
  dataFiles: DataFilesType | undefined,
  currentSymbols: string[] | undefined,
  availableExchanges: string[] | undefined
) {
  const dataFilevalues = [CURRENT_BOT_DATA];
  const dataFilesTitles = [
    `Currently traded time frame(s) & asset(s) on selected exchange(s): ${currentSymbols}`,
  ];
  dataFiles?.forEach((dataFile) => {
    dataFilevalues.push(dataFile[0]);
    dataFilesTitles.push(
      `${dataFile[1].exchange} - ${dataFile[1].symbols} - ${dataFile[1].time_frames} from ${dataFile[1].start_date} to from ${dataFile[1].end_date}`
    );
  });

  const uiConfigSchema = _getUiConfigSchema(
    availableExchanges,
    dataFilevalues,
    dataFilesTitles
  );
  return uiConfigSchema.properties[configKey];
}

interface UiConfigSchemaType {
  type: string;
  title: string;
  properties: UiConfigSubSchemaType;
}
interface UiConfigSubSchemaType {
  [key: string]: {
    type: string;
    title: string;
    properties?: UiConfigSubSchemaType;
    format?: "checkbox" | "tabs" | "select2" | "date" | "number";
    fieldType?: "boolean";
    options?: {
      grid_columns?: 12 | 6;
      enum_titles?: string[];
      select2?: {
        tags: true;
      };
    };
    items?: {
      type: "string";
      enum: string[];
      options: {
        enum_titles: string[];
      };
    };
    description?: string;
    propertyOrder?: number;
    enum?: string[];
    uniqueItems?: boolean;
    minItems?: number;
    minimum?: number;
    default?: string | number | boolean | string[] | undefined;
    patternProperties?: {
      [pattern: string]: {
        type: "boolean";
        format: "checkbox";
        fieldType: "boolean";
      };
    };
  };
}

function selectableChartlocation(
  name: string,
  title: string,
  order: number
): UiConfigSubSchemaType {
  return {
    [name]: {
      type: "string",
      title,
      enum: ["main-chart", "sub-chart", "backtesting-run-overview"],
      options: {
        enum_titles: ["Main Chart", "Main Sub-Chart", "Secondary-Chart"],
        grid_columns: 6,
      },
      default: "sub-chart",
      propertyOrder: order,
    },
  };
}

function _getUiConfigSchema(
  availableExchanges: string[] | undefined,
  dataFilevalues: string[],
  dataFilesTitles: string[]
): UiConfigSchemaType {
  return {
    type: "object",
    title: t('ui-config'),
    properties: {
      backtesting_analysis_settings: {
        type: "object",
        title: "Trade Analysis Settings",
        properties: {
          backtesting_plot_settings: {
            type: "object",
            title: t('plot-settings'),
            properties: {
              plot_unrealized_portfolio: {
                type: "boolean",
                title: t('plot-unrealized-portfolio-value'),
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 1,
              },
              ...selectableChartlocation(
                "chart_location_unrealized_portfolio_value",
                t('chart-location-unrealized-portfolio-value'),
                2
              ),
              plot_unrealized_portfolio_value_for_each_asset: {
                type: "boolean",
                title: t('plot-unrealized-portfolio-value-for-each-asset'),
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 3,
              },
              ...selectableChartlocation(
                "chart_location_unrealized_portfolio_value_for_each_asset",
                t('chart-location-unrealized-portfolio-value-0'),
                4
              ),
              plot_unrealized_portfolio_amount_in_btc: {
                type: "boolean",
                title: t('plot-unrealized-portfolio-value-in-btc'),
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 5,
              },
              ...selectableChartlocation(
                "chart_location_unrealized_portfolio_amount_in_btc",
                t('chart-location-unrealized-portfolio-value-1'),
                6
              ),
              plot_unrealized_portfolio_amount_for_each_asset: {
                type: "boolean",
                title: t('plot-unrealized-portfolio-amount-for-each-asset'),
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 7,
              },
              ...selectableChartlocation(
                "chart_location_unrealized_portfolio_amount_for_each_asset",
                t('chart-location-unrealized-portfolio-value-2'),
                8
              ),
              plot_realized_portfolio: {
                type: "boolean",
                title: "Plot realized portfolio value",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 9,
              },
              ...selectableChartlocation(
                "chart_location_realized_portfolio_value",
                "Chart location realized portfolio value",
                10
              ),
              plot_trade_gains: {
                type: "boolean",
                title: "Plot realized gains per trade",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 11,
              },
              ...selectableChartlocation(
                "chart_location_trade_gains",
                "Chart location realized gains per trade",
                12
              ),
              plot_funding_fees: {
                type: "boolean",
                title: "Plot funding fees",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 13,
              },
              ...selectableChartlocation(
                "chart_location_funding_fees",
                "Chart location funding fees",
                14
              ),
              plot_best_case_growth: {
                type: "boolean",
                title: "Plot best case portfolio value",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 15,
              },
              ...selectableChartlocation(
                "chart_location_best_case_growth",
                "Chart location best case portfolio value",
                16
              ),
              plot_win_rate: {
                type: "boolean",
                title: "Plot best case portfolio value",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 17,
              },
              ...selectableChartlocation(
                "chart_location_win_rate",
                "Chart location win rate",
                18
              ),
              plot_wins_and_losses_count: {
                type: "boolean",
                title: "Plot wins and losses count",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 19,
              },
              ...selectableChartlocation(
                "chart_location_wins_and_losses_count",
                "Chart location wins and losses count",
                20
              ),
              plot_withdrawals: {
                type: "boolean",
                title: "Plot withdrawals",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 21,
              },
              ...selectableChartlocation(
                "chart_location_withdrawals",
                "Chart location withdrawals",
                22
              ),
            },
          },
          backtesting_table_settings: {
            type: "object",
            title: "Table Settings",
            properties: {
              display_trades_and_positions: {
                type: "boolean",
                title: "Display Trades and Positions Table",
                format: "checkbox",
                fieldType: "boolean",
              },
              display_withdrawals_table: {
                type: "boolean",
                title: "Display withdrawals table",
                format: "checkbox",
                fieldType: "boolean",
              },
            },
          },
          backtesting_analysis_report_settings: {
            type: "object",
            title: "Analysis Report Settings",
            properties: {
              display_analysis_report: {
                type: "boolean",
                format: "checkbox",
                title: "Display Analysis Report",
                fieldType: "boolean",
              },
              display_analysis_report_general: {
                type: "boolean",
                format: "checkbox",
                title: "Display Analysis Report General",
                fieldType: "boolean",
              },
              display_analysis_report_performances: {
                type: "boolean",
                format: "checkbox",
                title: "Display Analysis Report Performances",
                fieldType: "boolean",
              },
              display_analysis_report_details: {
                type: "boolean",
                format: "checkbox",
                title: "Display Analysis Report Details",
                fieldType: "boolean",
              },
              display_analysis_report_strategy_settings: {
                type: "boolean",
                format: "checkbox",
                title: "Display Analysis Report Strategy Settings",
                fieldType: "boolean",
              },
            },
          },
        },
      },
      live_analysis_settings: {
        type: "object",
        title: "Trade Analysis Settings",
        properties: {
          live_plot_settings: {
            type: "object",
            title: "Plot Settings",
            properties: {
              plot_unrealized_portfolio: {
                type: "boolean",
                title: "Plot unrealized portfolio value",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 1,
              },
              ...selectableChartlocation(
                "chart_location_unrealized_portfolio_value",
                "Chart location unrealized portfolio value",
                2
              ),
              plot_unrealized_portfolio_value_for_each_asset: {
                type: "boolean",
                title: "Plot unrealized portfolio value for each asset",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 3,
              },
              ...selectableChartlocation(
                "chart_location_unrealized_portfolio_value_for_each_asset",
                "Chart location unrealized portfolio value",
                4
              ),
              plot_unrealized_portfolio_amount_in_btc: {
                type: "boolean",
                title: "Plot unrealized portfolio value in BTC",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 5,
              },
              ...selectableChartlocation(
                "chart_location_unrealized_portfolio_amount_in_btc",
                "Chart location unrealized portfolio value",
                6
              ),
              plot_unrealized_portfolio_amount_for_each_asset: {
                type: "boolean",
                title: "Plot unrealized portfolio amount for each asset",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 7,
              },
              ...selectableChartlocation(
                "chart_location_unrealized_portfolio_amount_for_each_asset",
                "Chart location unrealized portfolio value",
                8
              ),
              plot_realized_portfolio: {
                type: "boolean",
                title: "Plot realized portfolio value",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 9,
              },
              ...selectableChartlocation(
                "chart_location_realized_portfolio_value",
                "Chart location realized portfolio value",
                10
              ),
              plot_trade_gains: {
                type: "boolean",
                title: "Plot realized gains per trade",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 11,
              },
              ...selectableChartlocation(
                "chart_location_trade_gains",
                "Chart location realized gains per trade",
                12
              ),
              plot_funding_fees: {
                type: "boolean",
                title: "Plot funding fees",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 13,
              },
              ...selectableChartlocation(
                "chart_location_funding_fees",
                "Chart location funding fees",
                14
              ),
              plot_best_case_growth: {
                type: "boolean",
                title: "Plot best case portfolio value",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 15,
              },
              ...selectableChartlocation(
                "chart_location_best_case_growth",
                "Chart location best case portfolio value",
                16
              ),
              plot_win_rate: {
                type: "boolean",
                title: "Plot best case portfolio value",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 17,
              },
              ...selectableChartlocation(
                "chart_location_win_rate",
                "Chart location win rate",
                18
              ),
              plot_wins_and_losses_count: {
                type: "boolean",
                title: "Plot wins and losses count",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 19,
              },
              ...selectableChartlocation(
                "chart_location_wins_and_losses_count",
                "Chart location wins and losses count",
                20
              ),
              plot_withdrawals: {
                type: "boolean",
                title: "Plot withdrawals",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 6,
                },
                propertyOrder: 21,
              },
              ...selectableChartlocation(
                "chart_location_withdrawals",
                "Chart location withdrawals",
                22
              ),
            },
          },
          live_table_settings: {
            type: "object",
            title: "Table Settings",
            properties: {
              display_trades_and_positions: {
                type: "boolean",
                title: "Display trades and positions table",
                format: "checkbox",
                fieldType: "boolean",
              },
              display_withdrawals_table: {
                type: "boolean",
                title: "Display withdrawals table",
                format: "checkbox",
                fieldType: "boolean",
              },
            },
          },
        },
      },
      backtesting_run_settings: {
        type: "object",
        title: "Backtesting Run Settings",
        properties: {
          data_sources: {
            type: "array",
            uniqueItems: true,
            format: "select2",
            propertyOrder: 1,
            minItems: 1,
            options: {
              grid_columns: 12,
              select2: {
                tags: true,
              },
            },
            default: dataFilevalues[0] ? [dataFilevalues[0]] : undefined,
            title: "Backtest data file(s)",
            description:
              "Currently traded time frame(s) & asset(s) cant be combined with other data files! When using data files, make sure to select all pairs and timeframes that the strategy requires!",
            items: {
              type: "string",
              enum: dataFilevalues,
              options: {
                enum_titles: dataFilesTitles,
              },
            },
          },
          exchange_names: {
            type: "array",
            uniqueItems: true,
            format: "select2",
            propertyOrder: 2,
            minItems: 1,
            options: {
              grid_columns: 12,
              select2: {
                tags: true,
              },
            },
            description:
              'Make sure to select "Currently traded time frame(s) & asset(s)" or the data files for each selected exchange',

            default: availableExchanges,
            title: "Exchanges to backtest on",
            items: {
              type: "string",
              enum: availableExchanges || [],
              options: {
                enum_titles: availableExchanges || [],
              },
            },
          },
          exchange_type: {
            type: "string",
            title: "Exchange type",
            propertyOrder: 3,
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
              ],
            },
          },
          start_timestamp: {
            type: "integer",
            format: "date",
            propertyOrder: 4,
            title: "Start Date",
          },
          end_timestamp: {
            type: "integer",
            format: "date",
            propertyOrder: 5,
            title: "End Date",
          },
        },
      },
      display_settings: {
        type: "object",
        title: "Display Settings",
        options: {
          grid_columns: 12,
        },
        properties: {
          // displayed_elements: {
          //     "type": "array",
          //     "uniqueItems": true,
          //     "format": "select2",
          //     "options": {
          //         "grid_columns": 12,
          //         "select2": {
          //             "tags": true
          //         },
          //     },
          //     title: "Elements to render",
          //     default: DISPLAYED_ELEMENTS_KEYS,

          //     items: {
          //         enum: DISPLAYED_ELEMENTS_KEYS,
          //         type: "string",
          //         "options": { enum_titles: DISPLAYED_ELEMENTS_TITLES },
          //     },
          // },
          graphs: {
            type: "object",
            title: "Graphs",
            properties: {
              max_candles_before_line_display: {
                title: "Candles to display before line(s) ",
                options: {
                  grid_columns: 12,
                },
                type: "number",
                format: "number",
                minimum: 0,
                default: 10000,
              },
              max_candles_line_sources: {
                type: "array",
                uniqueItems: true,
                format: "select2",
                options: {
                  grid_columns: 12,
                  select2: {
                    tags: true,
                  },
                },
                title: "Line(s) sources",
                default: ["high", "low"],

                items: {
                  enum: ["open", "high", "low", "close"],
                  type: "string",
                  options: {
                    enum_titles: ["Open", "High", "Low", "Close"],
                  },
                },
              },
              display_unified_tooltip: {
                title: "Display tooltips: Display tooltips on graphs (slower)",
                type: "boolean",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 12,
                },
                default: true,
              },
              display_use_log_scale: {
                title:
                  "Use log scale: Displays all graphs with log scale except data with negative values",
                type: "boolean",
                format: "checkbox",
                fieldType: "boolean",
                options: {
                  grid_columns: 12,
                },
              },
            },
          },
        },
      },
      optimizer_run_settings: {
        type: "object",
        title: "Optimizer Run Settings",
        properties: {
          idle_cores: {
            title: "Idle CPU cores :",
            type: "number",
            format: "number",
            minimum: 0,
            propertyOrder: 1,
            default: 1,
          },
          optimizer_id: {
            title: "Optimizer id :",
            type: "number",
            format: "number",
            minimum: 1,
            propertyOrder: 2,
            default: 1,
          },
          queue_size: {
            title: "Random runs queued:",
            type: "number",
            format: "number",
            propertyOrder: 3,
            minimum: 1,
            default: 1000,
          },
          notify_when_complete: {
            title: "Notify when completed",
            type: "boolean",
            format: "checkbox",
            propertyOrder: 4,
            fieldType: "boolean",
            default: true,
          },
          exchange_type: {
            type: "string",
            title: "Exchange type",
            propertyOrder: 5,
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
              ],
            },
          },
          data_files: {
            type: "array",
            uniqueItems: true,
            format: "select2",
            propertyOrder: 6,
            minItems: 1,
            options: {
              grid_columns: 12,
              select2: {
                tags: true,
              },
            },
            default: dataFilevalues[0] ? [dataFilevalues[0]] : undefined,
            title: "Backtest data file(s)",
            description:
              "Currently traded time frame(s) & asset(s) cant be combined with other data files! When using data files, make sure to select all pairs and timeframes that the strategy requires!",
            items: {
              type: "string",
              enum: dataFilevalues,
              options: {
                enum_titles: dataFilesTitles,
              },
            },
          },
          exchange_names: {
            type: "array",
            uniqueItems: true,
            format: "select2",
            propertyOrder: 7,
            minItems: 1,
            options: {
              grid_columns: 12,
              select2: {
                tags: true,
              },
            },
            description:
              'Make sure to select "Currently traded time frame(s) & asset(s)" or the data files for each selected exchange',

            default: availableExchanges,
            title: "Exchanges to backtest on",
            items: {
              type: "string",
              enum: availableExchanges || [],
              options: {
                enum_titles: availableExchanges || [],
              },
            },
          },
          start_timestamp: {
            type: "integer",
            format: "date",
            title: "Start Date",
            propertyOrder: 10,
          },
          end_timestamp: {
            type: "integer",
            format: "date",
            title: "End Date",
            propertyOrder: 11,
          },
        },
      },
      optimizer_inputs: {
        type: "object",
        title: "Optimizer Setup",
        properties: {
          user_inputs: {
            type: "object",
            title: "User Inputs",
            format: "tabs",
            properties: {},
          },
          filters_settings: {
            type: "array",
            title: "Optimizer Filter",
          },
        },
      },
      optimization_campaign: {
        type: "object",
        title: "Campaign Name",
        properties: {
          name: {
            type: "string",
            title: "Optimization campaign name",
            default: "default_campaign",
          },
        },
      },
      optimizer_campaigns_to_load: {
        type: "object",
        title: "Campaigns to load",
        patternProperties: {
          "^.*$": {
            type: "boolean",
            format: "checkbox",
            fieldType: "boolean",
          },
        },
      },
    },
  };
}

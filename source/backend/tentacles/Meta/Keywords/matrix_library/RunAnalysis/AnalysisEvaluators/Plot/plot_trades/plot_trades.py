import octobot_commons.enums as commons_enums

import tentacles.Meta.Keywords.matrix_library.RunAnalysis.AnalysisKeywords.common_user_inputs as common_user_inputs
import tentacles.Meta.Keywords.matrix_library.RunAnalysis.AnalysisKeywords.plot_keywords as plot_keywords
import tentacles.Meta.Keywords.matrix_library.RunAnalysis.BaseDataProvider.default_base_data_provider.base_data_provider as base_data_provider
import tentacles.Meta.Keywords.matrix_library.RunAnalysis.RunAnalysisFactory.abstract_analysis_evaluator as abstract_analysis_evaluator


class PlotTradesOptions:
    CURRENT_SYMBOL = "Current Symbol"
    ALL_SYMBOLS = "All Symbols"


class PlotTrades(abstract_analysis_evaluator.AnalysisEvaluator):
    PRIORITY: float = 900

    PLOT_TRADES_NAME = "_trades"
    PLOT_TRADES_TILE = "Trades"
    ENABLE_SYMBOLS_SUFFIX = "_enabled_pairs"

    @classmethod
    def init_user_inputs(
        cls, analysis_mode_plugin, inputs: dict, parent_input_name: str
    ) -> None:
        settings_group_name = parent_input_name + cls.PLOT_TRADES_NAME
        common_user_inputs.init_data_source_settings(
            data_source_input_name=settings_group_name,
            data_source_input_title=cls.PLOT_TRADES_TILE,
            analysis_mode_plugin=analysis_mode_plugin,
            inputs=inputs,
            parent_input_name=parent_input_name,
            default_chart_location="main-chart",
            default_data_source_enabled=True,
        )
        analysis_mode_plugin.CLASS_UI.user_input(
            settings_group_name + cls.ENABLE_SYMBOLS_SUFFIX,
            commons_enums.UserInputTypes.OPTIONS,
            PlotTradesOptions.CURRENT_SYMBOL,
            inputs,
            title="Plot trades for",
            editor_options={
                commons_enums.UserInputEditorOptionsTypes.GRID_COLUMNS.value: 12
            },
            options=[PlotTradesOptions.CURRENT_SYMBOL, PlotTradesOptions.ALL_SYMBOLS],
            parent_input_name=settings_group_name,
        )

    async def evaluate(
        self,
        run_data: base_data_provider.RunAnalysisBaseDataGenerator,
        analysis_type: str,
    ):
        plotted_element = common_user_inputs.get_plotted_element_based_on_settings(
            run_data,
            analysis_type=analysis_type,
            data_source_input_name=self.PLOT_TRADES_NAME,
            default_chart_location="main-chart",
        )
        if plotted_element is not None:
            symbols_settings = common_user_inputs.get_evaluator_settings(
                run_data,
                parent_input_name=self.PLOT_TRADES_NAME,
                analysis_type=analysis_type,
            ).get(
                analysis_type + self.PLOT_TRADES_NAME + self.ENABLE_SYMBOLS_SUFFIX,
                PlotTradesOptions.CURRENT_SYMBOL,
            )
            symbols = (
                None
                if symbols_settings == PlotTradesOptions.ALL_SYMBOLS
                else [run_data.ctx.symbol]
            )
            trades = await run_data.get_trades(symbols)
            plot_keywords.plot_from_standard_data(
                trades,
                plotted_element,
                title=f"Trades for {'all symbols' if symbols_settings == PlotTradesOptions.ALL_SYMBOLS else run_data.ctx.symbol}",
            )

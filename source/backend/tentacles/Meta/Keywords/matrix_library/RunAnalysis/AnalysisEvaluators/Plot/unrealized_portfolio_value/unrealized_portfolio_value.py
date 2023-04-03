import typing
import tentacles.Meta.Keywords.matrix_library.RunAnalysis.BaseDataProvider.default_base_data_provider.base_data_provider as base_data_provider
import tentacles.Meta.Keywords.matrix_library.RunAnalysis.RunAnalysisFactory.abstract_analysis_evaluator as abstract_analysis_evaluator
import tentacles.Meta.Keywords.matrix_library.RunAnalysis.AnalysisKeywords.common_user_inputs as common_user_inputs


class PlotUnrealizedPortfolioOptions:
    CURRENT_SYMBOL = "Current Symbol"
    ALL_SYMBOLS = "All Symbols"


class UnrealizedPortfolioValue(abstract_analysis_evaluator.AnalysisEvaluator):
    PRIORITY: float = 700

    PLOT_UNREALIZED_PORTFOLIO_VALUE_NAME: str = "plot_unrealized_portfolio_value"
    PLOT_UNREALIZED_PORTFOLIO_VALUE_TITLE: str = "Plot unrealized portfolio value"

    @classmethod
    def init_user_inputs(
        cls, analysis_mode_plugin, inputs: dict, parent_input_name: str
    ) -> None:
        common_user_inputs.init_data_source_settings(
            data_source_input_name=cls.PLOT_UNREALIZED_PORTFOLIO_VALUE_NAME,
            data_source_input_title=cls.PLOT_UNREALIZED_PORTFOLIO_VALUE_TITLE,
            analysis_mode_plugin=analysis_mode_plugin,
            inputs=inputs,
            parent_input_name=parent_input_name,
            default_chart_location="sub-chart",
            default_data_source_enabled=True,
        )

    async def evaluate(
        self,
        run_data: base_data_provider.RunAnalysisBaseDataGenerator,
        analysis_type: str,
    ):
        plotted_element = common_user_inputs.get_plotted_element_based_on_settings(
            run_data,
            analysis_type=analysis_type,
            data_source_input_name=self.PLOT_UNREALIZED_PORTFOLIO_VALUE_NAME,
            default_chart_location="sub-chart",
        )
        x = []
        y: typing.Dict[list] = {}
        if plotted_element is not None:
            historical_portfolio_value = await run_data.get_historical_portfolio_value()
            for row in historical_portfolio_value:
                x.append(row["t"]*1000)
                for asset, value in row["v"].items():
                    if y.get(asset) is None:
                        y[asset] = []
                    y[asset].append(value)
        for asset, values in y.items():
            plotted_element.plot(
            x=x,
            y=values,
            title=f"Historical portfolio value in {asset}",
            x_type="date",
            y_type="log",
            line_shape="hv"
        )


# async def plot_unrealized_portfolio_value(
#     run_data: base_data_provider.RunAnalysisBaseDataGenerator,
#     plotted_element,
#     own_yaxis: bool = False,
#     all_coins_in_ref_market: bool = False,
#     all_coins_amounts: bool = False,
#     total_amount_in_btc: bool = False,
# ):
#     await run_data.generate_historical_portfolio_value(
#         total_amount_in_btc=total_amount_in_btc
#     )
#     # TODO remove checks as it should work or break
#     if run_data.historical_portfolio_times:
#         if all_coins_in_ref_market and run_data.historical_portfolio_values_by_coin:
#             for (
#                 coin,
#                 portfolio_values,
#             ) in run_data.historical_portfolio_values_by_coin.items():
#                 if coin in ("total", "total_btc"):
#                     continue
#                 plotted_element.plot(
#                     mode="scatter",
#                     x=run_data.historical_portfolio_times,
#                     y=portfolio_values,
#                     title=f"Unrealized {coin} portfolio value in {run_data.ref_market}",
#                     own_yaxis=own_yaxis,
#                 )
#         if all_coins_amounts and run_data.historical_portfolio_amounts_by_coin:
#             for (
#                 coin,
#                 portfolio_values,
#             ) in run_data.historical_portfolio_amounts_by_coin.items():
#                 plotted_element.plot(
#                     mode="scatter",
#                     x=run_data.historical_portfolio_times,
#                     y=portfolio_values,
#                     title=f"Unrealized {coin} portfolio value in {run_data.ref_market}",
#                     own_yaxis=own_yaxis,
#                 )
#         if (
#             run_data.historical_portfolio_values_by_coin
#             and "total" in run_data.historical_portfolio_values_by_coin
#         ):
#             plotted_element.plot(
#                 mode="scatter",
#                 x=run_data.historical_portfolio_times,
#                 y=run_data.historical_portfolio_values_by_coin["total"],
#                 title=f"Unrealized total portfolio value in {run_data.ref_market}",
#                 own_yaxis=own_yaxis,
#             )
#         if (
#             run_data.historical_portfolio_values_by_coin
#             and "total_btc" in run_data.historical_portfolio_values_by_coin
#         ):
#             plotted_element.plot(
#                 mode="scatter",
#                 x=run_data.historical_portfolio_times,
#                 y=run_data.historical_portfolio_values_by_coin["total_btc"],
#                 title="Unrealized total portfolio value in BTC",
#                 own_yaxis=own_yaxis,
#             )

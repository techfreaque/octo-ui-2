import octobot_commons.enums as commons_enums
import octobot_trading.enums as trading_enums
from tentacles.Meta.Keywords.RunAnalysis.BaseDataProvider.default_base_data_provider import (
    base_data_provider,
)


class FutureRunAnalysisBaseDataGenerator(
    base_data_provider.RunAnalysisBaseDataGenerator
):
    pass
    # async def generate_transactions(self) -> None:
    #     # TODO generate portfolio balance histories
    #     self.trading_transactions_history = await self.load_transactions()

    # async def load_transactions(self, transaction_type=None, transaction_types=None):
    #     if transaction_type is not None:
    #         query = (
    #             await self.run_database.get_transactions_db(
    #                 account_type=self.account_type
    #             ).search()
    #         ).type == transaction_type
    #     elif transaction_types is not None:
    #         query = (
    #             await self.run_database.get_transactions_db(
    #                 account_type=self.account_type
    #             ).search()
    #         ).type.one_of(transaction_types)
    #     else:
    #         return await self.run_database.get_transactions_db(
    #             account_type=self.account_type
    #         ).all(commons_enums.DBTables.TRANSACTIONS.value)
    #     return await self.run_database.get_transactions_db(
    #         account_type=self.account_type
    #     ).select(commons_enums.DBTables.TRANSACTIONS.value, query)

    # async def load_grouped_funding_fees(self):
    #     if not self.funding_fees_history_by_pair:
    #         funding_fees_history = await self.load_transactions(
    #             transaction_type=trading_enums.TransactionType.FUNDING_FEE.value,
    #         )
    #         funding_fees_history = sorted(
    #             funding_fees_history,
    #             key=lambda f: f[commons_enums.PlotAttributes.X.value],
    #         )
    #         self.funding_fees_history_by_pair = {}
    #         for funding_fee in funding_fees_history:
    #             try:
    #                 self.funding_fees_history_by_pair[
    #                     funding_fee[commons_enums.PlotAttributes.SYMBOL.value]
    #                 ].append(funding_fee)
    #             except KeyError:
    #                 self.funding_fees_history_by_pair[
    #                     funding_fee[commons_enums.PlotAttributes.SYMBOL.value]
    #                 ] = [funding_fee]

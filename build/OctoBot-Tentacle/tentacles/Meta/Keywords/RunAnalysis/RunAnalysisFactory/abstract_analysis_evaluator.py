import tentacles.Meta.Keywords.RunAnalysis.BaseDataProvider.default_base_data_provider.base_data_provider as base_data_provider


class AnalysisEvaluator:
    # highest priority gets rendered first
    PRIORITY: float = 0

    @classmethod
    def init_user_inputs(
        cls, analysis_mode_plugin, inputs: dict, parent_input_name: str
    ) -> None:
        """
        define all settings for your AnalysisEvaluator
        """

    async def evaluate(
        self,
        run_data: base_data_provider.RunAnalysisBaseDataGenerator,
        analysis_type: str,
    ):
        """
        Do your analysis on the run data here
        """

import enum


class AnalysisModeSettingsTypes:
    LIVE_RUN_ANALYSIS_MODE_SETTINGS_NAME: str = "live"
    BACKTESTING_RUN_ANALYSIS_MODE_SETTINGS_NAME: str = "backtesting"


class AnalysisModePlotSettingsTypes:
    PLOTS_SETTINGS_NAME: str = "_plot"
    PLOTS_SETTINGS_TITLE: str = "Plots"
    TABLE_SETTINGS_NAME: str = "_table"
    TABLE_SETTINGS_TITLE: str = "Tables"
    DICTIONARY_SETTINGS_NAME: str = "_dictionary"
    DICTIONARY_SETTINGS_TITLE: str = "Other Displays"


class UserInputOtherSchemaValuesTypes(enum.Enum):
    DISPLAY_AS_TAB = "display_as_tab"  # used by octo ui2


class SymbolsOptions:
    CURRENT_SYMBOL = "Current Symbol"
    ALL_SYMBOLS = "All Symbols"


ENABLE_SYMBOLS_SUFFIX = "_enabled_symbols"

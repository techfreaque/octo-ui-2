import { useEffect } from "react";
import { useUiConfigContext } from "../../../context/UiConfigProvider";
import { useBacktestingRunDataContext, useFetchBacktestingRunData } from "../../../context/BacktestingRunDataProvider";
import { useBotDomainContext } from "../../../context/BotDomainProvider";
import RunDataTableW2UI from "../../../components/Tables/w2ui/RunDataTable";

export function BacktestingRunDataTable() {
    const runData = useBacktestingRunDataContext()
    const uiSettings = useUiConfigContext()
    const fetchBacktestingRunData = useFetchBacktestingRunData()
    const currentOptimizerCampaignName = uiSettings.optimization_campaign && uiSettings.optimization_campaign.name
    const botDomain = useBotDomainContext()

    useEffect(() => {
        fetchBacktestingRunData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [botDomain, uiSettings.optimizer_campaigns_to_load]);

    return <RunDataTableW2UI
        tableTitle="Select backtestings"
        tableId="backtesting-runs"
        runData={runData}
        currentCampaignName={currentOptimizerCampaignName}
        reloadData={fetchBacktestingRunData}
        noData={
            <>
                <h4>
                    No backtesting found, here you will be able to select backtestings using the ScriptedTradingMode for comparison.
                </h4>
                <h4>
                    <button
                        className="btn btn-success btn-outline-success waves-effect m-0"
                        id="backtester-start-button" onClick="openOptimizerCampaignsToLoadSettings()">
                        <i className="fa fa-cog me-2"></i> select optimization campaigns to load
                    </button>
                    <button className="btn btn-success btn-outline-success waves-effect m-0" id="backtester-start-button"
                        onClick={fetchBacktestingRunData}>
                        <i className="fas fa-redo me-2"></i> Reload Backtestings
                    </button>
                </h4>
            </>
        }
    />
}


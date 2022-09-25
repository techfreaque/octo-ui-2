import { useEffect } from "react";
import RunDataTableW2UI from "../../../components/Tables/w2ui/RunDataTable";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faRedo } from "@fortawesome/free-solid-svg-icons";
import { useBacktestingRunDataContext, useFetchBacktestingRunData } from "../../../context/data/BacktestingRunDataProvider";
import { useUiConfigContext } from "../../../context/config/UiConfigProvider";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";

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
                    <Button>
                        <FontAwesomeIcon icon={faCog} style={{ marginRight: "5px" }} />
                        select optimization campaigns to load
                    </Button>
                    <Button
                        onClick={fetchBacktestingRunData}>
                        <FontAwesomeIcon icon={faRedo} style={{ marginRight: "5px" }} />
                        Reload Backtestings
                    </Button>
                </h4>
            </>
        }
    />
}


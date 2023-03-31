import {useEffect, useMemo} from "react";
import RunDataTableW2UI from "../../../components/Tables/w2ui/RunDataTable";
import {Button} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRedo} from "@fortawesome/free-solid-svg-icons";
import {useBacktestingRunDataContext, useDeleteBacktestingRunData, useFetchBacktestingRunData} from "../../../context/data/BacktestingRunDataProvider";
import {useUiConfigContext} from "../../../context/config/UiConfigProvider";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {useHiddenBacktestingMetadataColumnsContext} from "../../../context/data/BotPlottedElementsProvider";
import {useSaveTentaclesConfig} from "../../../context/config/TentaclesConfigProvider";

export function BacktestingRunDataTable() {
    const runData = useBacktestingRunDataContext()
    const uiSettings = useUiConfigContext()
    const fetchBacktestingRunData = useFetchBacktestingRunData()
    const deleteBacktestingRunData = useDeleteBacktestingRunData()
    const currentOptimizerCampaignName = uiSettings.optimization_campaign?.name
    const botDomain = useBotDomainContext()
    const hiddenBacktestingMetadataColumns = useHiddenBacktestingMetadataColumnsContext()
    const saveTentaclesConfig = useSaveTentaclesConfig()

    function restoreSettings(settings) {
        saveTentaclesConfig(settings, undefined, true, true)
    }

    useEffect(() => {
        if (currentOptimizerCampaignName) 
            fetchBacktestingRunData();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [botDomain, currentOptimizerCampaignName]);
    return useMemo(() => (<RunDataTableW2UI
            tableTitle="Select backtestings"
            tableId="backtesting-runs"
            runData={runData}
            currentCampaignName={currentOptimizerCampaignName}
            reloadData={fetchBacktestingRunData}
            deleteRuns={deleteBacktestingRunData}
            hiddenMetadataColumns={hiddenBacktestingMetadataColumns}
            restoreSettings={restoreSettings}
            noData={<NoBacktestingData fetchBacktestingRunData={fetchBacktestingRunData}/>}
        />
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [runData, currentOptimizerCampaignName])
}

function NoBacktestingData({fetchBacktestingRunData}) {
    return (<>
        <h4>
            No backtesting found, here you will be able to select backtestings using for comparison.
        </h4>
        <h4>
            <Button onClick={fetchBacktestingRunData}>
                <FontAwesomeIcon icon={faRedo}
                    style={
                        {marginRight: "5px"}
                    }/>
                Reload Backtestings
            </Button>
        </h4>
    </>)
}

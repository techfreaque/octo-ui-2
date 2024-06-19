import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Trans } from "react-i18next";

import { useUiConfigContext } from "../../../../context/config/UiConfigProvider";
import {
  useBacktestingRunDataContext,
  useFetchBacktestingRunData,
} from "../../../../context/data/BacktestingRunDataProvider";
import AntRunDataTable from "./AntRunDataTable";

export function BacktestingRunDataTable() {
  const runData = useBacktestingRunDataContext();
  const uiSettings = useUiConfigContext();
  const fetchBacktestingRunData = useFetchBacktestingRunData();
  const currentOptimizerCampaignName = uiSettings?.optimization_campaign?.name;
  useEffect(() => {
    if (currentOptimizerCampaignName) {
      fetchBacktestingRunData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOptimizerCampaignName]);
  return useMemo(
    () =>
      currentOptimizerCampaignName && runData?.data?.length ? (
        <AntRunDataTable
          runData={runData.data}
          currentCampaignName={currentOptimizerCampaignName}
          reloadData={fetchBacktestingRunData}
        />
      ) : (
        <NoBacktestingData fetchBacktestingRunData={fetchBacktestingRunData} />
      ),
    [currentOptimizerCampaignName, fetchBacktestingRunData, runData?.data],
  );
}

function NoBacktestingData({
  fetchBacktestingRunData,
}: {
  fetchBacktestingRunData: (onDone?: (() => void) | undefined) => void;
}) {
  const [isReloading, setIsReloading] = useState<boolean>(false);
  return (
    <>
      <h4>
        <Trans i18nKey="backtesting.runDataTable.no-backtests-finished-yet-message" />
      </h4>
      <h4>
        <Button
          disabled={isReloading}
          onClick={() => {
            setIsReloading(true);
            fetchBacktestingRunData(() => setIsReloading(false));
          }}
        >
          <FontAwesomeIcon icon={faRedo} style={{ marginRight: "5px" }} />
          <Trans i18nKey="backtesting.runDataTable.reload-backtestings" />
        </Button>
      </h4>
    </>
  );
}

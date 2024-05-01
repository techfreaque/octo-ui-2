import { Progress, Tooltip } from "antd";
import { useDataCollectingProgressContext } from "../../../context/actions/BotBacktestingProvider";
import { useMemo } from "react";

export default function DataCollectorProgress() {
  const collectorProgress = useDataCollectingProgressContext();
  const inProgress =
    collectorProgress?.status === "collecting" ||
    collectorProgress?.status === "starting";
  const progress = collectorProgress?.progress?.current_step_percent || 0;
  return useMemo(
    () =>
      inProgress && (
        <div
          style={{
            margin: "auto",
            marginLeft: "5px",
            marginRight: "10px",
          }}
        >
          <Tooltip
            title={`Data collector is ${
              Math.round(progress * 10) / 10
            }% completed`}
          >
            <Progress type="circle" percent={Math.round(progress)} size={25} />
          </Tooltip>
        </div>
      ),
    [inProgress, progress]
  );
}

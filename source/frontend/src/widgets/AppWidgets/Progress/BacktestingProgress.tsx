import { Progress, Tooltip } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useBacktestingProgressContext } from "../../../context/actions/BotBacktestingProvider";

export default function BacktestingProgress() {
  const backtestingProgress = useBacktestingProgressContext();
  const inProgress =
    backtestingProgress.status === "computing" ||
    backtestingProgress.status === "starting";
  const progress = backtestingProgress?.progress || 0;
  const { t } = useTranslation();
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
            title={t("progress.backtestingProgressTooltip", {
              progressPercent: Math.round(progress * 10) / 10,
            })}
          >
            <div>
              <Progress
                type="circle"
                percent={Math.round(progress)}
                size={25}
              />
            </div>
          </Tooltip>
        </div>
      ),
    [inProgress, progress, t]
  );
}

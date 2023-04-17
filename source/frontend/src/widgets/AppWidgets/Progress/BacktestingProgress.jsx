import {Progress, Tooltip} from "antd";
import {useBacktestingProgressContext} from "../../../context/actions/BotBacktestingProvider";
import {useMemo} from "react";

export default function BacktestingProgress() {
    const backtestingProgress = useBacktestingProgressContext()
    const inProgress = backtestingProgress.status === "computing" || backtestingProgress.status === "starting"
    const progress = backtestingProgress?.progress || 0
    return useMemo(() => inProgress && (<div style={
        {
            margin: "auto",
            marginLeft: "5px",
            marginRight: "10px"
        }
    }>
        <Tooltip title={
            `Backtest is ${Math.round(progress * 10) / 10}% completed`
        }>
            <Progress type="circle"
                percent={Math.round(progress)}
                size={25}/>
        </Tooltip>
    </div>), [inProgress, progress])


}

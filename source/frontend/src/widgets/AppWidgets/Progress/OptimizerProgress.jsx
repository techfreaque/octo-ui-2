import {Progress, Tooltip} from "antd";
import {useMemo} from "react";
import { useOptimizerrogressContext } from "../../../context/actions/BotOptimizerProvider";

export default function OptimizerProgress() {
    const backtestingProgress = useOptimizerrogressContext()
    const inProgress = backtestingProgress.status === "computing" || backtestingProgress.status === "starting"
    // const progress = backtestingProgress ?. f
    // const progress = backtestingProgress ?. progress || 0
    const overallProgress = backtestingProgress.status === "starting" ? 0 : (backtestingProgress?.overall_progress || 0)
    return useMemo(() => {
        const remainingTime = backtestingProgress?.remaining_time?  `Approximate completion date ${new Date(backtestingProgress?.remaining_time*1000 +Date.now())}` : "Remaining time computing"
        return inProgress && (<div style={
        {
            margin: "auto",
            marginLeft: "5px",
            marginRight: "10px"
        }
    }>
        <Tooltip title={<>
            <div>

            {`Optimizer is ${Math.round(overallProgress * 10) / 10}% completed.`}
        </div>
            <div>
            {`${remainingTime}`}
        </div>
        </>
        }>
            <Progress type="circle"
                percent={Math.round(overallProgress)}
                size={25}/>
        </Tooltip>
    </div>)}, [backtestingProgress?.remaining_time, inProgress, overallProgress])


}

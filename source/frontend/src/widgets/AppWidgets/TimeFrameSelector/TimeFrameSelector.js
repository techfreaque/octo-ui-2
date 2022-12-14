import {
  FormControlLabel,
  Switch,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useSaveTentaclesConfig } from "../../../api/configs";
import TabsWithSelector from "../../../components/Tabs/TabsWithSelector";
import { useUpdateVisibleTimeFramesContext, useVisibleTimeFramesContext } from "../../../context/config/VisibleTimeFrameProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";

export default function TimeFrameSelector() {
  const botInfo = useBotInfoContext();
  const visibleTimeframes = useVisibleTimeFramesContext();
  const setVisibleTimeframes = useUpdateVisibleTimeFramesContext();
  const saveTentaclesConfig = useSaveTentaclesConfig()
  const [enabledTimeFrame, setEnabledTimeFrame] = useState(botInfo?.traded_time_frames || [])

  const handleChange = (event, newTimeframe) => {
    setVisibleTimeframes(newTimeframe);
  };
  function handleTimeFrameChange(event) {
    const timeFrame = event.target.value
    const newTimeframes = enabledTimeFrame.includes(timeFrame)
      ? enabledTimeFrame.filter(foundTimeframe => foundTimeframe !== timeFrame)
      : [...enabledTimeFrame, timeFrame]
    setEnabledTimeFrame(newTimeframes)
  }

  function saveTimeFrameSettings() {
    saveTentaclesConfig({ [botInfo.strategy_name]: { required_time_frames: enabledTimeFrame } })
  }
  if (botInfo?.strategy_name && botInfo.time_frames) {
    return (
      <TabsWithSelector
        currentItem={visibleTimeframes}
        items={botInfo.traded_time_frames}
        handleChange={handleChange}
        onClose={saveTimeFrameSettings}
      >
        {Object.keys(botInfo.time_frames).map((time_frame) => {
          const isActive = enabledTimeFrame.includes(time_frame);
          return (
            <MenuItem key={time_frame} selected={isActive}>
              <FormControlLabel
                value={time_frame}
                control={
                  <Switch
                    checked={isActive}
                    onChange={handleTimeFrameChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={time_frame}
                labelPlacement="start"
              />
            </MenuItem>
          );
        })}
      </TabsWithSelector>
    );
  } else {
    return <></>;
  }
}

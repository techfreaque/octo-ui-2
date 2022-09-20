import { useBotInfoContext } from "../../../context/BotInfoProvider";
import {
  FormControlLabel,
  Switch,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {
  useUpdateVisibleTimeFramesContext,
  useVisibleTimeFramesContext,
} from "../../../context/VisibleTimeFrameProvider";
import TabsWithSelector from "../../../components/Tabs/TabsWithSelector";

export default function TimeFrameSelector() {
  const botInfo = useBotInfoContext();
  const visibleTimeframes = useVisibleTimeFramesContext();
  const setVisibleTimeframes = useUpdateVisibleTimeFramesContext();

  const handleChange = (event, newTimeframe) => {
    setVisibleTimeframes(newTimeframe);
  };
  if (botInfo && botInfo.traded_time_frames[0]) {
    return (
      <TabsWithSelector
        currentItem={visibleTimeframes}
        items={botInfo.traded_time_frames}
        handleChange={handleChange}
      >
        {Object.keys(botInfo.time_frames).map((time_frame) => {
          const isActive = botInfo.traded_time_frames.includes(time_frame);
          return (
            <MenuItem key={time_frame} selected={isActive}>
              <FormControlLabel
                value={time_frame}
                control={
                  <Switch
                    checked={isActive}
                    //   onChange={handleChange}
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

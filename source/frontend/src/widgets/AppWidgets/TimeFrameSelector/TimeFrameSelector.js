import { useBotInfoContext } from "../../../context/BotInfoProvider";
import {
  FormControlLabel,
  Switch,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import "./timeFrameSelector.css";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import {
  useUpdateVisibleTimeFramesContext,
  useVisibleTimeFramesContext,
} from "../../../context/VisibleTimeFrameProvider";

export default function TimeFrameSelector() {
  const botInfo = useBotInfoContext();
  const visibleTimeframes = useVisibleTimeFramesContext();
  const setVisibleTimeframes = useUpdateVisibleTimeFramesContext();

  const handleChange = (event, newTimeframe) => {
    setVisibleTimeframes(newTimeframe);
  };
  if (botInfo && botInfo.traded_time_frames[0]) {
    return (
      <div style={{ display: "flex", maxWidth: "200px" }}>
        <Tabs
          value={false}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          <ToggleButtonGroup
            size="medium"
            value={visibleTimeframes}
            exclusive={true}
          >
            {botInfo.traded_time_frames.map((availableTimeframe) => {
              return (
                <ToggleButton
                  value={availableTimeframe}
                  key={availableTimeframe}
                  onClick={handleChange}
                >
                  {availableTimeframe}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </Tabs>
        <TimeFrameEnabler
          time_frames={botInfo.time_frames}
          traded_time_frames={botInfo.traded_time_frames}
        />
      </div>
    );
  } else {
    return <></>;
  }
}

const ITEM_HEIGHT = 80;

function TimeFrameEnabler({ time_frames, traded_time_frames }) {
  const [anchorEl, setAnchorEl] = useState();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div style={{ display: "flex" }}>
      <IconButton
        aria-label="more"
        id="timeframes-button"
        aria-controls={open ? "timeframes-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </IconButton>
      <Menu
        id="timeframes-menu"
        MenuListProps={{
          "aria-labelledby": "timeframes-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        {Object.keys(time_frames).map((time_frame) => {
          const isActive = traded_time_frames.includes(time_frame);
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
      </Menu>
    </div>
  );
}

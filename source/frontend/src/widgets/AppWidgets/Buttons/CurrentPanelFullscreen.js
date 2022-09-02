import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMaximize } from "@fortawesome/free-solid-svg-icons";
import React from "react";

export default function CurrentPanelFullscreen(props) {
  return (
    <Button
      onClick={() => props.currentPanel.SetHeight(0)}
      variant="outlined"
    //   color={
    //     props.botDataManager.colors.backgroundHover
    //       ? props.botDataManager.currentPanelState != 0
    //       : "warning"
    //   }
    >
      <FontAwesomeIcon icon={faWindowMaximize} />
    </Button>
  );
}

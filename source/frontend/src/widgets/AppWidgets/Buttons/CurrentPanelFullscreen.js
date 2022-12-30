import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMaximize } from "@fortawesome/free-solid-svg-icons";
import React, { useMemo } from "react";
import { useSetCurrentPanelPercent } from "../../LayoutWidgets/SplitMainContent";

export default function CurrentPanelFullscreen() {
  const setPanelPercent = useSetCurrentPanelPercent()
    return useMemo(() => {
  return (
    <Button onClick={() => setPanelPercent(0)} variant="outlined">
      <FontAwesomeIcon icon={faWindowMaximize} />
    </Button>
  );
    }, [setPanelPercent])
}

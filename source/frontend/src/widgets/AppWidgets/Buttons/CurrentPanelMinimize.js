import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMinimize } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import { useSetCurrentPanelPercent } from "../../../context/config/MainPanelContext";

export default function CurrentPanelMinimize() {
  const setPanelSize = useSetCurrentPanelPercent()
    return useMemo(() => {
  return (
    <Button onClick={()=>setPanelSize(100)} variant="outlined">
      <FontAwesomeIcon icon={faWindowMinimize} />
    </Button>
  );
    }, [setPanelSize])
}

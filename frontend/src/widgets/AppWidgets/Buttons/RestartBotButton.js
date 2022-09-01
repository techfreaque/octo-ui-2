import { useState } from "react";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { useBotDomainContext } from "../../../context/BotDomainProvider";

export default function RestartBotButton() {
  const [isLoading, setIsloading] = useState(false);
  const botDomain = useBotDomainContext();
  function handleRestart() {
    setIsloading(true);
    fetch(botDomain + "/api_backend/commands/restart").then((response) =>
      setIsloading(false)
    );
  }
  return (
    <Button onClick={handleRestart} variant="outlined" color="warning">
      <FontAwesomeIcon
        icon={faArrowRotateRight}
        className={isLoading ? "fa-spin" : ""}
      />
    </Button>
  );
}

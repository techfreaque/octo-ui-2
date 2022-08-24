import { useState } from "react"
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';


export default function RestartBotButton(props) {
    const [isLoading, setIsloading] = useState(false)
    function handleRestart(){
        setIsloading(true)
        fetch(props.botDataManager.botDomain+"/api_backend/commands/restart").then(response => setIsloading(false))
    }
    return (
        <Button onClick={handleRestart} variant="outlined" color="warning">
            <FontAwesomeIcon icon={faArrowRotateRight} className={isLoading ? "fa-spin" : ""}/>
        </Button>)
}
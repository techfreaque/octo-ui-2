import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMinimize } from '@fortawesome/free-solid-svg-icons';


export default function CurrentPanelMinimize(props){
    // currentPanelHeight

    return (
            <Button 
                onClick={props.botDataManager.currentPanelMinimize} 
                variant="outlined" 
                // color={props.botDataManager.colors.backgroundHover ? props.botDataManager.currentPanelState != 0 : "warning"}
                >
                <FontAwesomeIcon icon={faWindowMinimize} 
                // className={isLoading ? "fa-spin" : ""}
                />
            </Button>
    )
}
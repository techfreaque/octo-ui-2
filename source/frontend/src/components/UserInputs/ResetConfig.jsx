import {faXmark} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { Alert, Button } from "@mui/material"
import {useIsBotOnlineContext} from "../../context/data/IsBotOnlineProvider"

export default function ResetConfig({
    title,
    description,
    resetButtonText,
    isResetting,
    handleReset
}) {
    const isOnline = useIsBotOnlineContext()
    return (
        <div style={
            {
                marginTop: "20px",
                marginBottom: "20px"
            }
        }>
            <h3>
                <label>{title}</label>
            </h3>
            <Alert severity="warning"
                style={
                    {
                        maxWidth: "450px",
                        marginLeft: "30px"
                    }
            }>
                {description} </Alert>
            <Button disabled={
                    isResetting || ! isOnline
                }
                onClick={handleReset}
                variant="outlined"
                color="error"
                style={
                    {marginLeft: "30px"}
            }>
                <FontAwesomeIcon icon={faXmark}
                    style={
                        {marginRight: "5px"}
                    }/> {resetButtonText} </Button>
        </div>
    )
}

import {faCoins, faPause, faRobot} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Button, Modal} from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import {Box} from "@mui/system";
import {useMemo, useState} from "react";
import {realTradingSwitch} from "../../../../api/actions";
import {useBotConfigContext} from "../../../../context/config/BotConfigProvider";
import {useBotDomainContext} from "../../../../context/config/BotDomainProvider";
import {Tooltip} from "antd";
import {MuiIconButton} from "../../../../components/Buttons/IconButton";
import {FaIconByReactFunc} from "../../../../components/Icons/FontAwesome";
import {sizes} from "../../../../constants/frontendConstants";

export default function RealTradingSwitch() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const botDomain = useBotDomainContext()
    const botConfigs = useBotConfigContext()
    const isRealTrading = botConfigs ?. data ?. profile.trader.enabled
    const isSimulatedTrading = botConfigs ?. data ?. profile["trader-simulator"].enabled
    const title = isRealTrading ? "Real trading" : isSimulatedTrading ? "Simulated trading" : "Trading paused"
    const icon = isRealTrading ? faCoins : isSimulatedTrading ? faRobot : faPause;
    return useMemo(() => {
        return (<div style={
            {
                margin: "auto",
                height: "100%"
            }
        }>
            <Tooltip placement="top"
                title={title}
                arrow={false}>
                <div>
                    <MuiIconButton onClick={handleOpen}>
                        <FaIconByReactFunc icon={icon}
                            size={
                                sizes.medium
                            }/> {} </MuiIconButton>
                </div>
            </Tooltip>
            <Modal open={open}
                onClose={handleClose}
                aria-labelledby={"real-trading-switch-modal-title"}>
                <Box sx={style}>
                    <h3>Currently using: {title}</h3>
                    {
                    isRealTrading ? (<>
                        <p>By switching to simulated trading, OctoBot will only use its simulation mode on real market conditions.</p>
                        <p>It will no longer create trades with your exchange account, it will use a simulated portfolio managed by OctoBot.</p>
                    </>) : (<p>By switching to real trading, OctoBot will use your real funds</p>)
                }
                    <Alert style={
                            {marginBottom: "10px"}
                        }
                        severity="warning">Warning! The switch button will also restart OctoBot
                    </Alert>
                    <Button onClick={handleClose}
                        variant="outlined"
                        style={
                            {marginRight: "10px"}
                    }>Stay</Button>
                    <Button variant="contained"
                        onClick={
                            () => realTradingSwitch(botDomain, isRealTrading)
                    }>Switch to {
                        isRealTrading ? "Simulated trading" : "Real trading"
                    }</Button>
                </Box>
            </Modal>
        </div>);
    }, [botDomain, icon, isRealTrading, open, title])
}


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 550,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    color: "white",
    p: 4
};

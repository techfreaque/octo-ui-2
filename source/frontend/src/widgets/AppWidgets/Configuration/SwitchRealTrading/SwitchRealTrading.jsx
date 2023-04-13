import {Modal} from "@mui/material";
import {Box} from "@mui/system";
import {useMemo, useState} from "react";
import {realTradingSwitch} from "../../../../api/actions";
import {useBotConfigContext} from "../../../../context/config/BotConfigProvider";
import {useBotDomainContext} from "../../../../context/config/BotDomainProvider";
import {Space, Tooltip, Alert } from "antd";
import {MuiIconButton} from "../../../../components/Buttons/IconButton";
import {sizes} from "../../../../constants/frontendConstants";
import {DollarOutlined, PauseOutlined, RobotOutlined} from "@ant-design/icons";
import {AntIconByReactFunc} from "../../../../components/Icons/AntIcon";
import AntButton, { buttonTypes } from "../../../../components/Buttons/AntButton";


export default function RealTradingSwitch() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const botDomain = useBotDomainContext()
    const botConfigs = useBotConfigContext()
    const isRealTrading = botConfigs?.data?.profile.trader.enabled
    const isSimulatedTrading = botConfigs?.data?.profile["trader-simulator"].enabled
    const title = isRealTrading ? "Real trading" : isSimulatedTrading ? "Simulated trading" : "Trading paused"
    return useMemo(() => {
        const icon = isRealTrading ? (<AntIconByReactFunc AntReactIcon={DollarOutlined}
            size={
                sizes.medium
            }/>) : isSimulatedTrading ? (<AntIconByReactFunc AntReactIcon={RobotOutlined}
            size={
                sizes.medium
            }/>) : (<AntIconByReactFunc AntReactIcon={PauseOutlined}
            size={
                sizes.medium
            }/>);
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
                    <MuiIconButton onClick={handleOpen}> {icon}
                        {} </MuiIconButton>
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
                    <Alert banner
                    style={
                            {margin: "20px 0 30px 0"}
                        }
                        message='Warning! The switch button will also restart OctoBot'
                    />
                    <div style={{float: 'right'}}>
                        <Space>
                            <AntButton onClick={handleClose}
                                style={{marginRight: "5px"}}
                                buttonType= {buttonTypes.primary}
                                text='Cancel'/>
                            <AntButton 
                                onClick={() => realTradingSwitch(botDomain, isRealTrading)}
                                text={`Switch to ${isRealTrading ? "Simulated trading" : "Real trading"}`}
                                buttonType= {buttonTypes.primary}
                                buttonVariant="primary"/>
                        </Space>
                    </div>
                </Box>
            </Modal>
        </div>);
    }, [botDomain, isRealTrading, isSimulatedTrading, open, title])
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

import {faClose, faSave, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Box, Grid, Button} from "@mui/material";
import {AutoComplete, Modal, Radio, Button as AntButton} from "antd";
import FormItemLabel from "antd/es/form/FormItemLabel";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import {useEffect} from "react";
import {useState} from "react";
import {backendRoutes} from "../../../../constants/backendConstants";
import {useBotDomainContext} from "../../../../context/config/BotDomainProvider";
import {useBotInfoContext, useCurrentProfile} from "../../../../context/data/BotInfoProvider";
import Configuration, {availableConfigKeys} from "../../Configuration/Form";
import {Typography} from 'antd';
import ProfileAvatar from "../../Stats/ProfileAvatar";
import { useMemo } from "react";
const {Text} = Typography;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 800,
    width: "100%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    color: "white",
    p: 4,
    overflowY: "scroll",
    maxHeight: "100vh"
};

export default function ProfileModal() {
    const [open, setOpen] = useState(false);
    const [loading, setIsloading] = useState(false);
    const currentProfile = useCurrentProfile()
    const currentProfileTitle = currentProfile?.profile?.name
    const [newProfileSettings, setNewProfileSettings] = useState({...currentProfile})
    const hasChanged = JSON.stringify(currentProfile) !== JSON.stringify(newProfileSettings)
    
    function saveProfile() {setIsloading(true)}
    function saveProfileAndRestart() {setIsloading(true)}

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setNewProfileSettings({...currentProfile})
        setOpen(false)
    };
    return useMemo(() => (
        <div style={
            {
                margin: "auto",
                height: "100%"
            }
        }>
            <Button onClick={handleOpen}
                style={
                    {
                        fontSize: "9px",
                        height: "100%",
                        textTransform: "none",
                        maxWidth: "150px",
                        maxHeight: "40px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        // whiteSpace: "nowrap"
                        // display: "-webkit-box",
                        // webkitLineClamp: "1",
                        // webkitBoxOrient: "vertical"
                    }
            }>
                <ProfileAvatar/> {currentProfileTitle} </Button>
            <Modal open={open}
                onCancel={handleClose}
                title={
                    (
                        <Title level={2}>
                            <ProfileAvatar size="40px" marginRight="5px"/> {
                                currentProfileTitle
                        }</Title>
                    )
                }
                centered
                width="700px"
                footer={
                    [
                        (<AntButton key="back"
                            icon={<FontAwesomeIcon style={{ marginRight: "5px" }} icon={faXmark} />}
                            onClick={handleClose}>
                            Cancel
                        </AntButton>),
                        (<AntButton disabled={!hasChanged}
                            key="save"
                            type="primary"
                            danger
                            icon={<FontAwesomeIcon style={{ marginRight: "5px" }} icon={faSave} />}
                            loading={loading}
                            onClick={saveProfile}>
                            Save And Restart Now
                        </AntButton>),
                       ( <AntButton disabled={!hasChanged}
                            key="saveAndRestart"
                            type="primary"
                            icon={<FontAwesomeIcon style={{ marginRight: "5px" }} icon={faSave} />}
                            loading={loading}
                            onClick={saveProfileAndRestart}>
                            Save And Restart Later
                        </AntButton>),
                    ]
            }>
                <ProfileSettings newProfileSettings={newProfileSettings}
                    setNewProfileSettings={setNewProfileSettings}/>
            </Modal>
        </div>
    ), [currentProfileTitle,hasChanged, loading, newProfileSettings, open])
}

export function ProfileSettings({newProfileSettings, setNewProfileSettings}) {

    return <div>
        <ProfileDescription newProfileSettings={newProfileSettings}
            setNewProfileSettings={setNewProfileSettings}/>
        <ProfileTradingSettings newProfileSettings={newProfileSettings}
            setNewProfileSettings={setNewProfileSettings}/>
    </div>
}

export function ProfileDescription({ newProfileSettings, setNewProfileSettings }) { 
    function handleDescriptionChange(newDesc) {
        setNewProfileSettings(prevSettings => {
            const newSettings = {...prevSettings}
            newSettings.profile.description = newDesc
            return newSettings
        })
        // TODO handle api
    }
    return <Paragraph
        editable={
        {
            onChange: handleDescriptionChange,
            text: newProfileSettings?.profile?.description
        }
    }
    >
        {newProfileSettings?.profile?.description} </Paragraph>
}

const tradingTypes = {
    realTrading: {
        label: "Real Trading",
        value: "realTrading"
    },
    simulatedTrading: {
        label: "Simulated Trading",
        value: "simulatedTrading"
    },
    tradingDisabled: {
        label: "Trading Disabled",
        value: "tradingDisabled"
    }
}

const tradingTypeStr = "tradingType"

export function ProfileTradingSettings({newProfileSettings, setNewProfileSettings}) {
    const isRealTrading = newProfileSettings?.config?.trader?.enabled
    const isSimulatedTrading = newProfileSettings?.config?.["trader-simulator"].enabled
    const currentTradingType = isRealTrading ? tradingTypes.realTrading.value : (isSimulatedTrading ? tradingTypes.simulatedTrading.value : tradingTypes.tradingDisabled.value)
    function onChange(value, rootPath, subPath) {
        setNewProfileSettings(prevSettings => {
            const newSettings = {
                ...prevSettings
            }

            if (tradingTypeStr === rootPath) {
                if (tradingTypes.realTrading.value === value) {
                    newSettings.config.trader.enabled = true
                    newSettings.config["trader-simulator"].enabled = false
                } else if (tradingTypes.simulatedTrading.value === value) {
                    newSettings.config.trader.enabled = false
                    newSettings.config["trader-simulator"].enabled = true
                } else {
                    newSettings.config.trader.enabled = false
                    newSettings.config["trader-simulator"].enabled = false
                }
            } else if (newSettings.config[rootPath]) {
                newSettings.config[rootPath][subPath] = value
            } else {
                newSettings.config[rootPath] = {
                    [subPath]: value
                }
            }
            return newSettings
        });
        // TODO send to api
    };
    return <Grid container
        spacing={1}>
        <Grid item
            xs={12}
            spacing={1}>
            <Title level={3}>
                Trading Settings
            </Title>
        </Grid>
        <ProfileTradingTypeSettings tradingType={currentTradingType}
            onChange={onChange}/>
        <ProfileReferenceMarketSettings newProfileSettings={newProfileSettings}
            onChange={onChange}/>
    </Grid>
}
export function ProfileTradingTypeSettings({tradingType, onChange}) {
    return (
        <Grid item
            xs={12}
            spacing={1}>
            <Title level={5}>Trading Type:</Title>
            <Radio.Group options={
                    [tradingTypes.realTrading, tradingTypes.simulatedTrading, tradingTypes.tradingDisabled,]
                }
                onChange={
                    (event) => onChange(event.target.value, tradingTypeStr)
                }
                value={tradingType}
                optionType="button"/>
        </Grid>
    )
}

export function ProfileReferenceMarketSettings({newProfileSettings, onChange}) {
    const refMarket = newProfileSettings?.config?.trading?.["reference-market"];
    // TODO replace with all available
    const quoteAssets = [
        "USDT",
        "BTC",
        "ETH",
        "USD",
        "BUSD",
        "USDC"
    ]
    if (! quoteAssets.includes(refMarket)) {
        quoteAssets.push(refMarket)
    }

    const defaultOptions = convertStringArrayToOptions(quoteAssets)
    const [options, setOptions] = useState(defaultOptions);
    function setAutoCompleteOptions(searchText) {
        const searchTextU = searchText?.toUpperCase()
        const newOptions = searchTextU ? convertStringArrayToOptions(quoteAssets.filter((quoteAsset) => quoteAsset.includes(searchTextU))) : defaultOptions
        if (! newOptions.includes(searchTextU)) {
            newOptions.push({label: searchTextU, value: searchTextU})
        }
        setOptions(newOptions)
    }
    return <Grid xs={12}
        sm={6}
        item>
        <Title level={5}>
            Reference Market:
        </Title>
        <AutoComplete options={options}
            style={
                {width: "100%"}
            }
            value={refMarket}
            onChange={
                (_refMarket) => onChange(_refMarket.toUpperCase(), "trading", "reference-market")
            }
            onSearch={setAutoCompleteOptions}
            placeholder="enter a reference market like USDT or BTC"/>
    </Grid>
}

function convertStringArrayToOptions(stringArray) {
    return stringArray ? stringArray.map((quoteAsset) => ({label: quoteAsset, value: quoteAsset})) : []
}

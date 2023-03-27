import {
    faCopy,
    faDownload,
    faInfoCircle,
    faPlus,
    faSave,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Grid, Button} from "@mui/material";
import {
    AutoComplete,
    Modal,
    Radio,
    Button as AntButton,
    InputNumber,
    Typography,
    List,
    Card,
    Input,
    Switch,
    Alert,
    Space
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { useEffect } from "react";
import {useMemo} from "react";
import {useState} from "react";
import {deleteProfile, duplicateProfile, updateConfig, updateProfileInfo} from "../../../../api/actions";
import {backendRoutes} from "../../../../constants/backendConstants";
import {useBotDomainContext} from "../../../../context/config/BotDomainProvider";
import {useBotInfoContext, useFetchBotInfo} from "../../../../context/data/BotInfoProvider";
import {useIsBotOnlineContext, useRestartBot} from "../../../../context/data/IsBotOnlineProvider";
import ProfileAvatar from "../../Stats/ProfileAvatar";


export default function ProfileModal() {
    const [open, setOpen] = useState(false);
    const fetchBotInfo = useFetchBotInfo()
    const [loading, setIsloading] = useState(false);
    const [requiresInstantRestart, setRequiresInstantRestart] = useState(false);
    const botInfo = useBotInfoContext()
    const isOnline = useIsBotOnlineContext()
    const currentProfile = botInfo?.current_profile
    const restartBot = useRestartBot()
    const botDomain = useBotDomainContext()
    const currentProfileTitle = currentProfile?.profile?.name
    // use JSON to avoid working on original object
    const [newProfileSettings, setNewProfileSettings] = useState(JSON.parse(JSON.stringify(currentProfile)))
    const hasChanged = JSON.stringify(currentProfile) !== JSON.stringify(newProfileSettings)
    
    useEffect(() => {
        setNewProfileSettings(JSON.parse(JSON.stringify(currentProfile)))
    }, [currentProfile])
    
    async function saveProfile(event, restart = false) {
        setIsloading(true)
        const infoHasChanged = JSON.stringify(currentProfile.profile) !== JSON.stringify(newProfileSettings.profile)
        const configHasChanged = JSON.stringify(currentProfile.config) !== JSON.stringify(newProfileSettings.config)
        function onFail() {

            setIsloading(false)
        }
        if (configHasChanged) {
            const configUpdate = {
                global_config: {
                    'trading_reference-market': newProfileSettings.config.trading["reference-market"],
                    'trader_enabled': newProfileSettings.config.trader.enabled,
                    'trader_load-trade-history': newProfileSettings.config.trader["load-trade-history"],
                    'trader-simulator_enabled': newProfileSettings.config["trader-simulator"].enabled,
                    'trader-simulator_fees_maker': newProfileSettings.config["trader-simulator"].fees.maker,
                    'trader-simulator_fees_taker': newProfileSettings.config["trader-simulator"].fees.maker
                },
                removed_elements: [],
                restart_after_save: false
            }
            const newPortfolio = newProfileSettings.config["trader-simulator"]["starting-portfolio"]
            const portfolioCoins = new Set([
                ...Object.keys(newProfileSettings.config["trader-simulator"]["starting-portfolio"]),
                ...Object.keys(currentProfile.config["trader-simulator"]["starting-portfolio"])
            ])
            portfolioCoins.forEach(coin => {
                const coinKey = `trader-simulator_starting-portfolio_${coin}`
                if (newPortfolio[coin]) {
                    configUpdate.global_config[coinKey] = newPortfolio[coin]
                } else {
                    configUpdate.removed_elements.push(coinKey)
                }
            })
            await updateConfig(botDomain, configUpdate, newProfileSettings.profile.name, onFail)
        }

        if (infoHasChanged) {
            await updateProfileInfo(botDomain, {
                id: newProfileSettings.profile.id,
                name: newProfileSettings.profile.name,
                description: newProfileSettings.profile.description
            }, onFail)
        }
        setIsloading(false)
        if (restart) {
            restartBot(false)
        } else {
            fetchBotInfo(false)
        } handleClose()
    }
    function saveProfileAndRestart() {
        saveProfile(undefined, true)
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setNewProfileSettings(JSON.parse(JSON.stringify(currentProfile)))
        setIsloading(false)
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
                disabled={!isOnline}
                style={
                    {
                        fontSize: "9px",
                        height: "100%",
                        textTransform: "none",
                        maxWidth: "150px",
                        maxHeight: "40px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }
            }>
                <ProfileAvatar marginRight="5px"/> {currentProfileTitle} </Button>
            <Modal open={open}
                onCancel={handleClose}
                title={
                    (
                        <ProfileTitle newProfileSettings={newProfileSettings}
                            setNewProfileSettings={setNewProfileSettings}
                            currentProfile={currentProfile}
                            setRequiresInstantRestart={setRequiresInstantRestart}/>
                    )
                }
                centered
                width="700px"
                footer={
                    [
                        (
                            <AntButton key="back"
                                icon={
                                    (
                                        <FontAwesomeIcon style={
                                                {marginRight: "5px"}
                                            }
                                            icon={faXmark}/>
                                    )
                                }
                                size="large"
                                onClick={handleClose}>
                                Cancel
                            </AntButton>
                        ),
                        !requiresInstantRestart && (
                            <AntButton disabled={
                                    ! hasChanged || loading 
                                }
                                key="save"
                                type="primary"
                                icon={
                                    (
                                        <FontAwesomeIcon style={
                                                {marginRight: "5px"}
                                            }
                                            icon={faSave}/>
                                    )
                                }
                                size="large"
                                onClick={saveProfile}>
                                Save And Restart Later
                            </AntButton>
                        ),
                        (
                            <AntButton disabled={
                                    ! hasChanged || loading 
                                }
                                key="saveAndRestart"
                                type="primary"
                                danger
                                icon={
                                    (
                                        <FontAwesomeIcon style={
                                                {marginRight: "5px"}
                                            }
                                            icon={faSave}/>
                                    )
                                }
                                size="large"
                                onClick={saveProfileAndRestart}>
                                Save And Restart Now
                            </AntButton>
                        ),
                    ]
            }>
                <ProfileSettings newProfileSettings={newProfileSettings}
                    setNewProfileSettings={setNewProfileSettings}
                    setIsloading={setIsloading}
                    handleClose={handleClose}
                    loading={loading}/>
            </Modal>
        </div>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [
        currentProfileTitle,
        currentProfile,
        hasChanged,
        loading,
        newProfileSettings,
        open
    ])
}

export function ProfileSettings({
    newProfileSettings,
    setNewProfileSettings,
    setIsloading,
    handleClose,
    loading
}) {
    const botDomain = useBotDomainContext()
    const fetchBotInfo = useFetchBotInfo()
    function onSuccess() {
        setIsloading(false)
        handleClose()
        fetchBotInfo(true)
    }
    async function handleDeleteProfile() {
        setIsloading(true)
        await deleteProfile(botDomain, newProfileSettings.profile.id, newProfileSettings.profile.name, onSuccess, () => setIsloading(false))
    }
    async function handleProfileDuplication() {
        setIsloading(true)
        await duplicateProfile(botDomain, newProfileSettings.profile.id, newProfileSettings.profile.name, onSuccess, () => setIsloading(false))
    }
    // async function handleProfileExport() {
    //     setIsloading(true)
    //     await exportProfile(botDomain, newProfileSettings.profile.id, newProfileSettings.profile.name, onSuccess, ()=>setIsloading(false))
    // }
    return <div>
        <Space wrap
            style={
                {marginBottom: "15px"}
        }>
            <AntButton key="duplicate" type="primary" warning
                icon={
                    (
                        <FontAwesomeIcon style={
                                {marginRight: "5px"}
                            }
                            icon={faCopy}/>
                    )
                }
                disabled={loading}
                onClick={handleProfileDuplication}>
                Duplicate Profile
            </AntButton>
            <AntButton key="downloadProfile" type="primary" warning
                icon={
                    (
                        <FontAwesomeIcon style={
                                {marginRight: "5px"}
                            }
                            icon={faDownload}/>
                    )
                }
                disabled={loading}
                href={
                    botDomain + backendRoutes.exportProfile + newProfileSettings.profile.id
                }
                // onClick={handleProfileExport}
            >
                Download Profile
            </AntButton>
            <AntButton key="deleteProfile" type="primary" warning
                icon={
                    (
                        <FontAwesomeIcon style={
                                {marginRight: "5px"}
                            }
                            icon={faXmark}/>
                    )
                }
                danger
                disabled={loading}
                onClick={handleDeleteProfile}>
                Delete Profile
            </AntButton>
        </Space>
        <ProfileDescription newProfileSettings={newProfileSettings}
            setNewProfileSettings={setNewProfileSettings}/>
        <ProfileTradingSettings newProfileSettings={newProfileSettings}
            setNewProfileSettings={setNewProfileSettings}
            setIsloading={setIsloading}
            handleClose={handleClose}
            loading={loading}/>
    </div>
}

export function ProfileTitle({newProfileSettings, setNewProfileSettings, currentProfile, setRequiresInstantRestart}) {
    function handleTitleChange(newName) {
        setNewProfileSettings(prevSettings => {
            const newSettings = {
                ...prevSettings
            }
            newSettings.profile.name = newName
            setRequiresInstantRestart(JSON.stringify(currentProfile.profile.name) !== JSON.stringify(newSettings.profile.name))
            return newSettings
        })
        // TODO handle api
    }
    return (
        <Title level={2}
            editable={
                !newProfileSettings.profile.read_only && {
                    onChange: handleTitleChange,
                    text: newProfileSettings?.profile?.name,

                    tooltip: 'Click to edit the profile name'
                }
        }>
            <ProfileAvatar size="40px"/> {
            newProfileSettings.profile.name
        }</Title>

    )
}

export function ProfileDescription({newProfileSettings, setNewProfileSettings}) {
    function handleDescriptionChange(newDesc) {
        setNewProfileSettings(prevSettings => {
            const newSettings = {
                ...prevSettings
            }
            newSettings.profile.description = newDesc
            return newSettings
        })
        // TODO handle api
    }
    return <Paragraph editable={
        !newProfileSettings.profile.read_only && {
            onChange: handleDescriptionChange,
            text: newProfileSettings?.profile?.description,
            tooltip: 'Click to edit the profile description'

        }
    }>
        {
        newProfileSettings?.profile?.description
    } </Paragraph>
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

export function ProfileTradingSettings({
    newProfileSettings,
    setNewProfileSettings,
    setIsloading,
    handleClose,
    loading
}) {

    const isRealTrading = newProfileSettings?.config?.trader?.enabled
    const isSimulatedTrading = newProfileSettings?.config?.["trader-simulator"].enabled
    const currentTradingType = isRealTrading ? tradingTypes.realTrading.value : (isSimulatedTrading ? tradingTypes.simulatedTrading.value : tradingTypes.tradingDisabled.value)
    function onChange(value, rootPath, subPath, subSubPath, subSubSubPath, ) {
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
                if (subSubSubPath) {
                    newSettings.config[rootPath][subPath][subSubPath][subSubSubPath] = value

                } else if (subSubPath) {
                    newSettings.config[rootPath][subPath][subSubPath] = value

                } else {
                    newSettings.config[rootPath][subPath] = value
                }
            } else if (subSubSubPath) {
                newSettings.config[rootPath] = {
                    [subPath]: {
                        [subSubPath]: {[subSubSubPath]: value}
                    }
                }
            } else if (subSubPath) {
                newSettings.config[rootPath] = {
                    [subPath]: {
                        [subSubPath]: value
                    }
                }
            } else {
                newSettings.config[rootPath] = {
                    [subPath]: value
                }
            }
            return newSettings
        });
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
        <ProfileRealSettings newProfileSettings={newProfileSettings}
            onChange={onChange}/>
        <ProfileSimulatedSettings newProfileSettings={newProfileSettings}
            onChange={onChange}
            setNewProfileSettings={setNewProfileSettings}/> {/* <Grid item
            xs={12}
            spacing={1}>
            <Title level={3}>
                Profile Actions
            </Title>
           

        </Grid> */} </Grid>
}
export function ProfileRealSettings({newProfileSettings, onChange}) {
    return (
        <>
            <Grid item
                xs={12}
                spacing={1}>
                <Title level={3}>Real Trading Settings</Title>
            </Grid>
            <Grid item
                xs={12}
                sm={6}>
                <Switch onChange={
                        (value) => onChange(value, "trader", "load-trade-history")
                    }
                    checked={
                        newProfileSettings?.config?.trader?.["load-trade-history"]
                    }
                    checkedChildren="load trades history from exchange"
                    unCheckedChildren="don't load trades history from exchange"/>
            </Grid>
        </>
    )
}
export function ProfileSimulatedSettings({newProfileSettings, onChange, setNewProfileSettings}) {
    return (
        <>
            <Grid item
                xs={12}
                spacing={1}>
                <Title level={3}>Simulated Trading Settings</Title>
            </Grid>
            <Grid item
                xs={12}
                sm={6}>
                <Title level={5}>Maker Fees (Limit Orders):</Title>
                <InputNumber style={
                        {width: "100%"}
                    }
                    value={
                        newProfileSettings?.config?.["trader-simulator"]?.fees?.maker
                    }
                    addonAfter="%"
                    defaultValue="0.1"
                    min="-1"
                    max="5"
                    step="0.001"
                    onChange={
                        (newValue) => onChange(Number(newValue), "trader-simulator", "fees", "maker")
                    }
                    stringMode/>
            </Grid>
            <Grid item
                xs={12}
                sm={6}>
                <Title level={5}>Taker Fees (Market Orders):</Title>
                <InputNumber style={
                        {width: "100%"}
                    }
                    value={
                        newProfileSettings?.config?.["trader-simulator"]?.fees?.taker
                    }
                    addonAfter="%"

                    defaultValue="0.1"
                    min="-1"
                    max="5"
                    step="0.001"
                    onChange={
                        (newValue) => onChange(Number(newValue), "trader-simulator", "fees", "taker")
                    }
                    stringMode/>
            </Grid>
            <ProfilePortfolioSettings newProfileSettings={newProfileSettings}
                onChange={onChange}
                setNewProfileSettings={setNewProfileSettings}/></>
    )
}
const addKey = "add"
export function ProfilePortfolioSettings({newProfileSettings, onChange, setNewProfileSettings}) {

    const data = [
        ...Object.keys(newProfileSettings.config["trader-simulator"]["starting-portfolio"]).map(coin => {
            return {
                coin: coin, value: newProfileSettings.config["trader-simulator"]["starting-portfolio"][coin]
            }
        }), {
            key: addKey
        }
    ]
    return (
        <Grid item
            xs={12}>
            <Title level={5}>Simulated Starting Portfolio:</Title>
            <Alert message={
                    (
                        <><FontAwesomeIcon style={
                                    {marginRight: "5px"}
                                }
                                icon={faInfoCircle}/>Changes to the simulated starting portfolio will reset enabled exchanges simulated portfolio history.</>
                    )
                }
                type="info"
                style={
                    {marginBottom: "10px"}
                }/>
            <List grid={
                    {
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        column: 3
                    }
                }
                dataSource={data}
                renderItem={
                    (item) => {
                        return item.key === addKey ? (
                            <ProfileAddCoinSettings setNewProfileSettings={setNewProfileSettings}/>
                        ) : (
                            <ProfilePortfolioCoinSettings item={item}
                                newProfileSettings={newProfileSettings}
                                setNewProfileSettings={setNewProfileSettings}
                                onChange={onChange}/>
                        )
                    }
                }/>
        </Grid>
    )
}
export function ProfileAddCoinSettings({setNewProfileSettings}) {
    const [coinToSet, setCoinToSet] = useState({})
    function handleCoinToAdd(key, newValue) {
        setCoinToSet(prevValues => ({
            ...prevValues,
            [key]: newValue
        }))
    }
    function handleCoinAdd() {
        setNewProfileSettings(prevSettings => {
            const newSettings = {
                ...prevSettings
            }
            newSettings.config["trader-simulator"]["starting-portfolio"][coinToSet.coin] = coinToSet.value || 0
            return newSettings
        })
        setCoinToSet({})
    }
    return (
        <List.Item>
            <Card>
                <Typography.Title level={5}
                    style={
                        {width: "100%"}
                }>Add a new Asset:
                </Typography.Title>
                <Input value={
                        coinToSet.coin
                    }
                    onChange={
                        (event) => handleCoinToAdd("coin", event.target.value.toUpperCase())
                    }
                    placeholder="Asset name"
                    style={
                        {width: "100%"}
                    }/>
                <InputNumber style={
                        {
                            width: "100%",
                            marginTop: "10px"
                        }
                    }
                    value={
                        coinToSet.value
                    }
                    addonAfter={
                        coinToSet.coin && coinToSet.coin
                    }
                    min="0"
                    step="0.0000001"
                    placeholder="Asset amount"

                    onChange={
                        (newValue) => handleCoinToAdd("value", Number(newValue))
                    }
                    stringMode/>
                <AntButton type="primary"
                    style={
                        {marginTop: "10px"}
                    }
                    disabled={
                        !coinToSet.coin && !coinToSet.value && true
                    }
                    icon={
                        (
                            <FontAwesomeIcon style={
                                    {marginRight: "5px"}
                                }
                                icon={faPlus}/>
                        )
                    }
                    onClick={handleCoinAdd}>
                    Add Coin</AntButton>
            </Card>
        </List.Item>
    )
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

export function ProfilePortfolioCoinSettings({item, newProfileSettings, onChange, setNewProfileSettings}) {
    function handleRemoveCoin() {
        setNewProfileSettings(prevSettings => {
            const newSettings = {
                ...prevSettings
            }
            delete newSettings.config["trader-simulator"]["starting-portfolio"][item.coin]
            return newSettings
        })
    }
    function handleCoinNameChange(value) {
        setNewProfileSettings(prevSettings => {
            const newSettings = {
                ...prevSettings
            }
            newSettings.config["trader-simulator"]["starting-portfolio"][value] = newSettings.config["trader-simulator"]["starting-portfolio"][item.coin]
            delete newSettings.config["trader-simulator"]["starting-portfolio"][item.coin]
            return newSettings
        })
    }
    return (
        <List.Item key={
            item.coin
        }>
            <Card>
                <Typography.Title level={5}
                    style={
                        {width: "100%"}
                    }
                    editable={
                        {
                            tooltip: 'click to edit the asset',
                            onChange: handleCoinNameChange,
                            text: item.coin
                        }
                }>
                    {
                    item.coin
                } </Typography.Title>

                <InputNumber style={
                        {width: "100%"}
                    }
                    value={
                        newProfileSettings.config["trader-simulator"]["starting-portfolio"][item.coin]
                    }
                    addonAfter={
                        item.coin
                    }
                    min="0"
                    step="0.00000001"
                    onChange={
                        (newValue) => onChange(Number(newValue), "trader-simulator", "starting-portfolio", item.coin)
                    }
                    stringMode/>
                <AntButton key={
                        `delete${
                            item.coin
                        }`
                    }
                    type="primary"
                    danger
                    style={
                        {marginTop: "10px"}
                    }
                    icon={
                        (
                            <FontAwesomeIcon style={
                                    {marginRight: "5px"}
                                }
                                icon={faXmark}/>
                        )
                    }
                    onClick={handleRemoveCoin}>
                    Remove {
                    item.coin
                } </AntButton>
            </Card>
        </List.Item>
    )
}
export function ProfileReferenceMarketSettings({newProfileSettings, onChange}) {
    const refMarket = newProfileSettings?.config?.trading?.["reference-market"];
    // TODO replace with all available
    const quoteAssets = [...new Set(
            [
                refMarket,
                "USDT",
                "BTC",
                "ETH",
                "USD",
                "BUSD",
                "USDC"
            ]
        )]


    const defaultOptions = convertStringArrayToOptions(quoteAssets)
    const [options, setOptions] = useState(defaultOptions);
    function setAutoCompleteOptions(searchText) {
        const searchTextU = searchText?.toUpperCase()
        const newOptions = searchTextU ? convertStringArrayToOptions([...new Set(
                [
                    ...quoteAssets.filter((quoteAsset) => quoteAsset.includes(searchTextU)),
                    searchTextU
                ]
            )]) : defaultOptions
        setOptions(newOptions)
    }
    return (
        <Grid xs={12}
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
    )
}

function convertStringArrayToOptions(stringArray) {
    return stringArray ? stringArray.map((quoteAsset) => ({label: quoteAsset, value: quoteAsset})) : []
}

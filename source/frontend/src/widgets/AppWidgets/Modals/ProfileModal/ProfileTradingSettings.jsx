import {Grid} from "@mui/material"
import {AutoComplete, Radio, Typography} from "antd"
import {useState} from "react"
import {ProfileRealSettings} from "./ProfileRealTradingSettings"
import {ProfileSimulatedSettings} from "./ProfileSimulatedTradingSettings"

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
    function onChange(value, rootPath, subPath, subSubPath, subSubSubPath,) {
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
                        [subSubPath]: {
                            [subSubSubPath]: value
                        }
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
            xs={12}>
            <Typography.Title level={3}>
                Trading Settings
            </Typography.Title>
        </Grid>
        <ProfileTradingTypeSettings tradingType={currentTradingType}
            onChange={onChange}/>
        <ProfileReferenceMarketSettings newProfileSettings={newProfileSettings}
            onChange={onChange}/>
        <ProfileRealSettings newProfileSettings={newProfileSettings}
            onChange={onChange}/>
        <ProfileSimulatedSettings newProfileSettings={newProfileSettings}
            onChange={onChange}
            setNewProfileSettings={setNewProfileSettings}/>
    </Grid>
}


export function ProfileTradingTypeSettings({tradingType, onChange}) {
    return (
        <Grid item
            xs={12}
            >
            <Typography.Title level={5}>Trading Type:</Typography.Title>
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
            <Typography.Title level={5}>
                Reference Market:
            </Typography.Title>
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

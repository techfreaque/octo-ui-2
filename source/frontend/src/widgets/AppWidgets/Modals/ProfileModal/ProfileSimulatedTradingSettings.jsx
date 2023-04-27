import { faInfoCircle, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Grid } from "@mui/material"
import { Alert, Button, Card, Input, InputNumber, List, Typography } from "antd"
import { useState } from "react"

export function ProfileSimulatedSettings({newProfileSettings, onChange, setNewProfileSettings, isCurrentProfile}) {
    return (
        <>
            <Grid item
                xs={12}>
                <Typography.Title level={3}>Simulated Trading Settings</Typography.Title>
            </Grid>
            <Grid item
                xs={12}
                sm={6}>
                <Typography.Title level={5}>Maker Fees (Limit Orders):</Typography.Title>
                <InputNumber style={
                        {width: "100%"}
                    }
                    value={
                        newProfileSettings?.config?.["trader-simulator"]?.fees?.maker
                    } disabled={!isCurrentProfile}
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
                <Typography.Title level={5}>Taker Fees (Market Orders):</Typography.Title>
                <InputNumber style={
                        {width: "100%"}
                    }
                    value={
                        newProfileSettings?.config?.["trader-simulator"]?.fees?.taker
                    } disabled={!isCurrentProfile}
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
            <ProfilePortfolioSettings newProfileSettings={newProfileSettings} isCurrentProfile={isCurrentProfile}
                onChange={onChange}
                setNewProfileSettings={setNewProfileSettings}/></>
    )
}
const addKey = "add"
export function ProfilePortfolioSettings({newProfileSettings, onChange, setNewProfileSettings, isCurrentProfile}) {

    const data = [
        ...Object.keys(newProfileSettings.config["trader-simulator"]["starting-portfolio"]).map(coin => {
            return {
                coin, value: newProfileSettings.config["trader-simulator"]["starting-portfolio"][coin]
            }
        }), {
            key: addKey
        }
    ]
    return (
        <Grid item
            xs={12}>
            <Typography.Title level={5}>Simulated Starting Portfolio:</Typography.Title>
           {isCurrentProfile&&( <Alert message={
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
                }/>)}
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
                        return item.key === addKey ? (isCurrentProfile && (
                            <ProfileAddCoinSettings setNewProfileSettings={setNewProfileSettings}/>
                        )) : (
                            <ProfilePortfolioCoinSettings item={item}
                                newProfileSettings={newProfileSettings}
                                setNewProfileSettings={setNewProfileSettings} isCurrentProfile={isCurrentProfile} 
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
               <Button type="primary"
                    style={
                        {marginTop: "10px"}
                    }
                    disabled={
                        (!coinToSet.coin && !coinToSet.value && true)
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
                    Add Coin</Button>
            </Card>
        </List.Item>
    )
}


export function ProfilePortfolioCoinSettings({item, newProfileSettings, onChange, setNewProfileSettings, isCurrentProfile}) {
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
            newSettings.config["trader-simulator"]["starting-portfolio"][value.toUpperCase()] = newSettings.config["trader-simulator"]["starting-portfolio"][item.coin]
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
                    editable={isCurrentProfile &&
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
                    disabled={!isCurrentProfile}
                    addonAfter={
                        item.coin
                    }
                    min="0"
                    step="0.00000001"
                    onChange={
                        (newValue) => onChange(Number(newValue), "trader-simulator", "starting-portfolio", item.coin)
                    }
                    stringMode/>
               {isCurrentProfile&&( <Button key={
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
                } </Button>)}
            </Card>
        </List.Item>
    )
}
import TabsWithSelector from "../../../components/Tabs/TabsWithSelector";
import {Button} from "@mui/material";
import {useUpdateVisiblePairsContext, useVisiblePairsContext} from "../../../context/config/VisiblePairProvider";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";
import {backendRoutes} from "../../../constants/backendConstants";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {useMemo, useState} from "react";
import {
    Card,
    Dropdown,
    List,
    Select,
    Space,
    Switch,
    Tooltip
} from "antd";
import ExchangeSelector from "../ExchangeSelector/ExchangeSelector";
import RadioButtonGroup from "../../../components/Buttons/RadioButtonGroup";
import RadioButton from "../../../components/Buttons/RadioButton";
import {Trans} from "react-i18next";
import {useVisibleExchangesContext} from "../../../context/config/VisibleExchangesProvider";
// import {getCurrencyLogos} from "../../../api/data";

export default function PairsSelector() { // const [currencyLogos, setCurrencyLogos] = useState()
    const botInfo = useBotInfoContext();
    const botDomain = useBotDomainContext();
    const visiblePairs = useVisiblePairsContext();
    const setVisiblePairs = useUpdateVisiblePairsContext();
    const visibleExchanges = useVisibleExchangesContext();
    const currencySettings = botInfo ?. current_profile ?. config ?. ["crypto-currencies"]
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    // useEffect(() => {
    //     getCurrencyLogos(botDomain, Object.keys(currencySettings).map(currency => currency), setCurrencyLogos)
    // }, [currencySettings]);
    return useMemo(() => {
        return (<div style={
            {margin: "auto"}
        }>

            <PairConfigurator setMenuIsOpen={setMenuIsOpen}
                menuIsOpen={menuIsOpen}>
            <Tooltip key={visiblePairs}
                title={
                    (<Trans i18nKey="pairExchangeSettings.currentPairTooltip"/>)
            }>
                <RadioButton selected={true}
                    // displayFlex={false}
                    onClick={
                        () => setMenuIsOpen(true)
                }>
                    <div>
                        <div style={
                            {lineHeight: "16px"}
                        }> {visiblePairs} </div>
                        <div style={
                            {lineHeight: "15px"}
                        }> {visibleExchanges} </div>
                    </div>
                </RadioButton>
            </Tooltip>
                
                </PairConfigurator>
        </div>)

    }, [botDomain, menuIsOpen, visibleExchanges, visiblePairs])
}


function PairConfigurator({setMenuIsOpen, menuIsOpen, children}) {
    const botInfo = useBotInfoContext();

    const currencySettings = botInfo ?. current_profile ?. config ?. ["crypto-currencies"]

    const botDomain = useBotDomainContext();
    const pairsData = currencySettings ? Object.keys(currencySettings).map(currency => {
        return {
            ... currencySettings[currency],
            currency
        }
    }) : []
    return (<Dropdown onOpenChange={setMenuIsOpen}
        open={menuIsOpen}
        menu={{items:
            {label: "fds", key: "d"}
        }}
        dropdownRender={
            (event) => {
                return (<div>
                    <ExchangeSelector/>
                    <List grid={
                            {
                                gutter: 16,
                                column: 1
                                // xs: 1,
                                // sm: 2,
                                // md: 4,
                                // lg: 4,
                                // xl: 6,
                                // xxl: 3,
                            }
                        }
                        dataSource={pairsData}
                        renderItem={
                            (item) => {
                                const availableOptions = [{
                                        label: "ree",
                                        value: "ree"
                                    }]
                                const selectedOptions = item ?. pairs ?. map(pair => ({label: pair, value: pair}))
                                return (<List.Item>
                                    <Card title={
                                        item.currency
                                    }>
                                        <Space direction="vertical">
                                            <Switch checkedChildren={
                                                    `${
                                                        item.currency
                                                    } enabled`
                                                }
                                                unCheckedChildren={
                                                    `${
                                                        item.currency
                                                    } disabled`
                                                }
                                                // checked={item.enabled}
                                            />
                                            <Select mode="tags"
                                                style={
                                                    {width: '100%'}
                                                }
                                                placeholder="Pairs"
                                                // onChange={handleChange}
                                                options={availableOptions}
                                                value={selectedOptions}/></Space>
                                    </Card>
                                </List.Item>)
                            }
                        }/>
                    <Button href={
                        botDomain + backendRoutes.manageSymbol
                    }>Manage Currency Settings</Button>
                </div>)
            }
        }
        
        >{children}</Dropdown>)
}

//         return (<RadioButtonGroup   menuItems={ //             rightContent={
//             //     (<TimeFrameEnabler enabledTimeFrame={enabledTimeFrame}
//             //         setEnabledTimeFrame={setEnabledTimeFrame}/>)
//             // }

//             [{label: visiblePairs, key: visiblePairs}]
// }
// // onChange={handleChange}
//             selected={visiblePairs}/>)

// return botInfo && visiblePairs && (
//     <TabsWithSelector currentItem={visiblePairs}
//         items={
//             botInfo.symbols
//         }
//         handleChange={
//             (event, newTimeframe) => setVisiblePairs(newTimeframe)
//     }>
//         <ExchangeSelector />
//         <List grid={
//                 {
//                     gutter: 16,
//                     column: 1
//                     // xs: 1,
//                     // sm: 2,
//                     // md: 4,
//                     // lg: 4,
//                     // xl: 6,
//                     // xxl: 3,
//                 }
//             }
//             dataSource={pairsData}
//             renderItem={
//                 (item) => {
//                     const availableOptions = [{
//                             label: "ree",
//                             value: "ree"
//                         }]
//                     const selectedOptions = item?.pairs?.map(pair => ({label: pair, value: pair}))
//                     return (
//                         <List.Item>
//                             <Card title={
//                                 item.currency
//                             }>
//                                 <Space direction="vertical">
//                                     <Switch checkedChildren={
//                                             `${
//                                                 item.currency
//                                             } enabled`
//                                         }
//                                         unCheckedChildren={
//                                             `${
//                                                 item.currency
//                                             } disabled`
//                                         }
//                                         // checked={item.enabled}
//                                     />
//                                     <Select mode="tags"
//                                         style={
//                                             {width: '100%'}
//                                         }
//                                         placeholder="Pairs"
//                                         // onChange={handleChange}
//                                         options={availableOptions}
//                                         value={selectedOptions}/></Space>
//                             </Card>
//                         </List.Item>
//                     )
//                 }
//             }/>
//         <Button href={
//             botDomain + backendRoutes.manageSymbol
//         }>Manage Currency Settings</Button>
//     </TabsWithSelector>
// );

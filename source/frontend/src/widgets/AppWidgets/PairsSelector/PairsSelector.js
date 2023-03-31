import TabsWithSelector from "../../../components/Tabs/TabsWithSelector";
import {Button} from "@mui/material";
import {useUpdateVisiblePairsContext, useVisiblePairsContext} from "../../../context/config/VisiblePairProvider";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";
import {backendRoutes} from "../../../constants/backendConstants";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {useMemo} from "react";
import {
    Card,
    List,
    Select,
    Space,
    Switch
} from "antd";
// import {getCurrencyLogos} from "../../../api/data";

export default function PairsSelector() {
    // const [currencyLogos, setCurrencyLogos] = useState()
    const botInfo = useBotInfoContext();
    const botDomain = useBotDomainContext();
    const visiblePairs = useVisiblePairsContext();
    const setVisiblePairs = useUpdateVisiblePairsContext();
    const currencySettings = botInfo?.current_profile?.config?.["crypto-currencies"]
    const pairsData = currencySettings ? Object.keys(currencySettings).map(currency => {
        return {
            ...currencySettings[currency],
            currency
        }
    }) : []
    // useEffect(() => {
    //     getCurrencyLogos(botDomain, Object.keys(currencySettings).map(currency => currency), setCurrencyLogos)
    // }, [currencySettings]);
    return useMemo(() => {
        return botInfo && visiblePairs && (
            <TabsWithSelector currentItem={visiblePairs}
                items={
                    botInfo.symbols
                }
                handleChange={
                    (event, newTimeframe) => setVisiblePairs(newTimeframe)
            }>
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
                            const selectedOptions = item?.pairs?.map(pair => ({label: pair, value: pair}))
                            return (
                                <List.Item>
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
                                </List.Item>
                            )
                        }
                    }/>
                <Button href={
                    botDomain + backendRoutes.manageSymbol
                }>Manage Currency Settings</Button>
            </TabsWithSelector>
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [botDomain, botInfo, setVisiblePairs, visiblePairs])
}

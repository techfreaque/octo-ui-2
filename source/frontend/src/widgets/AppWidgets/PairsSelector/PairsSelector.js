/* eslint-disable react-hooks/exhaustive-deps */
import {useVisiblePairsContext} from "../../../context/config/VisiblePairProvider";
import {useBotInfoContext} from "../../../context/data/BotInfoProvider";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {useMemo, useState} from "react";
import {
    Dropdown,
    Tooltip
} from "antd";
import RadioButton from "../../../components/Buttons/RadioButton";
import {Trans} from "react-i18next";
import {useVisibleExchangesContext} from "../../../context/config/VisibleExchangesProvider";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import { PairsTable } from "./PairsTable";
// import {getCurrencyLogos} from "../../../api/data";

export default function PairsSelector() { // const [currencyLogos, setCurrencyLogos] = useState()
    const botDomain = useBotDomainContext();
    const visiblePairs = useVisiblePairsContext();
    const visibleExchanges = useVisibleExchangesContext();
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    // useEffect(() => {
    //     getCurrencyLogos(botDomain, Object.keys(currencySettings).map(currency => currency), setCurrencyLogos)
    // }, [currencySettings]);
    return useMemo(() => {
        return (<div style={
            {margin: "auto"}
        }>
            <PairConfiguratorDropdown setMenuIsOpen={setMenuIsOpen}
                menuIsOpen={menuIsOpen}>
            <Tooltip key={visiblePairs}
                title={
                    (<Trans i18nKey="pairExchangeSettings.currentPairTooltip"/>)
            }>
                <RadioButton selected={true}
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
                
                </PairConfiguratorDropdown>
        </div>)

    }, [botDomain, menuIsOpen, visibleExchanges, visiblePairs])
}


function PairConfiguratorDropdown({setMenuIsOpen, menuIsOpen, children}) {

    return (<Dropdown onOpenChange={setMenuIsOpen}
        open={menuIsOpen}
        destroyPopupOnHide={true}
        dropdownRender={
            () => {
                return (<PairConfigurator/>)
            }
        }
        selectable={false}
        multiple={true}
        trigger="click"
        placement="bottomRight"
        arrow={
            {pointAtCenter: true}
    }
        >{children}</Dropdown>)
}

function PairConfigurator() {
    const botInfo = useBotInfoContext();
    const currencySettings = botInfo?.current_profile?.config?.["crypto-currencies"]
    const botColors = useBotColorsContext();
    return (<div style={{
        backgroundColor: botColors.background,
        // maxHeight: "calc(100vh - 80px)",
        // overflowX: "hidden",
        // overflowY: "auto",
        border: `1px solid ${botColors.border}`,
    }}>
        {/* <ExchangeSelector /> */}
        <PairsTable currencySettings={currencySettings}/>
        {/* <List grid={
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
        }>Manage Currency Settings</Button> */}
    </div>)
}
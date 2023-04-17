import {useVisiblePairsContext} from "../../../context/config/VisiblePairProvider";
import {useMemo, useState} from "react";
import {
    Dropdown,
    Tooltip
} from "antd";
import {Trans} from "react-i18next";
import {useVisibleExchangesContext} from "../../../context/config/VisibleExchangesProvider";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import AntButton from "../../../components/Buttons/AntButton";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
// import {getCurrencyLogos} from "../../../api/data";

export default function PairsSelector({content}) { // const [currencyLogos, setCurrencyLogos] = useState()
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
                menuIsOpen={menuIsOpen}
                content={content}
            >
            <Tooltip key={visiblePairs}
                title={
                    (<Trans i18nKey="pairExchangeSettings.currentPairTooltip"/>)
            }>
                <AntButton selected={true}
                    onClick={
                        () => setMenuIsOpen(true)
                }
                    buttonVariant="text"
                >
                    <div>
                        <div style={
                            {lineHeight: "16px"}
                        }> {visiblePairs} </div>
                        <div style={
                            {lineHeight: "15px"}
                        }> {visibleExchanges} </div>
                    </div>
                </AntButton>
            </Tooltip>
                
                </PairConfiguratorDropdown>
        </div>)

    }, [content, menuIsOpen, visibleExchanges, visiblePairs])
}


function PairConfiguratorDropdown({content, setMenuIsOpen, menuIsOpen, children}) {

    return (<Dropdown onOpenChange={setMenuIsOpen}
        open={menuIsOpen}
        destroyPopupOnHide={true}
        dropdownRender={
            () => {
                return (<PairConfigurator content={content} />)
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

function PairConfigurator({content}) {
    const botColors = useBotColorsContext();
    return (<div style={{
        backgroundColor: botColors.background,
        // maxHeight: "calc(100vh - 80px)",
        // overflowX: "hidden",
        // overflowY: "auto",
        border: `1px solid ${botColors.border}`,
    }}>
       { content && (<AppWidgets layout={content}/>)}
        {/* <ExchangeSelector />
        <PairsTable currencySettings={currencySettings}/> */}

    </div>)
}
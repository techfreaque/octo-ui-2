import {
    Switch,
} from 'antd';
import {useEffect, useState,} from 'react';
import {useExchangeInfoContext, useFetchExchangeInfo} from '../../../context/data/BotExchangeInfoProvider';
import {useIsBotOnlineContext} from '../../../context/data/IsBotOnlineProvider';
import {useBotDomainContext} from '../../../context/config/BotDomainProvider';
import {useUpdateVisibleExchangesContext} from '../../../context/config/VisibleExchangesProvider';
import {useUpdateVisiblePairsContext, useVisiblePairsContext} from '../../../context/config/VisiblePairProvider';
import {useVisibleExchangesContext} from '../../../context/config/VisibleExchangesProvider';
import "./pairsTable.css"
import { useBotInfoContext } from '../../../context/data/BotInfoProvider';
import AntTable from '../../../components/Tables/AntTable';
import { parseSymbol } from '../../../components/SymbolsUtil/SymbolsUtil';

function convertSymbolSettingsToNewFormat(currencySettings, exchangeInfo) {
    const pairsData = []
    const newCurrencySettings = {}
    currencySettings && Object.keys(currencySettings).forEach(currency => {
        if (currencySettings[currency]?.enabled) {
            currencySettings[currency]?.pairs?.forEach(pair => {
                pairsData.push(pair)
                newCurrencySettings[pair] = {enabled: true, pairs: [pair], currency: exchangeInfo?.currency_name_info?.[parseSymbol(pair).base]?.n}
            })
                 }
    })
    return {pairsData, newCurrencySettings}
}


export default function PairsTable() {
    const botInfo = useBotInfoContext();
    const currencySettings = botInfo?.current_profile?.config?.["crypto-currencies"]
    const exchangeInfo = useExchangeInfoContext()
    const [unsavedCurrencySettings, setUnsavedCurrencySettings] = useState(convertSymbolSettingsToNewFormat(currencySettings, exchangeInfo));
    const isOnline = useIsBotOnlineContext()
    const botDomain = useBotDomainContext()
    const setVisibleExchanges = useUpdateVisibleExchangesContext();
    const visibleExchanges = useVisibleExchangesContext();
    const setVisiblePairs = useUpdateVisiblePairsContext();
    const visiblePairs = useVisiblePairsContext();
    useEffect(() => {
        setUnsavedCurrencySettings(convertSymbolSettingsToNewFormat(currencySettings, exchangeInfo));
    }, [currencySettings, exchangeInfo])

    function handleSettingChange(enabled, exchange, symbol, base) { 
        console.log(currencySettings)
        // setUnsavedCurrencySettings(prevSettings => {
            
        // })
    }

    function handlePairSelection(symbol, exchange) {
        setVisibleExchanges(exchange)
        setVisiblePairs(symbol.replace("/", "|"))
    }

    const fetchExchangeInfo = useFetchExchangeInfo()
    useEffect(() => {
        isOnline && fetchExchangeInfo()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline, botDomain])

    const pairsData = []
    unsavedCurrencySettings && Object.keys(unsavedCurrencySettings).forEach(currency => {
        pairsData.push(...unsavedCurrencySettings[currency]?.pairs)
    })
    const preSorteddata = []
    const enabledExchanges = exchangeInfo?.symbols_by_exchanges && Object.keys(exchangeInfo.symbols_by_exchanges)
    enabledExchanges?.forEach(exchange => {
        exchangeInfo.symbols_by_exchanges[exchange].forEach(symbol => {
            const isEnabled = pairsData.includes(symbol)
            const base = parseSymbol(symbol).base
            const isSelected = visibleExchanges === exchange && visiblePairs === symbol.replace("/", "|")
            preSorteddata.push({
                key: `${symbol} ${exchangeInfo?.currency_name_info?.[base]?.n}`,
                exchange: exchange,
                symbolLabel: (isEnabled && !isSelected) ? (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                        href="#"
                        onClick={
                            (() => handlePairSelection(symbol, exchange))
                        }>
                        {symbol} </a>
                ) : symbol,
                symbol: symbol,
                enabledLabel: (
                    <Switch checked={isEnabled} onChange={(event)=>handleSettingChange(event, exchange, symbol ,base)} ></Switch>
                ),
                enabled: isEnabled,
                selected: isSelected
            })

        })
    });
    // pre sort by enabled and symbol
    preSorteddata?.sort((a, b) => {
        return(+ b?.enabled) - (+ a?.enabled) || a.symbol.localeCompare(b.symbol)
    });
  
    const columns = [
        {
            title: 'Symbol',
            dataIndex: 'symbolLabel',
            key: 'symbol',
            width: '40%',
            sorter: (a, b) => a.symbol.localeCompare(b.symbol),
            sortDirections: [
                'descend', 'ascend'
            ],
            searchColumnKey: "symbol",
        }, {
            title: 'Exchange',
            dataIndex: 'exchange',
            width: '40%',
            key: 'exchange',
            // ...getColumnSearchProps('exchange'),
            sorter: (a, b) => a.exchange.localeCompare(b.exchange),
            sortDirections: [
                'descend', 'ascend'
            ],

            filters: enabledExchanges?.map(exchange => ({text: exchange, value: exchange}))
        }, {
            title: 'Enabled',
            dataIndex: 'enabledLabel',
            key: 'enabled',
            width: '20%',
            filters: [
                {
                    text: "Disabled",
                    value: false
                }, {
                    text: "Enabled",
                    value: true
                },
            ],
            // ... getColumnSearchProps('enabledLabel'),
            sorter: (a, b) => (a.enabled && 1) - (b.enabled && 1),
            sortDirections: ['descend', 'ascend']
        },
    ];
    function filterData(tableParams, data) {
        return data.filter((item) => {
            if (tableParams?.filters?.symbol && tableParams?.filters?.symbol?.every(symbol => {
            return !item.symbol.replace("/", "").replace(":", "").toLowerCase().includes(symbol.toLowerCase())
        })) {
            return false;
        }
        if (tableParams?.filters?.exchange && tableParams?.filters?.exchange?.every(exchange => (item.exchange!==exchange))) {
            return false;
        }
        if (tableParams?.filters?.enabled && !tableParams?.filters?.enabled?.includes(item.enabled)) {
            return false;
        }
        return true;
    })
}
    return (
        <AntTable onFilterChange={filterData} columns={columns} data={preSorteddata} />
    );
};

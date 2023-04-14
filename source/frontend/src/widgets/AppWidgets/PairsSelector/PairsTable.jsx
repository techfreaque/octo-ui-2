import {SearchOutlined} from '@ant-design/icons';
import {
    Button,
    Input,
    Space,
    Switch,
    Table
} from 'antd';
import {useEffect, useRef, useState} from 'react';
import {useExchangeInfoContext, useFetchExchangeInfo} from '../../../context/data/BotExchangeInfoProvider';
import {useIsBotOnlineContext} from '../../../context/data/IsBotOnlineProvider';
import {useBotDomainContext} from '../../../context/config/BotDomainProvider';
import {useUpdateVisibleExchangesContext} from '../../../context/config/VisibleExchangesProvider';
import {useUpdateVisiblePairsContext, useVisiblePairsContext} from '../../../context/config/VisiblePairProvider';
import {useVisibleExchangesContext} from '../../../context/config/VisibleExchangesProvider';
import "./pairsTable.css"

export function PairsTable({currencySettings}) {
    const exchangeInfo = useExchangeInfoContext()
    const isOnline = useIsBotOnlineContext()
    const botDomain = useBotDomainContext()
    const setVisibleExchanges = useUpdateVisibleExchangesContext();
    const visibleExchanges = useVisibleExchangesContext();
    const setVisiblePairs = useUpdateVisiblePairsContext();
    const visiblePairs = useVisiblePairsContext();

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
    currencySettings && Object.keys(currencySettings).forEach(currency => {
        pairsData.push(...currencySettings[currency]?.pairs)
    })
    const data = []
    const enabledExchanges = exchangeInfo?.symbols_by_exchanges && Object.keys(exchangeInfo.symbols_by_exchanges)
    enabledExchanges?.forEach(exchange => {
        exchangeInfo.symbols_by_exchanges[exchange].forEach(symbol => {
            const isEnabled = pairsData.includes(symbol)
            const isSelected = visibleExchanges ===exchange && visiblePairs === symbol.replace("/", "|")
            data.push({
                key: symbol,
                exchange: exchange,
                symbolLabel: (isEnabled && ! isSelected) ? (
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
                    <Switch checked={isEnabled}></Switch>
                ),
                enabled: isEnabled,
                selected: isSelected
            })

        })
    })
    // pre sort by enabled and symbol
    data?.sort((a, b) => {
        return(+ b?.enabled) - (+ a?.enabled) || a.symbol.localeCompare(b.symbol)
        // if ((+b?.enabled) - (+a?.enabled))
        // {
        //     return (+b?.enabled) - (+a?.enabled)
        // } else if ((typeof a.symbol === 'string' || a.symbol instanceof String) && (typeof b.symbol === 'string' || b.symbol instanceof String)) {
        //     return a.symbol.localeCompare(b.symbol)
        // } else {
        //     return 0
        // }

    });
    // eslint-disable-next-line
    const [searchText, setSearchText] = useState('');
    // eslint-disable-next-line
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: (
            {
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
                close
            }
        ) => (
            <FilterDrowdown selectedKeys={selectedKeys}
                confirm={confirm}
                clearFilters={clearFilters}
                setSearchText={setSearchText}
                setSearchedColumn={setSearchedColumn}
                dataIndex={dataIndex}
                searchInput={searchInput}
                setSelectedKeys={setSelectedKeys}
                close={close}/>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={
                {
                    color: filtered ? '#1890ff' : undefined
                }
            }/>
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        // render: (text) => searchedColumn === dataIndex ? (
        //     <Highlighter highlightStyle={
        //             {
        //                 backgroundColor: '#ffc069',
        //                 padding: 0
        //             }
        //         }
        //         searchWords={
        //             [searchText]
        //         }
        //         autoEscape
        //         textToHighlight={
        //             text ? text.toString() : ''
        //         }/>
        // ) : (text)
    });
    const [tableParams, setTableParams] = useState({
        // filters: {
        //     enabled: [true]
        // }
        // pagination: {
        // current: 1,
        // pageSize: 10,
        // },
    });
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({ // pagination,
            filters,
            ...sorter
        });
    };
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
            ...getColumnSearchProps('symbol')
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
    const filteredData = data.filter((item) => {
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
    return (
        <div className='pairs-table' style={{
            //     maxHeight: "calc(100vh - 80px)",
        overflowX: "auto",
        overflowY: "auto",
            maxWidth: "650px",
            width: "100vw",
                maxHeight: "calc(100vh - 140px)",
        }}>

            <Table columns={columns}
                scroll={{ x: false, y: false }}
                
                style={{
// overflow: "hidden"
            // maxWidth: "650px",
                // maxHeight: "calc(100vh - 80px)",

                }}
            dataSource={filteredData}
            sticky={true}
                onChange={handleTableChange}
                pagination={{ position: ["bottomLeft"] }}
            filters={
                tableParams?.filters
            }/>
        </div>
    );
};


function FilterDrowdown({
    selectedKeys,
    confirm,
    clearFilters,
    setSearchText,
    setSearchedColumn,
    dataIndex,
    searchInput,
    setSelectedKeys,
    close
}) {
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    return (
        <div style={
                {padding: 8}
            }
            onKeyDown={
                (e) => e.stopPropagation()
        }>
            <Input ref={searchInput}
                placeholder={
                    `Search ${dataIndex}`
                }
                value={
                    selectedKeys[0]
                }
                onChange={
                    (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={
                    () => handleSearch(selectedKeys, confirm, dataIndex)
                }
                style={
                    {
                        marginBottom: 8,
                        display: 'block'
                    }
                }/>
            <Space>
                <Button type="primary"
                    onClick={
                        () => handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    icon={
                        (
                            <SearchOutlined/>)
                    }
                    size="small"
                    style={
                        {width: 90}
                }>
                    Search
                </Button>
                <Button onClick={
                        () => clearFilters && handleReset(clearFilters)
                    }
                    size="small"
                    style={
                        {width: 90}
                }>
                    Reset
                </Button>
                <Button type="link" size="small"
                    onClick={
                        () => {
                            confirm({closeDropdown: false});
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }
                }>
                    Filter
                </Button>
                <Button type="link" size="small"
                    onClick={
                        () => {
                            close();
                        }
                }>
                    close
                </Button>
            </Space>
        </div>
    )
}

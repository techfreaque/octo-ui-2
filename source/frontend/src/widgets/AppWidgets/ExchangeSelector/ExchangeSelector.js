import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {useEffect} from "react";
import {useVisibleExchangesContext} from "../../../context/config/VisibleExchangesProvider";
import {useFetchServicesInfo, useServicesInfoContext} from "../../../context/data/BotExchangeInfoProvider";
import AntTable from "../../../components/Tables/AntTable";
import {useIsBotOnlineContext} from "../../../context/data/IsBotOnlineProvider";
import {Input, Space, Switch, Tooltip} from "antd";
import {CheckCircleOutlined, ExclamationCircleOutlined, QuestionCircleOutlined, WarningOutlined} from "@ant-design/icons";
import RadioButtonGroup from "../../../components/Buttons/RadioButtonGroup";
import {Trans} from "react-i18next";
import {useBotColorsContext} from "../../../context/config/BotColorsProvider";

export default function ExchangeSelector() {
    const botDomain = useBotDomainContext();
    const visibleExchanges = useVisibleExchangesContext();
    const isOnline = useIsBotOnlineContext()
    const botColors = useBotColorsContext()
    const servicesInfo = useServicesInfoContext()
    const fetchServicesInfo = useFetchServicesInfo()
    useEffect(() => {
        isOnline && fetchServicesInfo()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline, botDomain])

    const exchangesData = []
    const enabledExchanges = []
    const configExchanges = servicesInfo?.exchanges ? Object.keys(servicesInfo.exchanges) : []
    function addExchangeToTable({
        exchangeName,
        exchangeType,
        enabled = false,
        sandboxed = false,
        apiKey = 'your-api-key-here',
        apiSecret = 'your-api-secret-here',
        apiPassword = 'your-api-password-here',
        configurable,
        hasWebsockets,
        supportedExchangeTypes,
        isTested,
        isTestedSimulated,
        authSuccess
    }) {
        enabled && enabledExchanges.push(exchangeName)
        exchangesData.push({
            exchange: exchangeName,
            exchangeLabel: enabled ? (authSuccess ? (
                <div style={
                    {
                        color: botColors?.success
                    }
                }>
                    <Tooltip title={
                        <Trans
                        i18nKey="exchangeSelector.exchangeAuthenticatedTooltip"/>
                    }>
                        {
                        `${exchangeName} `
                    }
                        <CheckCircleOutlined/>
                    </Tooltip>
                </div>
            ) : (
                <div style={
                    {
                        color: botColors?.error
                    }
                }>
                    <Tooltip title={
                        <Trans
                        i18nKey="exchangeSelector.exchangeNotAuthenticatedTooltip"/>
                    }>
                        {
                        `${exchangeName} `
                    }
                        <ExclamationCircleOutlined/>
                    </Tooltip>
                </div>
            )) : exchangeName,
            key: exchangeName,
            sandboxed: sandboxed,
            apiKey: apiKey,
            enabledLabel: (
                <Switch checked={enabled}></Switch>
            ),
            enabled,
            apiSecret,
            apiPassword,
            exchangeType,
            exchangeTypeLabel: supportedExchangeTypes?.length > 1 ? (
                <RadioButtonGroup menuItems={
                        supportedExchangeTypes?.map((exchangeType) => ({label: exchangeType, key: exchangeType}))
                    }
                    // onChange={handleChange}
                    selected={exchangeType}/>
            ) : exchangeType,
            isTestedExchange: isTested || (isTestedSimulated && "simulation"),
            isTestedExchangeLabel: isTested ? (
                <Tooltip title={
                    <Trans
                    i18nKey="exchangeSelector.isTestedExchangeTooltip"/>
                }>
                    <CheckCircleOutlined/>
                </Tooltip>
            ) : (isTestedSimulated ? (
                <Tooltip title={
                    <Trans
                    i18nKey="exchangeSelector.isTestedExchangeSimulatedTooltip"/>
                }>
                    <ExclamationCircleOutlined/>
                </Tooltip>
            ) : (
                <Tooltip title={
                    <Trans
                    i18nKey="exchangeSelector.isUntestedExchangeTooltip"/>
                }>
                    <QuestionCircleOutlined/>
                </Tooltip>
            )),
            selected: visibleExchanges === exchangeName,
            configurable,
            hasWebsockets,
            authSuccess,
            hasWebsocketsLabel: hasWebsockets ? (
                <CheckCircleOutlined/>) : (
                <WarningOutlined/>)

        })
    };
    configExchanges.forEach(exchange => {
        addExchangeToTable({
            exchangeName: exchange,
            enabled: servicesInfo.exchanges[exchange].enabled,
            sandboxed: servicesInfo.exchanges[exchange].sandboxed,
            apiKey: servicesInfo.exchanges[exchange]["api-key"],
            apiSecret: servicesInfo.exchanges[exchange]["api-secret"],
            apiPassword: servicesInfo.exchanges[exchange]["api-password"],
            isTested: servicesInfo.exchanges[exchange].is_tested,
            isTestedSimulated: servicesInfo.exchanges[exchange].is_tested_simulated,
            exchangeType: servicesInfo.exchanges[exchange]["exchange-type"] || servicesInfo.exchanges[exchange].default_exchange_type,
            configurable: servicesInfo.exchanges[exchange].configurable,
            hasWebsockets: servicesInfo.exchanges[exchange].has_websockets,
            supportedExchangeTypes: servicesInfo.exchanges[exchange].supported_exchange_types,
            authSuccess: servicesInfo.exchanges[exchange].auth_success
        })
    });

    // put enabled ones on top, then config existing ones and others at the bottom
    exchangesData.sort((a, b) => ((+ b?.enabled) - (+ a?.enabled) || a?.exchange?.localeCompare(b?.exchange)));

    return (
        <AntTable onFilterChange={filterData}
            columns={columns}
            // maxWidth="950px"
            expandable={
                {
                    expandedRowRender: (record) => (
                        (
                            <p style={
                                {margin: 0}
                            }>
                                <Space direction="vertical">

                                    <Input addonBefore="API Key"
                                        value={
                                            record?.apiKey
                                        }
                                        // defaultValue="mysite"
                                    />
                                    <Input addonBefore="API Secret"
                                        value={
                                            record?.apiSecret
                                        }
                                        // defaultValue="mysite"
                                    />
                                    <Input addonBefore="API Password"
                                        value={
                                            record?.apiPassword
                                        }
                                        // defaultValue="mysite"
                                    />
                                </Space>
                            </p>
                        )
                    ),
                    rowExpandable: (record) => (true)
                }
            }
            data={exchangesData}/>
    );
}

const columns = [
    {
        title: 'Exchange',
        dataIndex: 'exchangeLabel',
        // width: '40%',
        key: 'exchange',
        // ...getColumnSearchProps('exchange'),
        sorter: (a, b) => a.exchange.localeCompare(b.exchange),
        sortDirections: [
            'descend', 'ascend'
        ],
        // filters: enabledExchanges?.map(exchange => ({text: exchange, value: exchange}))
    }, {
        title: 'Type',
        dataIndex: 'exchangeTypeLabel',
        // width: '15%',
        key: 'exchangeType',
        // ...getColumnSearchProps('exchange'),
        sorter: (a, b) => a?.exchangeType?.localeCompare(b.exchangeType),
        sortDirections: [
            'descend', 'ascend'
        ],
        // filters: enabledExchanges?.map(exchange => ({text: exchange, value: exchange}))
    }, {
        title: 'Enabled',
        dataIndex: 'enabledLabel',
        key: 'enabled',
        // width: '15%',
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
        sorter: (a, b) => {
            return(a.enabled === true ? 1 : (a.enabled === "simulation" ? 0 : -1)) - (b.enabled === true ? 1 : (b.enabled === "simulation" ? 0 : -1))
        },
        sortDirections: ['descend', 'ascend']
    },
    // {
    //     title: 'Has Websockets',
    //     dataIndex: 'hasWebsocketsLabel',
    //     key: "hasWebsockets",
    //     width: '15%',
    //     filters: [
    //         {
    //             text: "Rest API only",
    //             value: false
    //         }, {
    //             text: "Has Websockets",
    //             value: true
    //         },
    //     ],
    //     // ... getColumnSearchProps('enabledLabel'),
    //     sorter: (a, b) => (a.hasWebsockets ? 1 : 0) - (b.hasWebsockets ? 1 : 0),
    //     sortDirections: ['descend', 'ascend']
    //     // filters: enabledExchanges?.map(exchange => ({text: exchange, value: exchange}))
    // },
    {
        title: 'Tested',
        dataIndex: 'isTestedExchangeLabel',
        key: 'isTestedExchange',
        width: '15%',
        filters: [
            {
                text: "Untested",
                value: false
            }, {
                text: "Fully Tested",
                value: true
            }, {
                text: "Tested in Simulation",
                value: "simulation"
            },
        ],
        // ... getColumnSearchProps('enabledLabel'),
        // TODO sorter (also sort by "simulated")
        sorter: (a, b) => (
            (a.isTestedExchange === true ? 1 : 0) - (b.isTestedExchange === true ? 1 : 0) || (a.isTestedExchange === "simulated" ? 1 : 0) - (b.isTestedExchange === "simulated" ? 1 : 0)
        ),
        sortDirections: ['descend', 'ascend']
    },
];
function filterData(tableParams, data) {
    return data.filter((item) => {
        if (tableParams?.filters?.exchange && tableParams?.filters?.exchange?.every(exchange => (item.exchange !== exchange))) {
            return false;
        }
        if (tableParams?.filters?.enabled && ! tableParams?.filters?.enabled?.includes(item.enabled)) {
            return false;
        }
        if (tableParams?.filters?.isTestedSimulationExchange && ! tableParams?.filters?.isTestedSimulationExchange?.includes(item.isTestedSimulationExchange)) {
            return false;
        }
        if (tableParams?.filters?.isTestedExchange && ! tableParams?.filters?.isTestedExchange?.includes(item.isTestedExchange)) {
            return false;
        }
        if (tableParams?.filters?.hasWebsockets && ! tableParams?.filters?.hasWebsockets?.includes(item.hasWebsockets)) {
            return false;
        }
        return true;
    })
}

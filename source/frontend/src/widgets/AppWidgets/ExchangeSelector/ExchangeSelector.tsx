import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useEffect } from "react";
import { useVisibleExchangesContext } from "../../../context/config/VisibleExchangesProvider";
import {
  ExchangeConfigType,
  useFetchExchangesList,
  useHandleExchangeSettingChange,
  useNewConfigExchangesContext,
  useServicesInfoContext,
} from "../../../context/data/BotExchangeInfoProvider";
import AntTable, {
  AntTableColumnType,
  AntTableDataType,
  AntTableExpandableConfig,
} from "../../../components/Tables/AntTable";
import { useIsBotOnlineContext } from "../../../context/data/IsBotOnlineProvider";
import { Input, Space, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import RadioButtonGroup from "../../../components/Buttons/RadioButtonGroup";
import { Trans } from "react-i18next";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import EnablerSwitch from "../../../components/UserInputs/EnablerSwich";

export default function ExchangeSelector() {
  const botDomain = useBotDomainContext();
  const visibleExchanges = useVisibleExchangesContext();
  const isOnline = useIsBotOnlineContext();
  const botColors = useBotColorsContext();
  const servicesInfo = useServicesInfoContext();
  const fetchServicesInfo = useFetchExchangesList();
  const newConfigExchanges = useNewConfigExchangesContext();
  const handleSettingChange = useHandleExchangeSettingChange();
  useEffect(() => {
    isOnline && fetchServicesInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, botDomain]);

  const exchangesData: ExchangeDataType[] = [];
  const enabledExchanges: string[] = [];

  function addExchangeToTable({
    exchangeName,
    exchangeType,
    exchangeConfig,
    enabled = false,
    sandboxed = false,
    apiKey = "your-api-key-here",
    apiSecret = "your-api-secret-here",
    apiPassword = "your-api-password-here",
    configurable,
    hasWebsockets,
    supportedExchangeTypes,
    isTested,
    isTestedSimulated,
    authSuccess,
  }: {
    exchangeName: string;
    exchangeConfig: ExchangeConfigType | undefined;
    exchangeType: string;
    enabled: boolean;
    sandboxed: boolean;
    apiKey: string;
    apiSecret: string;
    apiPassword: string;
    configurable: boolean;
    hasWebsockets: boolean;
    supportedExchangeTypes: ("spot" | "future")[];
    isTested: boolean;
    isTestedSimulated: boolean;
    authSuccess: boolean;
  }) {
    enabled && enabledExchanges.push(exchangeName);
    exchangesData.push({
      exchange: exchangeName,
      exchangeLabel: enabled ? (
        authSuccess ? (
          <div
            style={{
              color: botColors?.success,
            }}
          >
            <Tooltip
              title={
                <Trans i18nKey="exchangeSelector.exchangeAuthenticatedTooltip" />
              }
            >
              {`${exchangeName} `}
              <CheckCircleOutlined />
            </Tooltip>
          </div>
        ) : (
          <div
            style={{
              color: botColors?.error,
            }}
          >
            <Tooltip
              title={
                <Trans i18nKey="exchangeSelector.exchangeNotAuthenticatedTooltip" />
              }
            >
              {`${exchangeName} `}
              <ExclamationCircleOutlined />
            </Tooltip>
          </div>
        )
      ) : (
        exchangeName
      ),
      key: exchangeName,
      id: exchangeName,
      sandboxed,
      sandboxedLabel: (
        <EnablerSwitch
          availableAfterRestart={
            (!sandboxed && exchangeConfig?.sandboxed) || false
          }
          title={exchangeName}
          isEnabled={sandboxed}
          disabledAfterRestart={
            sandboxed && exchangeConfig?.sandboxed === false
          }
          onChange={(value) =>
            handleSettingChange(exchangeName, "sandboxed", value)
          }
        />
      ),
      enabledLabel: (
        <EnablerSwitch
          availableAfterRestart={(!enabled && exchangeConfig?.enabled) || false}
          title={exchangeName}
          isEnabled={enabled}
          disabledAfterRestart={enabled && exchangeConfig?.enabled === false}
          onChange={(value) =>
            handleSettingChange(exchangeName, "enabled", value)
          }
        />
      ),
      enabled,
      apiKey: exchangeConfig?.["api-key"] ? exchangeConfig["api-key"] : apiKey,
      apiSecret: exchangeConfig?.["api-secret"]
        ? exchangeConfig["api-secret"]
        : apiSecret,
      apiPassword: exchangeConfig?.["api-password"]
        ? exchangeConfig["api-password"]
        : apiPassword,
      supportedExchangeTypes,
      exchangeTypeLabel:
        supportedExchangeTypes?.length > 1 ? (
          <RadioButtonGroup
            selected={
              exchangeConfig?.["exchange-type"] !== undefined
                ? exchangeConfig["exchange-type"]
                : exchangeType
            }
            onChange={(value) =>
              handleSettingChange(exchangeName, "exchange-type", value)
            }
            menuItems={supportedExchangeTypes?.map((exchangeType) => ({
              label: exchangeType,
              key: exchangeType,
            }))}
          />
        ) : (
          exchangeType
        ),
      isTestedExchange: isTested
        ? true
        : isTestedSimulated
        ? "simulation"
        : false,
      isTestedExchangeLabel: isTested ? (
        <Tooltip
          title={<Trans i18nKey="exchangeSelector.isTestedExchangeTooltip" />}
        >
          <CheckCircleOutlined />
        </Tooltip>
      ) : isTestedSimulated ? (
        <Tooltip
          title={
            <Trans i18nKey="exchangeSelector.isTestedExchangeSimulatedTooltip" />
          }
        >
          <ExclamationCircleOutlined />
        </Tooltip>
      ) : (
        <Tooltip
          title={<Trans i18nKey="exchangeSelector.isUntestedExchangeTooltip" />}
        >
          <QuestionCircleOutlined />
        </Tooltip>
      ),
      selected: visibleExchanges === exchangeName,
      configurable,
      hasWebsockets,
      authSuccess,
      hasWebsocketsLabel: hasWebsockets ? (
        <Tooltip
          title={<Trans i18nKey="exchangeSelector.hasWebsocketTooltip" />}
        >
          <CheckCircleOutlined />
        </Tooltip>
      ) : (
        <Tooltip
          title={<Trans i18nKey="exchangeSelector.noWebsocketTooltip" />}
        >
          <WarningOutlined />
        </Tooltip>
      ),
    });
  }
  servicesInfo?.exchanges &&
    Object.entries(servicesInfo.exchanges).forEach(
      ([exchangeName, exchange]) => {
        addExchangeToTable({
          exchangeName,
          exchangeConfig: newConfigExchanges?.[exchangeName],
          enabled: exchange.enabled || false,
          sandboxed: exchange.sandboxed || false,
          apiKey: exchange["api-key"] || "",
          apiSecret: exchange["api-secret"] || "",
          apiPassword: exchange["api-password"] || "",
          isTested: exchange.is_tested,
          isTestedSimulated: exchange.is_tested_simulated,
          exchangeType:
            exchange["exchange-type"] || exchange.default_exchange_type,
          configurable: exchange.configurable || false,
          hasWebsockets: exchange.has_websockets,
          supportedExchangeTypes: exchange.supported_exchange_types,
          authSuccess: exchange.auth_success || false,
        });
      }
    );

  // put enabled ones on top, then config existing ones and others at the bottom
  exchangesData.sort(
    (a, b) =>
      +b?.enabled - +a?.enabled || a?.exchange?.localeCompare(b?.exchange)
  );
  const expandable: AntTableExpandableConfig<ExchangeDataType> = {
    expandedRowRender: (record) => (
      <div style={{ margin: 0 }}>
        <Space direction="vertical">
          <Input
            addonBefore="API Key"
            onChange={(event) =>
              handleSettingChange(
                record.exchange,
                "api-key",
                event.target.value
              )
            }
            value={record?.apiKey}
            // defaultValue="mysite"
          />
          <Input
            addonBefore="API Secret"
            onChange={(event) =>
              handleSettingChange(
                record.exchange,
                "api-secret",
                event.target.value
              )
            }
            value={record?.apiSecret}
            // defaultValue="mysite"
          />
          <Input
            addonBefore="API Password"
            onChange={(event) =>
              handleSettingChange(
                record.exchange,
                "api-password",
                event.target.value
              )
            }
            value={record?.apiPassword}
            // defaultValue="mysite"
          />
        </Space>
      </div>
    ),
    rowExpandable: () => true,
  };
  return (
    <AntTable
      columns={columns}
      // maxWidth="950px"
      expandable={expandable}
      data={exchangesData}
    />
  );
}

interface ExchangeDataType extends AntTableDataType {
  exchange: string;
  exchangeLabel: JSX.Element | string;
  sandboxed: boolean;
  sandboxedLabel: JSX.Element;
  enabledLabel: JSX.Element;
  enabled: boolean;
  apiKey: string;
  apiSecret: string;
  apiPassword: string;
  supportedExchangeTypes: ("spot" | "future")[];
  exchangeTypeLabel: JSX.Element | string;
  isTestedExchange: boolean | "simulation";
  isTestedExchangeLabel: JSX.Element;
  selected: boolean;
  configurable: boolean;
  hasWebsockets: boolean;
  authSuccess: boolean;
  hasWebsocketsLabel: JSX.Element;
}

interface ExchangeColumnType extends AntTableColumnType<ExchangeDataType> {}

const columns: ExchangeColumnType[] = [
  {
    title: "Exchange",
    dataIndex: "exchangeLabel",
    width: "18%",
    key: "exchange",
    dsorter: "string",
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Type",
    dataIndex: "exchangeTypeLabel",
    width: "18%",
    key: "supportedExchangeTypes",
    dsorter: "string[]",
    sortDirections: ["descend", "ascend"],
    disableSearch: true,
  },

  {
    title: "Enabled",
    dataIndex: "enabledLabel",
    key: "enabled",
    filters: [
      {
        text: "Disabled",
        value: false,
      },
      {
        text: "Enabled",
        value: true,
      },
    ],
    dsorter: "boolean",
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Has Websocket",
    dataIndex: "hasWebsocketsLabel",
    key: "hasWebsockets",
    width: "15%",
    filters: [
      {
        text: "Rest API only",
        value: false,
      },
      {
        text: "Has Websockets",
        value: true,
      },
    ],
    dsorter: "boolean",
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Tested",
    dataIndex: "isTestedExchangeLabel",
    key: "isTestedExchange",
    filters: [
      {
        text: "Untested",
        value: false,
      },
      {
        text: "Fully Tested",
        value: true,
      },
      {
        text: "Tested in Simulation",
        value: "simulation",
      },
    ],
    // TODO sorter (also sort by "simulated")
    dsorter: (a, b) =>
      (a.isTestedExchange === true ? 1 : 0) -
        (b.isTestedExchange === true ? 1 : 0) ||
      (a.isTestedExchange === "simulation" ? 1 : 0) -
        (b.isTestedExchange === "simulation" ? 1 : 0),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Use Testnet",
    dataIndex: "sandboxedLabel",
    key: "sandboxed",
    filters: [
      {
        text: "Real Exchange",
        value: false,
      },
      {
        text: "Test Net Exchange",
        value: true,
      },
    ],
    dsorter: "boolean",
    sortDirections: ["descend", "ascend"],
  },
];

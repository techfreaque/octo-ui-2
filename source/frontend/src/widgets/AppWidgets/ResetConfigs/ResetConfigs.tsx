import { Button, Card, Popconfirm, Typography } from "antd";
import { useState } from "react";
import { Trans } from "react-i18next";

import { resetStorage, resetTentaclesConfig } from "../../../api/actions";
import createNotification from "../../../components/Notifications/Notification";
import { backendRoutes } from "../../../constants/backendConstants";
import { projectName } from "../../../constants/frontendConstants";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import {
  getEnabledTradingTentaclesList,
  useFetchCurrentTradingTentaclesConfig,
  useSaveTentaclesConfigAndSendAction,
} from "../../../context/config/TentaclesConfigProvider";
import {
  useFetchUiConfig,
  useSaveUiConfig,
} from "../../../context/config/UiConfigProvider";
import {
  useBotInfoContext,
  useIsDemoMode,
} from "../../../context/data/BotInfoProvider";
import { objectKeys } from "../../../helpers/helpers";
import { sendActionCommandToTradingMode } from "../Buttons/SendActionCommandToTradingMode";
import ResetIndividual from "./ResetIndividual";

const { Title } = Typography;

export default function ResetConfigs() {
  const [checkedList, setCheckedList] = useState<CheckedListType>();
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext();
  const saveUiConfig = useSaveUiConfig();
  const fetchCurrentTentaclesConfig = useFetchCurrentTradingTentaclesConfig();
  const tentacles = getEnabledTradingTentaclesList(botInfo);
  const isDemo = useIsDemoMode();

  const fetchConfig = useFetchUiConfig();
  const saveTentaclesConfigAndSendAction = useSaveTentaclesConfigAndSendAction();

  function handleCheckboxClick(key: SorageResetKeyType) {
    setCheckedList((prevCheckedList) => {
      const newCheckedList = {
        ...prevCheckedList,
      };
      newCheckedList[key] = !newCheckedList[key];
      return newCheckedList;
    });
  }

  function toggleSelectAll() {
    setCheckedList((prevCheckedList) => {
      const isAllSelected = objectKeys(storages).every(
        (thisKey) => prevCheckedList?.[thisKey]
      );
      const newSelected: CheckedListType = {};
      if (!isAllSelected) {
        objectKeys(storages).forEach((thisKey) => {
          newSelected[thisKey] = true;
        });
      }
      return newSelected;
    });
  }

  function handleResetUiConfig() {
    setIsResetting(true);
    const success = () => {
      fetchConfig();
      setIsResetting(false);
      createNotification({
        title: `Successfully resetted ${projectName} config`,
      });
    };
    const failed = () => {
      setIsResetting(false);
      createNotification({ title: `Failed to reset ${projectName} config` });
    };
    saveUiConfig(
      {
        backtesting_analysis_settings: {},
        backtesting_run_settings: {},
        bot_ui_layout2: undefined,
        "current-live-id": 1,
        display_settings: {},
        live_analysis_settings: {},
        optimization_campaign: {},
        optimizer_campaigns_to_load: {},
        optimizer_inputs: {},
        optimizer_run_settings: {},
      },
      success,
      failed,
      true
    );
  }

  function handleResetPlotCache() {
    const CLEAR_PLOTTING_CACHE: ClearOlottingCacheType = "clear_plotting_cache";
    function successCallback() {
      setIsResetting(false);
      createNotification({ title: "Successfully cleared plotting cache" });
    }
    function failCallback() {
      setIsResetting(false);
      createNotification({ title: "Failed to reset plotting cache" });
    }
    setIsResetting(true);
    sendActionCommandToTradingMode(
      CLEAR_PLOTTING_CACHE,
      saveTentaclesConfigAndSendAction,
      setIsResetting,
      successCallback,
      failCallback
    );
  }

  function handleResetTentacles() {
    setIsResetting(true);
    resetTentaclesConfig(
      tentacles,
      botDomain,
      setIsResetting,
      fetchCurrentTentaclesConfig
    );
  }
  function handleResetStorage(storagekey: SorageResetKeyType) {
    setIsResetting(true);
    const storage = storages[storagekey];
    resetStorage(
      storage,
      botDomain,
      setIsResetting,
      fetchCurrentTentaclesConfig
    );
  }
  function handleReset() {
    const keysToReset = checkedList ? Object.keys(checkedList) : [];
    if (keysToReset.includes(storages.resetAllUIConfig.key)) {
      handleResetUiConfig();
    }
    if (keysToReset.includes(storages.resetTradingModePlottingCache.key)) {
      handleResetPlotCache();
    }
    if (keysToReset.includes(storages.resetTradingmodeSettings.key)) {
      handleResetTentacles();
    }
    if (keysToReset.includes(storages.resetPortfolioHistory.key)) {
      handleResetStorage(storages.resetPortfolioHistory.key);
    }
    if (keysToReset.includes(storages.resetOrdersHistory.key)) {
      handleResetStorage(storages.resetOrdersHistory.key);
    }
    if (keysToReset.includes(storages.resetTradesHistory.key)) {
      handleResetStorage(storages.resetTradesHistory.key);
    }
    if (keysToReset.includes(storages.resetTransactionsHistory.key)) {
      handleResetStorage(storages.resetTransactionsHistory.key);
    }
  }
  const [open, setOpen] = useState(false);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const showPopconfirm = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      handleReset();
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const storages: ResetDataType = getResetData(tentacles);
  return (
    <div
      style={{
        margin: "25px",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "600px",
      }}
    >
      <Card>
        <Title>Reset data and configuration</Title>
        {objectKeys(storages).map((storageKey) => (
          <ResetIndividual
            title={storages[storageKey].title}
            key={storages[storageKey].key}
            titleKey={storages[storageKey].key}
            description={storages[storageKey].description}
            handleCheckboxClick={handleCheckboxClick}
            checkedList={checkedList}
          />
        ))}

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "right",
          }}
        >
          <Button onClick={toggleSelectAll} danger>
            <Trans i18nKey="resetConfigs.select_all" />
          </Button>

          <Popconfirm
            title={<Trans i18nKey="resetConfigs.warning_title" />}
            description={<Trans i18nKey="resetConfigs.warning" />}
            open={open}
            onConfirm={handleOk}
            okButtonProps={{
              loading: confirmLoading,
            }}
            onCancel={handleCancel}
          >
            <Button
              disabled={
                isDemo ||
                isResetting ||
                !(
                  checkedList &&
                  Object.values(checkedList).find((value) => value)
                )
              }
              onClick={showPopconfirm}
              type="primary"
              danger
              style={{ marginLeft: "10px" }}
            >
              <Trans i18nKey="resetConfigs.Selected" />
            </Button>
          </Popconfirm>
        </div>
      </Card>
    </div>
  );
}

export type CheckedListType = {
  [key in SorageResetKeyType]?: boolean;
};

export type ClearOlottingCacheType = "clear_plotting_cache";

export type SorageResetKeyType =
  | "resetAllUIConfig"
  | "resetTradingModePlottingCache"
  | "resetTradingmodeSettings"
  | "resetPortfolioHistory"
  | "resetOrdersHistory"
  | "resetTradesHistory"
  | "resetTransactionsHistory";

export interface ResetDataStorageInfoType {
  key: SorageResetKeyType;
  title: string;
  description: JSX.Element | string;
  api?: string;
}

type ResetDataType = {
  [key in SorageResetKeyType]: ResetDataStorageInfoType;
};

function getResetData(tentacles: string[]): ResetDataType {
  return {
    resetAllUIConfig: {
      key: "resetAllUIConfig",
      title: `Reset all ${projectName} Settings`,
      description: (
        <>
          Resets the following settings:
          <ul>
            <li>Backtesting Settings</li>
            <li>Optimizer Settings</li>
            <li>Trading Analysis Settings</li>
            <li>Display Settings</li>
            <li>Page Builder Page Layout</li>
          </ul>
        </>
      ),
    },
    resetTradingModePlottingCache: {
      key: "resetTradingModePlottingCache",
      title: "Reset trading mode plotting cache",
      description:
        "Resets the plotting cache for thiplotting cacheall tentacles settings",
    },
    resetTradingmodeSettings: {
      key: "resetTradingmodeSettings",
      title: "Reset current trading mode settings",
      description: (
        <>
          Resets the following tentacle settings to the defaults:
          <ul>
            {tentacles.map((tentacle) => (
              <li key={tentacle}>{tentacle}</li>
            ))}
          </ul>
        </>
      ),
    },
    resetPortfolioHistory: {
      key: "resetPortfolioHistory",
      title: "Reset the Portfolio History",
      description: "Resets the portfolio history",
      api: backendRoutes.clearPortfolioHistory,
    },
    resetOrdersHistory: {
      key: "resetOrdersHistory",
      title: "Reset the Orders History",
      description: "Resets the orders history",
      api: backendRoutes.clearOrdersHistory,
    },
    resetTradesHistory: {
      key: "resetTradesHistory",
      title: "Reset the Trades History",
      description: "Resets the trades history",
      api: backendRoutes.clearTradesHistory,
    },
    resetTransactionsHistory: {
      key: "resetTransactionsHistory",
      title: "Reset the Transactions History",
      description: "Resets the transactions history",
      api: backendRoutes.clearTransactionsHistory,
    },
  };
}

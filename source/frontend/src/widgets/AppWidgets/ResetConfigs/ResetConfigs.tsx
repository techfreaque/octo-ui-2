import { Button, Card, Popconfirm, Typography } from "antd";
import { t } from "i18next";
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
        title: t("resetConfigs.successfully-resetted-projectname-config", {
          projectName,
        }),
      });
    };
    const failed = () => {
      setIsResetting(false);
      createNotification({
        title: t("resetConfigs.failed-to-reset-projectname-config", {
          projectName,
        }),
      });
    };
    saveUiConfig(
      {
        backtesting_run_settings: {},
        bot_ui_layout2: undefined,
        "current-live-id": 1,
        display_settings: {},
        optimization_campaign: {},
        optimizer_campaigns_to_load: {},
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
      createNotification({
        title: t("resetConfigs.successfully-cleared-plotting-cache"),
      });
    }
    function failCallback() {
      setIsResetting(false);
      createNotification({
        title: t("resetConfigs.failed-to-reset-plotting-cache"),
      });
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
        <Title>
          <Trans i18nKey="resetConfigs.reset-data-and-configuration" />
        </Title>
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
      title: t("resetConfigs.reset-all-projectname-settings", { projectName }),
      description: (
        <>
          <Trans i18nKey="resetConfigs.resets-the-following-settings" />
          <ul>
            <li>
              <Trans i18nKey="resetConfigs.backtesting-settings" />
            </li>
            <li>
              <Trans i18nKey="resetConfigs.optimizer-settings" />
            </li>
            <li>
              <Trans i18nKey="resetConfigs.trading-analysis-settings" />
            </li>
            <li>
              <Trans i18nKey="resetConfigs.display-settings" />
            </li>
            <li>
              <Trans i18nKey="resetConfigs.page-builder-page-layout" />
            </li>
          </ul>
        </>
      ),
    },
    resetTradingModePlottingCache: {
      key: "resetTradingModePlottingCache",
      title: t("resetConfigs.reset-trading-mode-plotting-cache"),
      description: t(
        "resetConfigs.resets-the-plotting-cache-for-all-tentacles-settings"
      ),
    },
    resetTradingmodeSettings: {
      key: "resetTradingmodeSettings",
      title: t("resetConfigs.reset-current-trading-mode-settings"),
      description: (
        <>
          <Trans i18nKey="resetConfigs.resets-the-following-tentacle-settings-to-the-defaults" />
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
      title: t("resetConfigs.reset-the-portfolio-history"),
      description: t("resetConfigs.resets-the-portfolio-history"),
      api: backendRoutes.clearPortfolioHistory,
    },
    resetOrdersHistory: {
      key: "resetOrdersHistory",
      title: t("resetConfigs.reset-the-orders-history"),
      description: t("resetConfigs.resets-the-orders-history"),
      api: backendRoutes.clearOrdersHistory,
    },
    resetTradesHistory: {
      key: "resetTradesHistory",
      title: t("resetConfigs.reset-the-trades-history"),
      description: t("resetConfigs.resets-the-trades-history"),
      api: backendRoutes.clearTradesHistory,
    },
    resetTransactionsHistory: {
      key: "resetTransactionsHistory",
      title: t("resetConfigs.reset-the-transactions-history"),
      description: t("resetConfigs.resets-the-transactions-history"),
      api: backendRoutes.clearTransactionsHistory,
    },
  };
}

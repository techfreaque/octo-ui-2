import "./AppCards/appRatingStyle.css";

import { BranchesOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { t } from "i18next";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Trans } from "react-i18next";

import AntSidebar, {
  AntSideBarMenutItemType,
} from "../../../components/Sidebars/AntSidebar/AntSidebar";
import {
  tentacleConfigTypes,
  useFetchCurrentTradingTentaclesConfig,
  useTentaclesConfigContext,
} from "../../../context/config/TentaclesConfigProvider";
import {
  AppStoreAppType,
  StoreCategoryType,
  useAppStoreDataContext,
  useAppStoreUserContext,
  useFetchAppStoreData,
} from "../../../context/data/AppStoreDataProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import { useUpdateHiddenBacktestingMetadataColumnsContext } from "../../../context/data/BotPlottedElementsProvider";
import { objectKeys } from "../../../helpers/helpers";
import BuildingBlocksSidebar from "../Configuration/StrategyFlowBuilder/BuildingBlocksSideBar";
import StrategyFlowBuilder from "../Configuration/StrategyFlowBuilder/StrategyFlowBuilder";
import {
  displayStyles,
  generateTradingConfigTabs,
  replaceUppercaseWithSpace,
  strategyFlowMakerName,
  TentacleConfigTabsData,
} from "../Configuration/TentaclesConfig";
import ProfileAvatar from "../Stats/ProfileAvatar";
import AppList from "./AppList";
import {
  appPackagesName,
  hiddenCategories,
  strategyModeName,
  strategyModeSettingsName,
  StrategyModeSettingsNameType,
  strategyName,
} from "./storeConstants";

export default function AppStore() {
  const appStoreData = useAppStoreDataContext();
  const botInfo = useBotInfoContext();
  const appStoreUser = useAppStoreUserContext();
  const isLoggedIn = Boolean(appStoreUser?.token);
  const [selectedCategories, setSelectedCategories] = useState<
    StoreCategoryType | StrategyModeSettingsNameType
  >();
  const [tradingConfigTabs, setTradingConfigTabs] = useState<
    TentacleConfigTabsData[]
  >();
  const _useFetchAppStoreData = useFetchAppStoreData();
  const fetchCurrentTentaclesConfig = useFetchCurrentTradingTentaclesConfig();
  useEffect(() => {
    _useFetchAppStoreData();
    fetchCurrentTentaclesConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botInfo, isLoggedIn]);
  const currentTentaclesConfig = useTentaclesConfigContext();
  const setHiddenMetadataColumns = useUpdateHiddenBacktestingMetadataColumnsContext();
  const currentTentaclesTradingConfig =
    currentTentaclesConfig?.[tentacleConfigTypes.tradingTentacles];
  const isFlowMode = botInfo?.trading_mode_name === strategyFlowMakerName;
  useEffect(() => {
    if (currentTentaclesTradingConfig && !isFlowMode) {
      setTradingConfigTabs(
        generateTradingConfigTabs({
          displayStyle: displayStyles.sidebar,
          userInputs: currentTentaclesTradingConfig,
          setHiddenMetadataColumns,
          storageName: "tradingConfig",
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTentaclesTradingConfig, isFlowMode]);

  return useMemo(() => {
    const currentStrategyPackageId =
      appStoreData?.Strategy &&
      Object.keys(appStoreData.Strategy).find(
        (strategy) => appStoreData.Strategy?.[strategy]?.is_selected
      );
    const currentStrategy:
      | AppStoreAppType
      | undefined = currentStrategyPackageId
      ? appStoreData.Strategy?.[currentStrategyPackageId]
      : undefined;
    const availableCategories: StoreCategoryType[] = appStoreData
      ? objectKeys(appStoreData)?.filter(
          (category) => !hiddenCategories.includes(category)
        )
      : [];
    const content = (
      <AppList
        selectedCategories={selectedCategories}
        currentStrategy={currentStrategy}
        setSelectedCategories={setSelectedCategories}
        appStoreData={appStoreData}
      />
    );
    const menuItems: AntSideBarMenutItemType[] = [
      ...(availableCategories
        ?.filter(
          (category) =>
            category === strategyName || category === strategyModeName
        )
        ?.map((categoryName) => {
          if (categoryName === strategyName) {
            return {
              title: `${botInfo?.current_profile?.profile?.name}`,
              key: categoryName,
              content,
              icon: <ProfileAvatar marginRight="5px" />,
            };
          } else if (categoryName === strategyModeName) {
            return {
              title: categoryName,
              key: categoryName,
              content,
              icon: <BranchesOutlined style={{ fontSize: "21px" }} />,
            };
          } else {
            return { title: categoryName, content, key: categoryName };
          }
        }) || []),
      {
        title: isFlowMode
          ? replaceUppercaseWithSpace(botInfo.trading_mode_name)
          : strategyModeSettingsName,
        key: isFlowMode ? botInfo.trading_mode_name : strategyModeSettingsName,
        antIcon: "RocketOutlined",
        dontScroll: true,
        noPadding: true,
        content: isFlowMode ? (
          <StrategyFlowBuilder tradingModeKey={strategyFlowMakerName} />
        ) : (
          <Typography.Title
            style={{
              marginLeft: "15px",
              marginTop: "20px",
            }}
          >
            <Trans i18nKey="strategyConfigurator.select-a-setting-category-from-the-sidebar" />
          </Typography.Title>
        ),
        items: isFlowMode
          ? [
              {
                title: <BuildingBlocksSidebar />,
                key: "flowModeSidebar",
                content: <></>,
              },
            ]
          : [...(tradingConfigTabs || [])],
      },
      {
        title: t("strategyConfigurator.other-apps"),
        key: "other_apps",
        antIcon: "AppstoreAddOutlined",
        dontScroll: true,
        noPadding: true,
        content: (
          <Typography.Title
            style={{
              marginLeft: "15px",
              marginTop: "20px",
            }}
          >
            <Trans i18nKey="strategyConfigurator.select-a-app-category-from-the-sidebar" />
          </Typography.Title>
        ),
        items: availableCategories
          ?.filter(
            (category) =>
              category !== strategyName &&
              category !== strategyModeName &&
              category !== appPackagesName
          )
          ?.map((categoryName) => ({
            title: categoryName,
            content,
            key: categoryName,
          })),
      },
    ];
    return (
      <AntSidebar
        menuItems={menuItems}
        currentlySelectedMenu={selectedCategories as string | undefined}
        defaultSelected={
          (botInfo?.trading_mode_name &&
          currentTentaclesTradingConfig?.[botInfo.trading_mode_name]
            ? botInfo.trading_mode_name
            : botInfo?.trading_mode_name) || strategyModeSettingsName
        }
        setCurrentlySelectedMenu={
          setSelectedCategories as Dispatch<SetStateAction<string | undefined>>
        }
      />
    );
  }, [
    appStoreData,
    botInfo?.current_profile?.profile?.name,
    botInfo?.trading_mode_name,
    currentTentaclesTradingConfig,
    isFlowMode,
    selectedCategories,
    tradingConfigTabs,
  ]);
}

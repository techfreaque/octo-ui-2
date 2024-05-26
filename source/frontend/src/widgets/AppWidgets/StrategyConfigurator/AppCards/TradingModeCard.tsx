import type { Dispatch, SetStateAction } from "react";

import { updateConfig, updateProfileInfo } from "../../../../api/actions";
import createNotification from "../../../../components/Notifications/Notification";
import { useBotDomainContext } from "../../../../context/config/BotDomainProvider";
import type {
  AppStoreAppType,
  StoreCategoryType,
  StrategyModeCategoryType,
} from "../../../../context/data/AppStoreDataProvider";
import type { ExchangeConfigUpdateType } from "../../../../context/data/BotExchangeInfoProvider";
import { useBotInfoContext } from "../../../../context/data/BotInfoProvider";
import { useRestartBot } from "../../../../context/data/IsBotOnlineProvider";
import type { ProfileInfoUpdateType } from "../../Modals/ProfileModal/ProfileModalButton";
import type {
  StrategyModeSettingsNameType} from "../storeConstants";
import {
  strategyModeSettingsName
} from "../storeConstants";
import type { DownloadInfo, UploadInfo } from "./AppCard";
import OtherAppCard from "./OtherAppCard";

export default function TradingModeCard({
  app,
  setMouseHover,
  category,
  isMouseHover,
  setIsloading,
  setSelectedCategories,
  currentStrategy,
  apps,
  didHoverOnce,
  uploadInfo,
  setUploadInfo,
  downloadInfo,
  setDownloadInfo,
}: {
  app: AppStoreAppType;
  setMouseHover: Dispatch<SetStateAction<boolean>>;
  category: StrategyModeCategoryType;
  isMouseHover: boolean;
  setIsloading: Dispatch<SetStateAction<boolean>>;
  setSelectedCategories: Dispatch<
    SetStateAction<StoreCategoryType | StrategyModeSettingsNameType | undefined>
  >;
  currentStrategy: AppStoreAppType | undefined;
  apps: AppStoreAppType[];
  didHoverOnce: boolean;
  uploadInfo: UploadInfo;
  setUploadInfo: Dispatch<SetStateAction<UploadInfo>>;
  downloadInfo: DownloadInfo;
  setDownloadInfo: Dispatch<SetStateAction<DownloadInfo>>;
}): JSX.Element {
  const botInfo = useBotInfoContext();
  const restartBot = useRestartBot();
  const botDomain = useBotDomainContext();

  const currentSelectedApp = apps.find((app) => app.is_selected);
  const newlySelectedRequirements = app?.requirements;
  if (botInfo) {
    const handleSelectStrategyMode = async (setClosed: () => void) => {
      function onFail() {
        createNotification({
          title: "Failed to select trading mode",
          type: "danger",
          message: `Not able to select ${app.title}`,
        });
      }
      function onSuccessSetRequirements() {
        createNotification({
          title: `Successfully selected ${app.title}`,
        });
        setClosed();
        restartBot(true);
      }
      const onSuccessSelection = () => {
        const profileUpdate: ProfileInfoUpdateType = {
          id: botInfo.current_profile.profile.id,
          required_trading_tentacles: [
            app.package_id,
            ...(newlySelectedRequirements || []),
          ],
        };
        updateProfileInfo(
          botDomain,
          profileUpdate,
          onFail,
          onSuccessSetRequirements
        );
      };
      setIsloading(true);
      const configUpdate: ExchangeConfigUpdateType & {
        trading_config: {
          [key: string]: "false" | "true";
        };
        evaluator_config: {
          [key: string]: boolean;
        };
      } = {
        trading_config: {},
        evaluator_config: {},
        global_config: {},
        removed_elements: [],
        restart_after_save: false,
      };
      // disable previous apps
      if (currentSelectedApp) {
        configUpdate.trading_config[currentSelectedApp.package_id] = "false";
        if (currentSelectedApp?.requirements?.length) {
          currentSelectedApp.requirements.forEach(
            (requirement) =>
              (configUpdate.evaluator_config[requirement] = false)
          );
        }
      }
      // enable selected apps
      configUpdate.trading_config[app.package_id] = "true";
      if (newlySelectedRequirements?.length) {
        newlySelectedRequirements.forEach(
          (requirement) => (configUpdate.evaluator_config[requirement] = true)
        );
      }
      await updateConfig(
        botDomain,
        configUpdate,
        botInfo.current_profile.profile.name,
        onFail,
        () => onSuccessSelection()
      );
      setIsloading(false);
      setClosed();
    };
    return (
      <OtherAppCard
        app={app}
        setIsloading={setIsloading}
        setMouseHover={setMouseHover}
        category={category}
        didHoverOnce={didHoverOnce}
        isMouseHover={isMouseHover}
        onConfigure={() => setSelectedCategories(strategyModeSettingsName)}
        handleSelect={handleSelectStrategyMode}
        isReadOnlyStrategy={currentStrategy?.is_from_store}
        uploadInfo={uploadInfo}
        setUploadInfo={setUploadInfo}
        downloadInfo={downloadInfo}
        setDownloadInfo={setDownloadInfo}
      />
    );
  }
  return <></>;
}

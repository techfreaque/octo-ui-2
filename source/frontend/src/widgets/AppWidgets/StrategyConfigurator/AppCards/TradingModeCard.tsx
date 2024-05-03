import { useBotDomainContext } from "../../../../context/config/BotDomainProvider";
import { useBotInfoContext } from "../../../../context/data/BotInfoProvider";
import { updateConfig, updateProfileInfo } from "../../../../api/actions";
import createNotification from "../../../../components/Notifications/Notification";
import { useRestartBot } from "../../../../context/data/IsBotOnlineProvider";
import OtherAppCard from "./OtherAppCard";
import { strategyModeSettingsName } from "../storeConstants";
import {
  AppStoreAppType,
  StoreCategoryType,
  StrategyModeCategoryType,
} from "../../../../context/data/AppStoreDataProvider";
import { Dispatch, SetStateAction } from "react";
import { DownloadInfo, UploadInfo } from "./AppCard";

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
    SetStateAction<StoreCategoryType | undefined>
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

  const selectedApps = apps.filter((app) => app.is_selected);
  const newlySelectedRequirements = app?.requirements;

  async function handleSelectStrategyMode(setClosed: () => void) {
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
    function onSuccessSelection() {
      updateProfileInfo(
        botDomain,
        {
          id: botInfo?.current_profile.profile.id,
          required_trading_tentacles: [
            app.package_id,
            ...(newlySelectedRequirements || []),
          ],
        },
        onFail,
        () => onSuccessSetRequirements()
      );
    }
    setIsloading(true);
    const configUpdate = {
      trading_config: {},
      evaluator_config: {},
      global_config: {},
      removed_elements: [],
      restart_after_save: false,
    };
    // disable previous apps
    if (selectedApps?.[0]) {
      configUpdate.trading_config[selectedApps?.[0].package_id] = "false";
      if (selectedApps?.[0]?.requirements?.length) {
        selectedApps[0].requirements.forEach(
          (requirement) => (configUpdate.evaluator_config[requirement] = false)
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
      botInfo?.current_profile.profile.name,
      onFail,
      () => onSuccessSelection()
    );
    setIsloading(false);
    setClosed();
  }
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

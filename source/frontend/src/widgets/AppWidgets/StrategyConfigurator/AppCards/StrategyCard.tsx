import {
  deleteProfile,
  duplicateProfile,
  selectProfile,
} from "../../../../api/actions";
import { useBotDomainContext } from "../../../../context/config/BotDomainProvider";
import { useBotInfoContext } from "../../../../context/data/BotInfoProvider";
import AppActions from "./AppActions/AppActions";
import { backendRoutes } from "../../../../constants/backendConstants";
import {
  AppStoreAppType,
  StoreCategoryType,
  StrategyCategoryType,
  useInstallAnyAppPackage,
  useUploadToAppStore,
} from "../../../../context/data/AppStoreDataProvider";
import { Dispatch, SetStateAction, useState } from "react";
import ProfileModalButton from "../../Modals/ProfileModal/ProfileModalButton";
import AppCardTemplate from "./AppCardTemplate";
import { useRestartBot } from "../../../../context/data/IsBotOnlineProvider";
import createNotification from "../../../../components/Notifications/Notification";
import {
  StrategyModeSettingsNameType,
  strategyModeName,
} from "../storeConstants";
import { CleanDescription } from "./AppDescription";
import { DownloadInfo, UploadInfo, VerifiedDownloadInfo } from "./AppCard";
import { CloneAppInfoType } from "./AppActions/CloneApp/CloneAppForm";

export default function StrategyCard({
  app,
  setMouseHover,
  category,
  isMouseHover,
  setIsloading,
  setSelectedCategories,
  didHoverOnce,
  uploadInfo,
  setUploadInfo,
  downloadInfo,
  setDownloadInfo,
}: {
  app: AppStoreAppType;
  setMouseHover: Dispatch<SetStateAction<boolean>>;
  category: StrategyCategoryType;
  isMouseHover: boolean;
  setIsloading: Dispatch<SetStateAction<boolean>>;
  setSelectedCategories: Dispatch<
    SetStateAction<StoreCategoryType | StrategyModeSettingsNameType | undefined>
  >;
  didHoverOnce: boolean;
  uploadInfo: UploadInfo;
  setUploadInfo: Dispatch<SetStateAction<UploadInfo>>;
  downloadInfo: DownloadInfo;
  setDownloadInfo: Dispatch<SetStateAction<DownloadInfo>>;
}) {
  const [cloneAppInfo, setCloneAppInfo] = useState<CloneAppInfoType>();
  const botDomain = useBotDomainContext();
  const botInfo = useBotInfoContext();
  const restartBot = useRestartBot();

  async function handleSelectProfile(setOpen: () => void) {
    function onSuccess() {
      setIsloading(false);
      createNotification({
        title: `Successfully selected ${app.title}`,
      });
      setOpen();
      restartBot(true);
    }
    const onFail = () => {
      createNotification({
        title: `Failed to select ${app.title}`,
        type: "danger",
      });
    };
    setIsloading(true);
    await selectProfile(
      botDomain,
      app.package_id,
      app.title,
      onSuccess,
      onFail
    );
  }
  const installAnyAppPackage = useInstallAnyAppPackage();
  function handleDownloadApp(
    setOpen: (isOpen: boolean) => void,
    otherApp?: AppStoreAppType
  ) {
    const theApp: AppStoreAppType = otherApp ? otherApp : app;
    const verifiedDownloadInfo: VerifiedDownloadInfo = {
      appCategory: theApp.categories[0],
      major_version: downloadInfo.major_version || 0,
      minor_version: downloadInfo.minor_version || 0,
      bug_fix_version: downloadInfo.bug_fix_version || 0,
      origin_package: theApp.origin_package,
      appTitle: theApp.title,
      should_select_profile: downloadInfo.should_select_profile || false,
      package_id: theApp.package_id,
    };
    installAnyAppPackage(verifiedDownloadInfo, theApp, setIsloading, setOpen);
  }
  async function handleDeleteProfile(
    setOpen: Dispatch<SetStateAction<boolean>>
  ) {
    setIsloading(true);
    await deleteProfile(
      botDomain,
      app.package_id,
      app.title,
      () => setIsloading(false),
      () => setIsloading(false)
    );
    setOpen(false);
  }
  async function handleProfileDuplication(
    setOpen: Dispatch<SetStateAction<boolean>>
  ) {
    setIsloading(true);
    if (cloneAppInfo?.newProfileName) {
      await duplicateProfile({
        botDomain,
        profileId: app.package_id,
        profileName: app.title,
        newProfileName: cloneAppInfo.newProfileName,
        selectNewProfile: cloneAppInfo.selectNewProfile || false,
        onSuccess: () => setIsloading(false),
        onFail: () => setIsloading(false),
      });
    } else {
      createNotification({
        title: "Failed to duplicate profile",
        type: "danger",
        message: "Some duplication info is missing",
      });
    }
    setOpen(false);
  }
  const profileDownloadUrl =
    botDomain + backendRoutes.exportProfile + app.package_id;
  const uploadToAppStore = useUploadToAppStore();

  const additionalProfileInfo = app.package_id
    ? botInfo?.profiles?.[app.package_id]
    : undefined;

  const currentAvatar = additionalProfileInfo?.profile?.avatar;
  const avatarUrl =
    currentAvatar === "default_profile.png"
      ? `${botDomain + backendRoutes.staticImg}/${currentAvatar}`
      : `${
          botDomain + backendRoutes.profileMedia
        }/${additionalProfileInfo?.profile?.name?.replace(
          / /g,
          "_"
        )}/${currentAvatar}`;

  return (
    <AppCardTemplate
      app={app}
      setMouseHover={setMouseHover}
      avatarUrl={avatarUrl}
      category={category}
      isMouseHover={isMouseHover}
      cardActions={
        <AppActions
          isMouseHover={isMouseHover}
          // configureDuplication={configureDuplication}
          onConfigure={() => setSelectedCategories(strategyModeName)}
          didHoverOnce={didHoverOnce}
          downloadInfo={downloadInfo}
          handleSelect={handleSelectProfile}
          handleUninstall={handleDeleteProfile}
          setCloneAppInfo={setCloneAppInfo}
          cloneAppInfo={cloneAppInfo}
          handleUpload={(setOpen) =>
            uploadToAppStore(
              app,
              uploadInfo,
              profileDownloadUrl,
              setIsloading,
              setOpen
            )
          }
          setUploadInfo={setUploadInfo}
          setDownloadInfo={setDownloadInfo}
          uploadInfo={uploadInfo}
          exportUrl={backendRoutes.exportProfile + app.package_id}
          handleDownload={handleDownloadApp}
          infoContent={
            <div>
              <CleanDescription description={app.description} />
            </div>
          }
          handleDuplication={handleProfileDuplication}
          otherActions={
            additionalProfileInfo ? (
              <ProfileModalButton
                profile={additionalProfileInfo}
                isCurrentProfile={app.is_selected}
              />
            ) : (
              <></>
            )
          }
          app={app}
        />
      }
    />
  );
}

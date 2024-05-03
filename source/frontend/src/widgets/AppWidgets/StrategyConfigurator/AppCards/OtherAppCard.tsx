import AppActions from "./AppActions/AppActions";
import {
  AppStoreAppType,
  StoreCategoryType,
  useInstallAnyAppPackage,
  useUnInstallAppPackage,
  useUploadToAppStore,
} from "../../../../context/data/AppStoreDataProvider";
import { useBotDomainContext } from "../../../../context/config/BotDomainProvider";
import { backendRoutes } from "../../../../constants/backendConstants";
import AppCardTemplate from "./AppCardTemplate";
import { Dispatch, SetStateAction } from "react";
import { DownloadInfo, UploadInfo } from "./AppCard";

export default function OtherAppCard({
  app,
  setMouseHover,
  category,
  isMouseHover,
  setIsloading,
  didHoverOnce,
  onConfigure,
  handleSelect,
  isReadOnlyStrategy,
  uploadInfo,
  setUploadInfo,
  downloadInfo,
  setDownloadInfo,
}: {
  app: AppStoreAppType;
  setMouseHover: Dispatch<SetStateAction<boolean>>;
  category: StoreCategoryType;
  isMouseHover: boolean;
  setIsloading: Dispatch<SetStateAction<boolean>>;
  didHoverOnce: boolean;
  onConfigure?: () => void;
  handleSelect?: (setClosed: () => void) => void;
  isReadOnlyStrategy?: boolean;
  uploadInfo: UploadInfo;
  setUploadInfo: Dispatch<SetStateAction<UploadInfo>>;
  downloadInfo: DownloadInfo;
  setDownloadInfo: Dispatch<SetStateAction<DownloadInfo>>;
}) {
  const botDomain = useBotDomainContext();
  const profileDownloadUrl =
    botDomain + backendRoutes.exportApp + app.origin_package;
  const installAnyAppPackage = useInstallAnyAppPackage();
  async function handleDownloadApp(
    setOpen: (isOpen: boolean) => void,
    otherApp: AppStoreAppType | undefined
  ) {
    const theApp = otherApp
      ? {
          ...otherApp,
          bug_fix_version: 0,
          major_version: 0,
          minor_version: 0,
        }
      : app;
    installAnyAppPackage(downloadInfo, theApp, setIsloading, setOpen);
  }
  const uninstallAppPackage = useUnInstallAppPackage();
  async function handleUninstallApp(
    setOpen: Dispatch<SetStateAction<boolean>>
  ) {
    uninstallAppPackage(app, setIsloading, setOpen);
  }
  const uploadToAppStore = useUploadToAppStore();
  return (
    <AppCardTemplate
      app={app}
      setMouseHover={setMouseHover}
      avatarUrl={
        "https://tradeciety.com/hubfs/Imported_Blog_Media/GBPUSDH45.png"
      }
      category={category}
      isMouseHover={isMouseHover}
      cardActions={
        <AppActions
          isMouseHover={isMouseHover}
          infoContent={app.description}
          handleUninstall={handleUninstallApp}
          isReadOnlyStrategy={isReadOnlyStrategy}
          onConfigure={onConfigure}
          downloadInfo={downloadInfo}
          didHoverOnce={didHoverOnce}
          setDownloadInfo={setDownloadInfo}
          handleDownload={handleDownloadApp}
          handleSelect={handleSelect}
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
          uploadInfo={uploadInfo}
          app={app}
        />
      }
    />
  );
}

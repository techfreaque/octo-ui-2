import { Dispatch, SetStateAction, useEffect, useState } from "react";
import TradingModeCard from "./TradingModeCard";
import StrategyCard from "./StrategyCard";
import { Grid } from "@mui/material";
import OtherAppCard from "./OtherAppCard";
import {
  StrategyModeSettingsNameType,
  strategyModeName,
  strategyName,
} from "../storeConstants";
import {
  AppStoreAppType,
  AppStoreVersionTagType,
  StoreCategoryType,
} from "../../../../context/data/AppStoreDataProvider";

export interface UploadInfo {
  open?: boolean;
  includePackage?: boolean;
  version_type?: AppStoreVersionTagType;
  version_tag?: AppStoreVersionTagType;
  price?: number;
  release_notes?: string;
}

export interface VerifiedUploadInfo {
  includePackage: boolean;
  version_type: AppStoreVersionTagType;
  version_tag: AppStoreVersionTagType;
  price: number;
  release_notes: string;
}
export interface DownloadInfo {
  open?: boolean;
  visibleVersionTypes?: AppStoreVersionTagType[];
  major_version?: number | undefined;
  minor_version?: number | undefined;
  bug_fix_version?: number | undefined;
  versionDetailsOpen?: boolean;
  isDownloading?: boolean;
  origin_package?: string;
  should_select_profile?: boolean;
}
export interface VerifiedDownloadInfo extends DownloadInfo {
  major_version: number;
  minor_version: number;
  bug_fix_version: number;
  origin_package: string;
  appTitle: string;
  appCategory: string;
  should_select_profile: boolean;
  package_id: string;
}

export default function AppCard({
  app,
  apps,
  setIsloading,
  setSelectedCategories,
  currentStrategy,
}: {
  app: AppStoreAppType;
  apps: AppStoreAppType[];
  setIsloading: Dispatch<SetStateAction<boolean>>;
  setSelectedCategories: Dispatch<
    SetStateAction<StoreCategoryType | StrategyModeSettingsNameType | undefined>
  >;
  currentStrategy: AppStoreAppType | undefined;
}) {
  const [isMouseHover, setMouseHover] = useState(false);
  const [didHoverOnce, setDidHoverOnce] = useState(false);
  const [uploadInfo, setUploadInfo] = useState<UploadInfo>({});
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo>({});
  useEffect(() => {
    if (isMouseHover && !didHoverOnce) {
      setDidHoverOnce(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMouseHover]);
  const _isMouseHover =
    isMouseHover || uploadInfo.open || downloadInfo.open || false;
  const category =
    app?.categories?.length > 1 ? "Package" : app?.categories?.[0];
  if (category === strategyModeName) {
    return (
      <SelectedCardContainer app={app}>
        <TradingModeCard
          app={app}
          apps={apps}
          currentStrategy={currentStrategy}
          setMouseHover={setMouseHover}
          category={category}
          didHoverOnce={didHoverOnce}
          setSelectedCategories={setSelectedCategories}
          setIsloading={setIsloading}
          isMouseHover={_isMouseHover}
          uploadInfo={uploadInfo}
          setUploadInfo={setUploadInfo}
          downloadInfo={downloadInfo}
          setDownloadInfo={setDownloadInfo}
        />
      </SelectedCardContainer>
    );
  } else if (category === strategyName) {
    return (
      <SelectedCardContainer app={app}>
        <StrategyCard
          app={app}
          setIsloading={setIsloading}
          setMouseHover={setMouseHover}
          category={category}
          didHoverOnce={didHoverOnce}
          setSelectedCategories={setSelectedCategories}
          isMouseHover={_isMouseHover}
          uploadInfo={uploadInfo}
          setUploadInfo={setUploadInfo}
          downloadInfo={downloadInfo}
          setDownloadInfo={setDownloadInfo}
        />
      </SelectedCardContainer>
    );
  } else {
    return (
      <SelectedCardContainer app={app}>
        <OtherAppCard
          app={app}
          setIsloading={setIsloading}
          setMouseHover={setMouseHover}
          category={category}
          didHoverOnce={didHoverOnce}
          isMouseHover={_isMouseHover}
          uploadInfo={uploadInfo}
          setUploadInfo={setUploadInfo}
          downloadInfo={downloadInfo}
          setDownloadInfo={setDownloadInfo}
        />
      </SelectedCardContainer>
    );
  }
}

function SelectedCardContainer({
  app,
  children,
}: {
  app: AppStoreAppType;
  children: JSX.Element;
}) {
  return app?.is_selected ? (
    <Grid item xs={12}>
      {children}
    </Grid>
  ) : (
    <Grid
      style={{
        margin: "auto",
        height: "100%",
        // maxWidth: "500px"
      }}
      item
      xs={12}
      sm={12}
      md={12}
      lg={6}
      xl={4}
    >
      {children}
    </Grid>
  );
}

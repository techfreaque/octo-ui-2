import { useEffect, useState } from "react";
import TradingModeCard from "./TradingModeCard";
import StrategyCard from "./StrategyCard";
import { Grid } from "@mui/material";
import OtherAppCard from "./OtherAppCard";
import { strategyModeName, strategyName } from "../storeConstants";

interface UploadInfo {
  open?: boolean;
}
interface DownloadInfo {
  open?: boolean;
}

export default function AppCard({
  app,
  apps,
  isLoading,
  setIsloading,
  setSelectedCategories,
  currentStrategy,
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
  const _isMouseHover = isMouseHover || uploadInfo.open || downloadInfo.open;
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
          isLoading={isLoading}
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
          isLoading={isLoading}
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
          isLoading={isLoading}
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
  }
}

function SelectedCardContainer({
  app,
  children,
}: {
  app;
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

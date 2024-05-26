import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Avatar, Tooltip, Typography } from "antd";
import { t } from "i18next";

import { useBotColorsContext } from "../../../../context/config/BotColorsProvider";
import type { AppStoreAppType } from "../../../../context/data/AppStoreDataProvider";
import AppRating from "./AppRating";

export function AppTitle({ title }: { title: string }) {
  return <div> {title}</div>;
}

export function AppAvatar({ avatarImage }: { avatarImage: string }) {
  return avatarImage && <Avatar src={avatarImage} />;
}

export function AppCover({
  app,
  avatarImage,
}: {
  app: AppStoreAppType;
  avatarImage?: string;
}) {
  return app?.is_selected ? (
    <div style={{ display: "flex" }}>
      <Typography.Title
        level={3}
        style={{
          marginLeft: "30px",
          marginTop: "30px",
        }}
      >
        {t('appStore.appCard.current-categoryName', {categoryName: app?.categories[0]})}
      </Typography.Title>
      <AppRating
        rating={app.rating}
        votes={app.votes}
        app={app}
        style={{ padding: "30px 0px 0px 20px" }}
      />
    </div>
  ) : (
    <>
      <div>
        <IsInstalledIndicator app={app} />
      </div>
      {avatarImage && (
        <img alt={app?.title} style={{ width: "99.7%" }} src={avatarImage} />
      )}
    </>
  );
}

export function IsInstalledIcon({ topRight }: { topRight: boolean }) {
  const botColors = useBotColorsContext();
  return (
    <CheckCircleOutlined
      style={{
        ...(topRight
          ? {
              position: "absolute",
              top: "2%",
              right: "2%",
            }
          : {}),
        color: botColors?.success,
      }}
    />
  );
}

export function IsNotInstalledIcon({ topRight }: { topRight: boolean }) {
  const botColors = useBotColorsContext();
  return (
    <CloseCircleOutlined
      style={{
        ...(topRight
          ? {
              position: "absolute",
              top: "2%",
              right: "2%",
            }
          : {}),
        color: botColors?.error,
      }}
    />
  );
}
export function IsInstalledIndicator({
  app,
  topRight = true,
  tooltipText = t("appStore.appCard.installed"),
}: {
  app: AppStoreAppType;
  topRight?: boolean;
  tooltipText?: string;
}) {
  return (
    app?.is_installed && (
      <Tooltip title={tooltipText}>
        <div>
          <IsInstalledIcon topRight={topRight} />
        </div>
      </Tooltip>
    )
  );
}

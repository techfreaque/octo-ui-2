import { Alert, List, Typography } from "antd";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Trans } from "react-i18next";

import { fetchBotLogs } from "../../../api/data";
import AntButton from "../../../components/Buttons/AntButton";
import { backendRoutes } from "../../../constants/backendConstants";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import type {
  NotificationHistoryNotificationsType} from "../../../context/websockets/NotificationsContext";
import {
  useNotificationsHistoryContext,
} from "../../../context/websockets/NotificationsContext";

interface NotificationHistory extends NotificationHistoryNotificationsType {
  Time: Date;
}

export interface BotLogHistory {
  Source: string;
  Time: string;
  Message: string;
  Level: "INFO" | "WARNING" | "ERROR" | undefined;
}

export default function NotificationCenter() {
  const [logHistory, setLogHistory] = useState<BotLogHistory[]>();
  const logWebsocket = useNotificationsHistoryContext();
  const botDomain = useBotDomainContext();
  useEffect(() => {
    fetchBotLogs(setLogHistory, botDomain);
  }, [botDomain]);

  const notificationHistory: NotificationHistory[] = [];
  logWebsocket?.forEach((notificationUpdate) => {
    notificationUpdate?.notifications?.forEach((notification) => {
      notificationHistory.push({
        ...notification,
        Time: notificationUpdate.Time,
      });
    });
  });
  notificationHistory.reverse();
  const _notificationHistory: NotificationHistory[] = notificationHistory?.length
    ? notificationHistory
    : [
        {
          Level: "info",
          Title: t("notificationCenter.no-notifications-yet"),
          Time: new Date(),
          Message: "",
        },
      ];
  return logHistory ? (
    <>
      <Typography.Title level={2}>
        <Trans i18nKey="notificationCenter.botNotifications" />
      </Typography.Title>
      <List
        style={{
          maxHeight: "500px",
          overflowY: "auto",
        }}
        itemLayout="horizontal"
        dataSource={_notificationHistory}
        renderItem={(item: NotificationHistory, index: number) => (
          <Alert
            key={`${item.Title}${item.Time && ` - ${item.Time}`}${index}`}
            message={`${item.Title}${item.Time && ` - ${item.Time}`}`}
            description={item.Message?.split("<br>").map((row) => (
              <div key={row}> {row}</div>
            ))}
            type={(item.Level === "danger" ? "error" : item.Level) || "warning"}
            showIcon
            style={{ marginBottom: "10px" }}
          />
        )}
      />
      <Typography.Title level={2}>
        <Trans i18nKey="notificationCenter.botErrorLog" />
        <span style={{ float: "right" }}>
          <AntButton href={botDomain + backendRoutes.exportLogs}>
            <Trans i18nKey="notificationCenter.export-debug-logs" />
          </AntButton>
        </span>
      </Typography.Title>
      <List
        style={{
          maxHeight: "500px",
          overflowY: "auto",
        }}
        itemLayout="horizontal"
        dataSource={Object.values(logHistory).reverse()}
        renderItem={(item: BotLogHistory, index: number) => (
          <Alert
            message={`${item.Source}${item.Time && ` - ${item.Time}`}`}
            key={`${item.Source}${item.Time && ` - ${item.Time}`}${index}`}
            description={item.Message.split("<br>").map((row) => (
              <div key={row}> {row}</div>
            ))}
            type={
              (item.Level?.toLowerCase() as
                | "info"
                | "success"
                | "warning"
                | "error") || "warning"
            }
            showIcon
            style={{ marginBottom: "10px" }}
          />
        )}
      />
    </>
  ) : (
    <></>
  );
}

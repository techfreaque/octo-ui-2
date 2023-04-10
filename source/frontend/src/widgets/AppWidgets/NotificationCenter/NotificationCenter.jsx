import {Alert, List, Typography} from "antd";
import {useNotificationsHistoryContext} from "../../../context/websockets/NotificationsContext";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {useEffect, useState} from "react";
import {fetchBotLogs} from "../../../api/data";
import {Trans} from "react-i18next";
import AntButton from "../../../components/Buttons/AntButton";
import { backendRoutes } from "../../../constants/backendConstants";


export default function NotificationCenter() {
    const [logHistory, setLogHistory] = useState()
    const logWebsocket = useNotificationsHistoryContext()
    const botDomain = useBotDomainContext()
    useEffect(() => {
        fetchBotLogs(setLogHistory, botDomain)
    }, [botDomain]);

    const notificationHistory = []
    logWebsocket?.forEach(notificationUpdate => {
        notificationUpdate?.notifications?.forEach(notification => {
            notificationHistory.push({
                ...notification,
                Time: notificationUpdate.Time
            })
        })
    })

    return logHistory && (<>
        <Typography.Title level={2}><Trans i18nKey="notificationCenter.botNotifications"/></Typography.Title>
        <List style={
                {
                    maxHeight: "500px",
                    overflowY: "auto"
                }
            }
            itemLayout="horizontal"
            dataSource={notificationHistory}
            renderItem={
              (item, index) => (
                <Alert
                  message={     `${
                                item.Title
                            } - ${
                                item.Time
                            }`}
                  description={item.Message.split("<br>").map(row => (<div> {row}</div>))}
                  type={item.Level}
                  showIcon 
                  style={{marginBottom: "10px"}}
                  />
              )
            }/>
      <Typography.Title level={2}>
        <Trans i18nKey="notificationCenter.botErrorLog" />
        <span style={{float: "right"}}>

      <AntButton href={botDomain + backendRoutes.exportLogs} > Export Logs </AntButton>
        </span>
      </Typography.Title>
        <List style={
                {
                    maxHeight: "500px",
                    overflowY: "auto"
                }
            }
            itemLayout="horizontal"
            dataSource={
                Object.values(logHistory)
            }
            renderItem={
              (item, index) => (
                <Alert
                  message={     `${
                                item.Source
                            }${
                                item.Time && " - " + item.Time
                            }`}
                  description={item.Message.split("<br>").map(row => (<div> {row}</div>))}
                  type={item.Level.toLowerCase()}
                  showIcon 
                  style={{marginBottom: "10px"}} />
                )
            }/>
    </>)
}

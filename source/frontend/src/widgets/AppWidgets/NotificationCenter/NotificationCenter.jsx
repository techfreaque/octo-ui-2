import {Alert, List, Typography} from "antd";
import {useNotificationsHistoryContext} from "../../../context/websockets/NotificationsContext";
import {useBotDomainContext} from "../../../context/config/BotDomainProvider";
import {useEffect, useState} from "react";
import {fetchBotLogs} from "../../../api/data";
import AntButton from "../../../components/Buttons/AntButton";
import {backendRoutes} from "../../../constants/backendConstants";
import {Trans} from "react-i18next";


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
    notificationHistory.reverse()
    return logHistory && (
        <>
            <Typography.Title level={2}><Trans i18nKey="notificationCenter.botNotifications"/></Typography.Title>
            <List style={
                    {
                        maxHeight: "500px",
                        overflowY: "auto"
                    }
                }
                itemLayout="horizontal"
                dataSource={
                    notificationHistory?.length ? notificationHistory : [{
                            Level: "info",
                            Title: "No notifications yet",
                            Time: "",
                            Message: ""
                        }]
                }
                renderItem={
                    (item, index) => (
                        <Alert key={
                                `${
                                    item.Title
                                }${
                                    item.Time && ` - ${
                                        item.Time
                                    }`
                                }${index}`
                            }
                            message={
                                `${
                                    item.Title
                                }${
                                    item.Time && ` - ${
                                        item.Time
                                    }`
                                }`
                            }
                            description={
                                item.Message.split("<br>").map(row => (
                                    <div key={row}> {row}</div>
                                ))
                            }
                            type={
                                item.Level
                            }
                            showIcon
                            style={
                                {marginBottom: "10px"}
                            }/>
                    )
                }/>
            <Typography.Title level={2}>
                <Trans i18nKey="notificationCenter.botErrorLog"/>
                <span style={
                    {float: "right"}
                }>

                    <AntButton href={
                        botDomain + backendRoutes.exportLogs
                    }>
                        Export Debug Logs
                    </AntButton>
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
                        <Alert message={
                                `${
                                    item.Source
                                }${
                                    item.Time && ` - ${
                                        item.Time
                                    }`
                                }`
                            }
                            key={
                                `${
                                    item.Source
                                }${
                                    item.Time && ` - ${
                                        item.Time
                                    }`
                                }${index}`
                            }
                            description={
                                item.Message.split("<br>").map(row => (
                                    <div key={row}> {row}</div>
                                ))
                            }
                            type={
                                item.Level.toLowerCase()
                            }
                            showIcon
                            style={
                                {marginBottom: "10px"}
                            }/>
                    )
                }/>
        </>
    )
}

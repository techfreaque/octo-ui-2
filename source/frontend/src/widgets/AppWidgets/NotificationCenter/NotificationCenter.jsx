import { List } from "antd";
import { useNotificationsHistoryContext } from "../../../context/websockets/NotificationsContext";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";
import { useEffect, useState } from "react";
import { fetchBotLogs } from "../../../api/data";

const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];
  
export default function NotificationCenter() {
    const [logHistory, setLogHistory] = useState()
    const logWebsocket = useNotificationsHistoryContext()
    const botDomain = useBotDomainContext()
useEffect(() => {
    fetchBotLogs(setLogHistory, botDomain)
}, [botDomain]);

    return (<List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={"Error"}
            title={(<a href="https://ant.design">{item.title}</a>)}
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          />
        </List.Item>
      )}
    />)
}
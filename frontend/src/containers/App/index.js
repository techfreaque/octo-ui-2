import React from "react";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import Pages from "../Pages/Pages";
import BotDataProvider from "../../context/BotDataProvider";

import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <BotDataProvider defaultDomain={"http://192.168.18.6:5003"}>
      <ReactNotifications />
      <Pages />
    </BotDataProvider>
  );
}

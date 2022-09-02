import React from "react";
import Pages from "../Pages/Pages";
import BotDataProvider from "../../context/BotDataProvider";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <BotDataProvider>
      <Pages />
    </BotDataProvider>
  );
}

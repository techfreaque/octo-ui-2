import Page from "../Page";
import NotFoundPage from "../NotFoundPage";
import { useBotLayoutContext } from "../../context/BotLayoutProvider";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { backendRoutes } from "../../constants/backendConstants";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "spectre.css/dist/spectre-icons.min.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "../../components/Forms/JsonEditor/JsonEditor.css"

export default function Pages() {
  const botLayout = useBotLayoutContext();
  return (
    <BrowserRouter>
      <ReactNotifications />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr@4.6.3/dist/flatpickr.min.css" />
      <script
        src="https://cdn.jsdelivr.net/npm/flatpickr@4.6.3/dist/flatpickr.min.js"
        integrity="sha256-/irFIZmSo2CKXJ4rxHWfrI+yGJuI16Z005X/bENdpTY="
        crossorigin="anonymous"
      />
      <Routes>
        {botLayout.map((page) => {
          return (
            <Route
              key={page.path}
              exact
              path={backendRoutes.frontendEntry + page.path}
              element={<Page key={page.path} currentPage={page} />}
            />
          );
        })}
        <Route key="notFound" path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

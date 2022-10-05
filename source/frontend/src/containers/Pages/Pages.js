import Page from "../Page";
import NotFoundPage from "../NotFoundPage";
import { useBotLayoutContext } from "../../context/config/BotLayoutProvider";
import React, { useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { backendRoutes } from "../../constants/backendConstants";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "bootstrap/dist/css/bootstrap.min.css"
import "../../components/Forms/JsonEditor/JsonEditor.css"
import "select2/dist/css/select2.min.css"
import LoadingPage from "../LoadingPage";
import "./pages.css"

export default function Pages() {
  const botLayout = useBotLayoutContext();
  return useMemo(() => {

    return <BrowserRouter>
      <ReactNotifications />
      <Routes>
        {botLayout
          ? botLayout.map((page) => {
            return (
              <Route
                key={page.path}
                exact
                path={backendRoutes.frontendEntry + page.path}
                element={<Page key={page.path} currentPage={page} />}
              />
            );
          })
          : <Route key="isLoading" path="*" element={<LoadingPage />} />}
        <Route key="notFound" path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  }, [botLayout])
}

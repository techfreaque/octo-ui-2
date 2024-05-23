import { useMemo } from "react";
import { ReactNotifications } from "react-notifications-component";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { backendRoutes } from "../../constants/backendConstants";
import { useBotLayoutContext } from "../../context/config/BotLayoutProvider";
import LoadingPage from "../LoadingPage";
import NotFoundPage from "../NotFoundPage";
import Page from "../Page";

export default function Pages() {
  const botLayout = useBotLayoutContext();

  return useMemo(() => {
    return (
      <BrowserRouter>
        <ReactNotifications />
        <Routes>
          {botLayout ? (
            botLayout.map((page) => {
              return (
                <Route
                  key={page.path}
                  path={backendRoutes.frontendEntry + page.path}
                  element={<Page key={page.path} currentPage={page} />}
                />
              );
            })
          ) : (
            <Route
              key="isLoading"
              path="*"
              element={<LoadingPage key="isLoading" />}
            />
          )}
          <Route
            key="notFound"
            path="*"
            element={<NotFoundPage key="notFound" />}
          />
        </Routes>
      </BrowserRouter>
    );
  }, [botLayout]);
}

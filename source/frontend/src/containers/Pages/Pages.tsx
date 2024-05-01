import Page from "../Page";
import NotFoundPage from "../NotFoundPage";
import { useBotLayoutContext } from "../../context/config/BotLayoutProvider";
import { useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { backendRoutes } from "../../constants/backendConstants";
import { ReactNotifications } from "react-notifications-component";
import LoadingPage from "../LoadingPage";

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

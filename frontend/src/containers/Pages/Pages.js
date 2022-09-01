import Page from "../Page";
import NotFoundPage from "../NotFoundPage";
import { useBotLayoutContext } from "../../context/BotLayoutProvider";
import React from "react";
import { Route, Routes } from "react-router-dom";

export default function Pages() {
  const botLayout = useBotLayoutContext();
  return (
    <Routes>
      {botLayout.map((page) => {
        return (
          <Route
            key={page.path}
            exact
            path={page.path}
            element={<Page key={page.path} currentPage={page} />}
          />
        );
      })}
      <Route key="notFound" path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

import "react-notifications-component/dist/theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../components/Forms/JsonEditor/JsonEditor.css";
import "./app.css";
import "./i18n";

import { Suspense, useEffect, useState } from "react";

import BotDataProvider from "../../context/BotDataProvider";
import LoadingPage from "../LoadingPage";
import Pages from "../Pages/Pages";
import { loadI18N } from "./i18n";
export default function App() {
  const [i18nLoaded, setI18nLoaded] = useState(false);
  useEffect(() => {
    loadI18N(() => setI18nLoaded(true));
  }, []);
  return (
    <Suspense fallback={<LoadingPage />}>
      <BotDataProvider>
        {i18nLoaded ? <Pages /> : <LoadingPage />}
      </BotDataProvider>
    </Suspense>
  );
}

import "react-notifications-component/dist/theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../components/Forms/JsonEditor/JsonEditor.css";
import "./app.css";
import "./i18n";

import { Suspense } from "react";

import BotDataProvider from "../../context/BotDataProvider";
import LoadingPage from "../LoadingPage";
import Pages from "../Pages/Pages";
export default function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <BotDataProvider>
        <Pages />
      </BotDataProvider>
    </Suspense>
  );
}

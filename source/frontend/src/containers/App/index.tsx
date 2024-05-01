import { Suspense } from "react";
import Pages from "../Pages/Pages";
import BotDataProvider from "../../context/BotDataProvider";
import "react-notifications-component/dist/theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../components/Forms/JsonEditor/JsonEditor.css";
import "select2/dist/css/select2.min.css";
import "./app.css";
import "./i18n";
import LoadingPage from "../LoadingPage";

export default function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <BotDataProvider>
        <Pages />
      </BotDataProvider>
    </Suspense>
  );
}

import React, {Suspense} from "react";
import Pages from "../Pages/Pages";
import BotDataProvider from "../../context/BotDataProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import './i18n';
import LoadingPage from "../LoadingPage";

export default function App() {
    return (
        <Suspense fallback={<LoadingPage/>}>
            <BotDataProvider>
                <Pages/>
            </BotDataProvider>
        </Suspense>
    );
}

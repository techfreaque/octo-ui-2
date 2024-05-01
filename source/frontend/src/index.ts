import { createRoot } from "react-dom/client";
import App from "./containers/App";
import { createElement } from "react";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("no root element");
createRoot(rootElement).render(createElement(App));

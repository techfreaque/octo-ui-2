import { createElement } from "react";
import { createRoot } from "react-dom/client";

import App from "./containers/App";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("no root element");
}
createRoot(rootElement).render(createElement(App));

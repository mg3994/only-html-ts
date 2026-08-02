import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

const rootElement = document.getElementById("react-root");

if (rootElement) {
  // Extract external params from HTML data attributes
  const params = {
    pageType: rootElement.dataset.pageType,
    isHome: rootElement.dataset.isHome === "true",
  };
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App {...params} />
    </React.StrictMode>,
  );
}

import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import {Toaster} from "sonner";

import {router} from "@/app/router";
import "@/styles/main.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster
      position="bottom-right"
      richColors
      closeButton={false}
      duration={2500}
      toastOptions={{
        style: {
          background: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border-light)",
          color: "var(--color-white)",
          fontSize: "var(--text-sm)",
        },
      }}
    />
  </React.StrictMode>,
);

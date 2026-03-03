import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { MainLayout } from "./components/MainLayout";
import { AgentChat } from "./components/AgentChat";
import { Dashboard } from "./pages/Dashboard";
import { AbidusAnalysis } from "./pages/AbidusAnalysis";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <AgentChat />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "abidus-analysis",
        element: <AbidusAnalysis />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

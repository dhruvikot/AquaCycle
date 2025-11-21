import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import "./stylesheets/index.css";
import Reports from "./pages/reports";
import Client_Details from "./pages/client_details";
import LandingPage from "./pages/LandingPage";
import ActiveMaterials from "./pages/active_materials";
import AppDownload from "./pages/AppDownload";
import UsersPage from "./pages/UsersPage";
import ClientsPage from "./pages/ClientsPage";
import StatisticReports from "./pages/StatisticReports";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/clients",
    element: <ClientsPage />,
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
  {
    path: "/statistic-reports",
    element: <StatisticReports />,
  }  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
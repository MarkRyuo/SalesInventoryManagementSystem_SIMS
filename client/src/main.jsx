import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import DashboardPage from '../src/pages/DashboardPage' ;
import ProductPage from './pages/ProductPage.jsx' ;
import ReportPage from './pages/ReportPage.jsx' ;
import AccountPage from './pages/AccountPage'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "DashboardPage",
    element: <DashboardPage /> ,
  },
  {
    path: "ProductPage",
    element: <ProductPage /> ,
  },
  {
    path: "ReportPage",
    element: <ReportPage /> ,
  },
  {
    path: "AccountPage",
    element: <AccountPage /> ,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

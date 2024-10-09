import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import DashboardPage from '../src/pages/DashboardPage' ;
import ProductPage from './pages/ProductPage.jsx' ;
import ReportPage from './pages/ReportPage.jsx' ;
import StaffAccount from './pages/StaffAccount.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MyProfile from './pages/MyProfile.jsx';

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
    path: "StaffAccount",
    element: <StaffAccount /> ,
  },
  {
    path: "MyProfile",
    element: <MyProfile />,
  },
  {
    path: "AboutPage",
    element: <MyProfile />,
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

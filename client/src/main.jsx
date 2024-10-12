import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import DashboardPage from '../src/pages/DashboardPage' ;
import ProductPage from './pages/ProductPage.jsx' ;
import ReportPage from './pages/ReportPage.jsx' ;
import StaffAccount from './pages/StaffAccount.jsx'
import AboutPage from './pages/AboutPage.jsx'
import MyProfile from './pages/MyProfile.jsx';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import SLogin from './pages/StaffPages/SLogin.jsx';
import SDashboard from './pages/StaffPages/SDashboard.jsx';
import SStaffAccount from './pages/StaffPages/SStaffAccount.jsx';
import ForgotPassword from './components/LogIn/ForgotPassword.jsx';
import ResetPassword from './services/ResetPassword.jsx';

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
    element: <AboutPage /> ,
  },
  //? Staff Portal
  {
  path: "SLogin",
    element: <SLogin /> ,
  },
  {
    path: "SDashboard",
    element: <SDashboard /> ,
  },
  {
    path: "SStaffAccount",
    element: <SStaffAccount /> ,
  },

  //? Forgot Password
  {
    path: "ForgotPassword",
    element: <ForgotPassword /> ,
  },
  {
    path: "ResetPassword",
    element: <ResetPassword /> ,
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
//? Pages Import
import DashboardPage from '../src/pages/DashboardPage' ;
import ProductPage from './pages/ProductPage.jsx' ;
import ReportPage from './pages/ReportPage.jsx' ;
import StaffAccount from './pages/StaffAccount.jsx'
import AboutPage from './pages/AboutPage.jsx'
import MyProfile from './pages/MyProfile.jsx';
import SLogin from './pages/StaffPages/SLogin.jsx';
import SDashboard from './pages/StaffPages/SDashboard.jsx';
import SStaffAccount from './pages/StaffPages/SStaffAccount.jsx';
import ForgotPassword from './components/LogIn/ForgotPassword.jsx';
import AddNewAssets from './pages/StaffPages/AddNewAssets.jsx';
import NewAssets from './components/StaffPortal/AddNewAssets/NewAssets.jsx';
import NewAssetsScanner from './components/StaffPortal/AddNewAssets/NewAssetsScanner.jsx';
import ScanAsset from './pages/StaffPages/ScanAsset.jsx';
import SearchAsset from './pages/StaffPages/SearchAsset.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, //* Root This is Login in DashBoard
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

  //? Forgot Password
  {
    path: "ForgotPassword",
    element: <ForgotPassword />,
  },

  //? Staff Portal
  {
  path: "SLogin",
    element: <SLogin /> , //* Staff Login Page
  },
  {
    path: "SDashboard",
    element: <SDashboard /> , //* Staff Dashboard Page
  },
  {
    path: "SStaffAccount",
    element: <SStaffAccount /> , //* Staff Account Page
  },

  
  //? Staff Buttons in Dashboard
  {
    path: "AddNewAssets",
    element: <AddNewAssets /> ,
  },
  {
    path: "ScanAsset",
    element: <ScanAsset />,
  },
  {
    path: "SearchAssets",
    element: <SearchAsset /> ,
  },
  
  //? Staff Comps 
  {
    path: "NewAssetsScanner",
    element: <NewAssetsScanner /> , //* Scanner of AddNewAssets
  },

  {
    path: "NewAssets",
    element: <NewAssets />, //* Add New Assets Products After Scan
  },
  

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

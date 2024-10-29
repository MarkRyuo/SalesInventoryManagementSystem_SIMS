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
import AddNewAssets from './pages/StaffPages/AddNewAssets.jsx';
import NewAssets from './components/StaffPortal/AddNewAssets/NewAssets.jsx';
import NewAssetsScanner from './components/StaffPortal/AddNewAssets/NewAssetsScanner.jsx';
import ScanAsset from './pages/StaffPages/ScanAsset.jsx';
import SearchAsset from './pages/StaffPages/SearchAsset.jsx';
import ForgotPasswordMode from './components/LogIn/ForgotPasswordMode.jsx';
import EnableRecoveryMode from './components/LogIn/EnableRecoveryMode.jsx';
import ResetPasswordMode from './components/LogIn/ResetPasswordMode.jsx';
import ResetRendering from './components/LogIn/ResetRendering.jsx';
import ProfileMode from './components/Account/ProfileMode.jsx';
import StaffAccountMode from './components/StaffPortal/StaffAccount/StaffAccountMode.jsx';
import ProductSuccess from './components/StaffPortal/AddNewAssets/ProductSuccess.jsx';
import PosScanner from './components/StaffPortal/ScanAssets/PosScanner.jsx';
import ReceiptMode from './components/StaffPortal/ScanAssets/ReceiptMode.jsx';

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
  {
    path: "ProfileMode",
    element: <ProfileMode /> ,
  },

  //? Forgot Password
  {
    path: "ForgotPasswordMode",
    element: <ForgotPasswordMode />,
  },
  {
    path: "EnableRecoveryMode",
    element: <EnableRecoveryMode />,
  },
  {
    path: "ResetPasswordMode",
    element: <ResetPasswordMode /> ,
  },
  {
    path: "ResetRendering",
    element: <ResetRendering /> ,
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
  {
    path: "StaffAccountMode",
    element: <StaffAccountMode />, //* Staff Account Page
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
    element: <NewAssetsScanner /> , //* Add to Inventory: Scanner of AddNewAssets
  },
  {
    path: "NewAssets",
    element: <NewAssets />, //* Add to Inventory: Add New Assets Products After Scan
  },
  {
    path: "ProductSuccess",
    element: <ProductSuccess /> , //* Add Product: Add New Assets Success
  },
  {
    path: "PosScanner",
    element: <PosScanner /> , //* POS: Scanner Camera 
  },
  {
    path: "ReceiptMode",
    element: <ReceiptMode /> , //* POS: Product Receipt
  },
  

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
//? Pages Import
import StaffAccount from './pages/StaffAccount.jsx'
import MyProfile from './pages/MyProfile.jsx';
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
import ScanAssetsMode from './components/StaffPortal/ScanAssets/ScanAssetsMode.jsx';
import PosSuccess from './components/StaffPortal/ScanAssets/PosSuccess.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx'

//! Done 
import ProductPage from './pages/Admin/ProductPage/ProductPage.jsx';
import AdminTransactionHistory from './pages/Admin/AdminTransactionHistory/AdminTransactionHistory.jsx';
import Product from './components/Charts/ProductChart/Product.jsx' ;
import DashboardPage from '../src/pages/Admin/DashboardPage/DashboardPage.jsx';
import ReOrdering from './pages/Admin/ProductPage/ReOrdering.jsx';
import SetQrcode from './pages/Admin/ProductPage/SetQrcode.jsx' ;
import ReportPage from './pages/Admin/ReportPage/ReportPage.jsx';
import AccountPage from './pages/Admin/AccountPage/AccountPage.jsx'
import ProfileComp from './components/Account/ProfileComp.jsx';
import StaffProductPage from './pages/Staff/StaffProductPage/StaffProductPage.jsx'
import StaffProduct from './components/Charts/ProductChart/StaffProduct.jsx'
import LowStockReports from './components/Reports/LowStockReports.jsx';
import StockInReports from './components/Reports/StockInReports.jsx';
import TotalSaless from './components/Reports/TotalSaless.jsx';

const router = createBrowserRouter([
  { //? ROOT
    path: "/",
    element: <App />, //* Root This is Login in DashBoard
  },
  //! Admin Pages
  { //? LoginPage Admin
    path: "LoginPage",
    element: <LoginPage />, //* Root This is Login in DashBoard
  },
  { //? DashboardPage Admin
    path: "DashboardPage",
    element: <DashboardPage />,
  },
  { //? ProductPage Admin
    path: "ProductPage",
    element: <ProductPage />,
  },
  { //? ReportPage Admin
    path: "ReportPage",
    element: <ReportPage />,
  },
  { //? Creating for Admin StaffAccount
    path: "StaffAccount",
    element: <StaffAccount />,
  },
  { //? MyProfilePage for Admin
    path: "MyProfile",
    element: <MyProfile />,
  },
  { //? Editing Profile for Admin
    path: "ProfileMode",
    element: <ProfileMode />,
  },
  { //? Transaction History for Admin
    path: "AdminTransactionHistory",
    element: <AdminTransactionHistory />,
  },
  { //? Product for Admin
    path: "Product",
    element: <Product /> ,
  },
  { //? Product for Admin
    path: "ReOrdering",
    element: <ReOrdering /> ,
  },
  { //? Product for Admin
    path: "SetQrcode",
    element: <SetQrcode /> ,
  },
  { //? Product for Admin
    path: "AccountPage",
    element: <AccountPage/>,
  },
  { //? Product for Admin
    path: "ProfileComp",
    element: <ProfileComp /> ,
  },

  //! Forgot Password
  { //? ForgotPasswordMode for Admin
    path: "ForgotPasswordMode",
    element: <ForgotPasswordMode />,
  },
  { //? EnableRecoveryMode for Admin
    path: "EnableRecoveryMode",
    element: <EnableRecoveryMode />,
  },
  { //? ResetPasswordMode for Admin
    path: "ResetPasswordMode",
    element: <ResetPasswordMode />,
  },
  { //? ResetRendering for Admin
    path: "ResetRendering",
    element: <ResetRendering />,
  },

  //! Staff Portal
  {
    path: "SDashboard",
    element: <SDashboard />, //* Staff Dashboard Page
  },
  {
    path: "SStaffAccount",
    element: <SStaffAccount />, //* Staff Account Page
  },
  {
    path: "StaffAccountMode",
    element: <StaffAccountMode />, //* Staff Account Page
  },

  //? Staff Buttons in Dashboard
  {
    path: "AddNewAssets",
    element: <AddNewAssets />,
  },
  {
    path: "ScanAsset",
    element: <ScanAsset />,
  },
  {
    path: "SearchAssets",
    element: <SearchAsset />,
  },
  {
    path: "StaffProductPage",
    element: <StaffProductPage /> ,
  },
  {
    path: "StaffProduct",
    element: <StaffProduct/>,
  },

  //? Staff Comps 
  {
    path: "NewAssetsScanner",
    element: <NewAssetsScanner />, //* Add to Inventory: Scanner of AddNewAssets
  },
  {
    path: "NewAssets",
    element: <NewAssets />, //* Add to Inventory: Add New Assets Products After Scan
  },
  {
    path: "ProductSuccess",
    element: <ProductSuccess />, //* Add to Inventory: Add New Assets Success
  },

  {
    path: "PosScanner",
    element: <PosScanner />, //* POS: 1st, Scanner Camera 
  },
  {
    path: "ScanAssetsMode",
    element: <ScanAssetsMode />, //* POS: 2st, Current Order 
  },
  {
    path: "PosSuccess",
    element: <PosSuccess />, //* POS: Product Success View 
  },


  {
    path: "LowStockReports",
    element: <LowStockReports /> , 
  },
  {
    path: "StockInReports",
    element: <StockInReports /> ,
  },
  {
    path: "TotalSaless",
    element: <TotalSaless /> ,
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

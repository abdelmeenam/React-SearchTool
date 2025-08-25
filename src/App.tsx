import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import FormElements from "./pages/Forms/FormElements";
import DrugForm from "./pages/Forms/Drug";
import BranchForm from "./pages/Forms/Branches";
import ClassInsuranceForm from "./pages/Forms/BranchEnsurance";
import DrugBranchForm from "./pages/Forms/DrugBranch";
import DrugClassForm from "./pages/Forms/DrugClass";
import DrugCsvForm from "./pages/Forms/DrugCSV";
import DrugInsuranceForm from "./pages/Forms/DrugEnsurance";
import InsuranceForm from "./pages/Forms/Insurance";
import MainCompanyForm from "./pages/Forms/MailCompany";
import RoleSelectionForm from "./pages/Forms/Roles";
import ScriptForm from "./pages/Forms/Scripts";
import ScriptItemForm from "./pages/Forms/ScriptItem";
import SpecialtyForm from "./pages/Forms/Specialty";
import UserForm from "./pages/Forms/User";
// tables

import SearchComponent from "./pages/Search/bar";
import LandingPage from "./old/Home";
import Dashboard from "./old/Dashboard";
//search
import SearchSwitcher from "./old/SearchSwitcher";
import MainDashboard from "./old/MainDashboard";
import { Upload } from "./old/Upload";
import LogsPage from "./old/Logs";
import InsuranceBINDetails from "./old/InsuranceBINDetails";

import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

//import { MHome } from "./old/Home";
import { Layout } from "./components/Layout";

import { Login } from "./old/Login";

import Search from "./old/Search";

import { DrugDetails } from "./old/DrugDetails";
//import { LogsPage } from "./old/Logs";

import ScriptDetails from "./old/ScriptDetails";
import InsuranceDetails from "./old/InsuranceDetails";
//import { ProfilePage } from "./old/profile";

import { AboutUs } from "./old/about";
import { Services } from "./old/services";
import InsurancePCNDetails from "./old/InsurancePCNDetails";
import HelpPage from "./old/HelpPage";
import SyncData from "./old/SyncData";
import OrderHistory from "./old/OrdersHistory";
import FeedbackForm from "./old/FeedbackForm";
import FeedbackViewer from "./old/FeedbackViewe";
import LogsLeaderboardPage from "./old/leaderboard";
// PrivateRoute and PublicRoute components
const PrivateRoute: React.FC<{
  children: React.ReactNode;
  isAdmin?: boolean;
}> = ({ children, isAdmin = false }) => {
  const role = localStorage.getItem("role");

  if (!role) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  // If isAdmin is true, check if the user is admin
  if (isAdmin && role !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem("role");
  if (isAuthenticated) {
    // Redirect to the dashboard if the user is already logged in
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* New Routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Services />} /> {/* Default Home Page  */}
            <Route path="about" element={<AboutUs />} />
            <Route
              path="login"
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              }
            />
            <Route path="services" element={<Services />} />
            <Route path="hero" element={<Services />} />
            <Route path="upload" element={<Upload />} />
          </Route>

          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/dash" element={<Home />} />

            <Route path="bar" element={<SearchComponent />} />

            <Route
              path="profile"
              element={
                <PrivateRoute>
                  <UserProfiles />
                </PrivateRoute>
              }
            />

            <Route
              path="search/:id"
              element={
                <PrivateRoute>
                  <SearchSwitcher />
                </PrivateRoute>
              }
            />
            <Route
              path="OrderHistory"
              element={
                <PrivateRoute>
                  <OrderHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="drug/:drugId"
              element={
                <PrivateRoute>
                  <DrugDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/SyncData"
              element={
                <PrivateRoute>
                  <SyncData />
                </PrivateRoute>
              }
            />
            <Route
              path="/scriptitems/:scriptcode"
              element={<ScriptDetails />}
            />
            <Route
              path="/InsruanceDetails/:insuranceName"
              element={<InsuranceDetails />}
            />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/*search pages */}

            {/* Audits */}

            <Route
              path="/dashboard/:dashboardId"
              element={
                <PrivateRoute>
                  <MainDashboard />
                </PrivateRoute>
              }
            />
            {/* logs */}
            <Route
              path="/logs"
              element={
                <PrivateRoute>
                  <LogsPage />
                </PrivateRoute>
              }
            />  
            <Route
              path="/leaderboard"
              element={
                <PrivateRoute>
                  <LogsLeaderboardPage/>
                </PrivateRoute>
              }
            />  
            <Route
              path="/feedbackForm"
              element={
                <PrivateRoute>
                  <FeedbackForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/feedbackViewer"
              element={
                <PrivateRoute>
                  <FeedbackViewer />
                </PrivateRoute>
              }
            />
            {/* Insurance Details */}
            <Route
              path="/InsuranceDetails/:insuranceName"
              element={
                <PrivateRoute>
                  <InsuranceDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/Help"
              element={
                <PrivateRoute>
                  <HelpPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/InsurancePCNDetails/:insuranceName"
              element={
                <PrivateRoute>
                  <InsurancePCNDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/InsuranceBINDetails/:insuranceName"
              element={
                <PrivateRoute>
                  <InsuranceBINDetails />
                </PrivateRoute>
              }
            />
            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />
            {/* <Route path="/drug-form" element={<DrugForm />} />
            <Route path="/branch-form" element={<BranchForm />} />
            <Route path="/ens-branch-form" element={<ClassInsuranceForm />} />
            <Route path="/drug-branch-form" element={<DrugBranchForm />} />
            <Route path="/drug-class-form" element={<DrugClassForm />} />
            <Route path="/drug-csv-form" element={<DrugCsvForm />} />
            <Route
              path="/drug-insurance-form"
              element={<DrugInsuranceForm />}
            />
            <Route path="/insurance-form" element={<InsuranceForm />} />
            <Route path="/company-form" element={<MainCompanyForm />} />
            <Route path="/roles-form" element={<RoleSelectionForm />} />
            <Route path="/scripts-form" element={<ScriptForm />} />
            <Route path="/script-item-form" element={<ScriptItemForm />} />
            <Route path="/specialty-form" element={<SpecialtyForm />} />
            <Route path="/user-form" element={<UserForm />} /> */}

            {/* Ui Elements */}

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* New Routes */}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

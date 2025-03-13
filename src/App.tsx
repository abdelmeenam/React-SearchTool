import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Search } from "./pages/Search";
import { Upload } from "./pages/Upload";
import { DrugDetails } from "./pages/DrugDetails";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { LogsPage } from "./pages/Logs";
import SecondDashBoard from "./pages/SecondDashBoard";
import ThirdDashBoard from "./pages/ThirdDashBoard";
import MainDashboard from "./pages/MainDashboard";
import ScriptDetails from "./pages/ScriptDetails";
import InsuranceDetails from "./pages/InsuranceDetails";
import { ProfilePage } from "./pages/profile";
import Auth from "./Auth";
import { InsuranceSearch } from "./pages/Search2";
import { SearchSwitcher } from "./pages/SearchSwitcher";

const PrivateRoute: React.FC<{ children: React.ReactNode; isAdmin?: boolean }> = ({ children, isAdmin = false }) => {
  const role = localStorage.getItem("role");

  // If role is not set, redirect to login
  if (!role) {
    return <Navigate to="/login" />;
  }

  // If route requires admin and user is not admin, redirect to home
  if (isAdmin && role !== "Admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem("role");

  // If user is authenticated, redirect them to the home page
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

function App() {
  // Use null to indicate that the auth check is pending
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await Auth();
      setIsAuthorized(authResult);
      if (!authResult) {
        console.log("User not authenticated, redirecting to sign-in...");
      }
    };
    checkAuth();
  }, []);

  // While waiting for authentication check, display a loading state
  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Default Home Page */}
            <Route index element={<Home />} />

            {/* Public route - if user is authenticated, they are redirected */}
            <Route
              path="login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Private routes - accessible only when authenticated */}
            <Route
              path="search"
              element={
                <PrivateRoute>
                  <SearchSwitcher />
                </PrivateRoute>
              }
            />
            <Route
              path="upload"
              element={
                <PrivateRoute>
                  <Upload />
                </PrivateRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <PrivateRoute isAdmin={true}>
                  <MainDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="logs"
              element={
                <PrivateRoute isAdmin={true}>
                  <LogsPage />
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
              path="/scriptitems/:scriptcode"
              element={
                <PrivateRoute>
                  <ScriptDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/InsuranceDetails/:insuranceName"
              element={
                <PrivateRoute>
                  <InsuranceDetails />
                </PrivateRoute>
              }
            />
            {/* Uncomment if needed in the future */}
            {/* <Route
              path="/Profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

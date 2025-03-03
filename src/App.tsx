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
import { Search2 } from "./pages/Search2";
import { SearchSwitcher } from "./pages/SearchSwitcher";

const PrivateRoute: React.FC<{
  children: React.ReactNode;
  isAdmin?: boolean;
}> = ({ children, isAdmin = false }) => {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/login" />;
  }

  // If isAdmin is true, check if the user is admin
  if (isAdmin && role !== "Admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem("role");
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
function App() {
  const [IsAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await Auth();
      setIsAuthorized(isAuthenticated);
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to sign-in...");
      }
    };
    checkAuth();
  }, []);
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} /> {/* Default Home Page */}
            <Route
              path="login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />{" "}
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
              path="/InsruanceDetails/:insuranceName"
              element={
                <PrivateRoute>
                  <InsuranceDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/Profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

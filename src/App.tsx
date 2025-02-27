import React from "react";
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
function App() {
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
                  <Search />
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
              element={<ScriptDetails />}
            />
            <Route
              path="/InsruanceDetails/:insuranceName"
              element={<InsuranceDetails />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

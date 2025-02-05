import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Search } from './pages/Search';
import { Upload } from './pages/Upload';
import { DrugDetails } from './pages/DrugDetails';
import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { LogsPage } from './pages/Logs';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} /> {/* Default Home Page */}
            <Route path="login" element={<Login />} />
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
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          <Route
              path="logs"
              element={
                <PrivateRoute>
                  <LogsPage />
                </PrivateRoute>
              }
            />
              <Route path="drug/:drugId"
              element={
                          <PrivateRoute>
                            <DrugDetails />
                          </PrivateRoute>
                        } 
                        //element={<ProfilePage />}
                         />  
</Route>                        
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

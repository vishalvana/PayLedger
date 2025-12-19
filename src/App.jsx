import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

import Drivers from "./pages/Drivers";
import RoutesPage from "./pages/Routes";
import Trips from "./pages/Trips";
import WeeklySettlement from "./pages/WeeklySettlement";
import MonthlySettlement from "./pages/MonthlySettlement";
import SettlementHistory from "./pages/SettlementHistory";
import Login from "./pages/Login";


import ProtectedRoute from "./utils/ProtectedRoute";

function Layout({ children }) {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" ;

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Drivers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routes"
            element={
              <ProtectedRoute>
                <RoutesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <Trips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weekly-settlement"
            element={
              <ProtectedRoute>
                <WeeklySettlement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/monthly-settlement"
            element={
              <ProtectedRoute>
                <MonthlySettlement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settlements"
            element={
              <ProtectedRoute>
                <SettlementHistory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

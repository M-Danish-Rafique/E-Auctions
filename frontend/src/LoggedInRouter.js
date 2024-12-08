import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import SellerDashboard from "./pages/SellerDashboard";
import ProductsPage from "./pages/ProductsPage";
import ListingsPage from "./pages/ListingsPage";
import SellerMessagesPage from "./pages/SellerMessagesPage";
import SellerNotificationsPage from "./pages/SellerNotificationsPage";
import SellerProfilePage from "./pages/SellerProfilePage";

const NotFoundRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    window.location.href = "/";
  }, [navigate]);

  return null; // No UI is rendered, just a redirect
};

const LoggedInRoutes = ({ token, role }) => {
  return (
    <Router>
      <Routes>
        <Route
          path="/SellerDashboard"
          element={<SellerDashboard key={token} />}
        />
        <Route path="/Products" element={<ProductsPage key={token} />} />
        <Route path="/Listings" element={<ListingsPage key={token} />} />
        <Route
          path="/SellerMessages"
          element={<SellerMessagesPage key={token} />}
        />
        <Route
          path="/SellerNotifications"
          element={<SellerNotificationsPage key={token} />}
        />
        <Route
          path="/SellerProfile"
          element={<SellerProfilePage key={token} />}
        />
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </Router>
  );
};

export default LoggedInRoutes;

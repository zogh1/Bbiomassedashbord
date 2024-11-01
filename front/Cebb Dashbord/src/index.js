/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import ForgotPassword from './views/examples/ForgotPassword';
import ResetPassword from './views/examples/ResetPassword'; 
const root = ReactDOM.createRoot(document.getElementById("root"));
const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user')); // Example: Fetching from localStorage
  return user ? user.role : null;
};
root.render(
  <BrowserRouter>
    <Routes>
    <Route path="/" element={<Navigate to="/auth/login" replace />} />

      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="*" element={<Navigate to="/auth/login" replace />} />
        <Route path="/" element={<Navigate to="/login" />} />


    </Routes>
  </BrowserRouter>
);

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../component/Signup";
import Login from "../component/Login";
import AdminLogin from "../component/AdminLogin";
import AdminDashboard from "../component/AdminDashboard";
import Mainpage from "./Mainpage";
import Home from "../component/Home";
import CampaignTable from "../component/CampaignTable";


function RoutesPage() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/editor" element={<Mainpage/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/campaigntable" element={<CampaignTable/>} />

      </Routes>
    </Router>
  );
}

export default RoutesPage;
import { FaBolt } from 'react-icons/fa';
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import AuditLogs from "views/examples/AuditLogs.js";
import ProtectedRoute from "./ProtectedRoute"; 
import PredictionForm from "views/examples/PredictionForm.js"; 
import CarbonFootprintPredictionForm from "views/examples/CarbonFootprintPredictionForm.js"; 

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "AdminImportPage",
    icon: "ni ni-planet text-blue",
    component: (
      <ProtectedRoute>
        <Icons />
      </ProtectedRoute>
    ),
    layout: "/admin",
    roles: ["admin"], 
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: (
      <ProtectedRoute>
        <Maps />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Users Management",
    icon: "ni ni-bullet-list-67 text-red",
    component: (
      <ProtectedRoute>
        <Tables />
      </ProtectedRoute>
    ),
    layout: "/admin",
    roles: ["admin"], 
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/audit-logs",
    name: "Audit Logs",
    icon: "ni ni-archive-2 text-blue",
    component: (
      <ProtectedRoute>
        <AuditLogs />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/prediction_energie",
    name: "Energy Prediction",
    icon: <FaBolt style={{ color: "yellow", fontSize: "20px",marginRight: "10px" }} />,  // Using FaBolt from react-icons
    component: <PredictionForm />,
    layout: "/admin",
  },
  {
    path: "/prediction_emprunte_carbone",
    name: "Carbon Footprint",
    icon: "ni ni-atom text-green",  // Use 'ni' icon with proper text color
    component: <CarbonFootprintPredictionForm />,
    layout: "/admin",
  },
  
  
];

export default routes;

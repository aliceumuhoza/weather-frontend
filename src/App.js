import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard/Dashboard";
import Bar from "./scenes/bar";
import Form from "./scenes/addStaff";
import Pie from "./scenes/pie";
import ListUsers from "./scenes/getStaffs";
import ListMarket from "./scenes/getMarkets";
import AddProduct from "./scenes/AddProduct";
import AddMarket from "./scenes/addMarket";
import AddDistrict from './scenes/addDistrict'
import GetDistrict from "./scenes/getDistricts";
import Products from "./scenes/getProducts";
import UpdateStaff from "./scenes/updateStaff"; 
import UpdateMarket from "./scenes/updateMarket"; 
import UpdateProduct from "./scenes/updateProduct";

import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './scenes/Login'

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Login />} />
                {/* Protected Routes */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
                <Route path="/form" element={<PrivateRoute><Form /></PrivateRoute>} />
                <Route path="/bar" element={<PrivateRoute><Bar /></PrivateRoute>} />
                <Route path="/pie" element={<PrivateRoute><Pie /></PrivateRoute>} />
                <Route path="/addproduct" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
                <Route path="/adddistrict" element={<PrivateRoute><AddDistrict /></PrivateRoute>} />
                <Route path="/listdistrict" element={<PrivateRoute><GetDistrict /></PrivateRoute>} />
                <Route path="/addmarket" element={<PrivateRoute><AddMarket /></PrivateRoute>} />
                <Route path="/listmarket" element={<PrivateRoute><ListMarket /></PrivateRoute>} />
                <Route path="/listuser" element={<PrivateRoute><ListUsers /></PrivateRoute>} />
                <Route path="/updateStaff/:id" element={<PrivateRoute><UpdateStaff /></PrivateRoute>} />
                <Route path="/updateMarket/:id" element={<PrivateRoute><UpdateMarket /></PrivateRoute>} />
                <Route path="/updateProduct/:id" element={<PrivateRoute><UpdateProduct /></PrivateRoute>} />
              </Routes>
            </main>
          </div>
          <ToastContainer /> 
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { user } = useAuth(); // Access user from AuthContext

  // Define restricted routes for non-admin users
  const restrictedRoutes = [
    '/adddistrict', 
    '/form', 
    '/addmarket', 
    '/addproduct', 
    '/listuser', 
  ];

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if the user is an admin
  const isAdmin = user.role && user.role.name === 'Admin'; // Access role name directly


  // Get the current path
  const currentPath = window.location.pathname;

  // Restrict access to certain routes for non-admin users
  if (!isAdmin && restrictedRoutes.includes(currentPath)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children; // Render the child component if access is allowed
};


export default App;

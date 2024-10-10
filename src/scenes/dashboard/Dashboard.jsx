import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"; // Users icon
import InventoryIcon from "@mui/icons-material/Inventory"; // Products icon
import StorefrontIcon from "@mui/icons-material/Storefront"; // Markets icon
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv"; // Import CSVLink
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useAuth } from '../../context/AuthContext'; // Import Auth context

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const { logout } = useAuth(); // Get logout function from context
  const [currentUsers, setCurrentUsers] = useState(0);
  const [newProducts, setNewProducts] = useState(0);
  const [markets, setMarkets] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch current users
        const usersResponse = await fetch("http://localhost:4000/staffs"); // Update with your users API route
        const usersData = await usersResponse.json();
        setCurrentUsers(usersData.length); // Count of current users

        // Fetch new products
        const productsResponse = await fetch("http://localhost:4000/products"); // Update with your products API route
        const productsData = await productsResponse.json();
        setNewProducts(productsData.length); // Count of new products

        // Fetch markets
        const marketsResponse = await fetch("http://localhost:4000/markets"); // Update with your markets API route
        const marketsData = await marketsResponse.json();
        setMarkets(marketsData.length); // Count of markets
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Define CSV headers and data
  const csvHeaders = [
    { label: "Category", key: "category" },
    { label: "Count", key: "count" },
  ];

  const csvData = [
    { category: "Current Users", count: currentUsers },
    { category: "New Products", count: newProducts },
    { category: "Markets", count: markets },
  ];

  const handleLogout = async () => {
    await logout(); // Call logout from context
    localStorage.clear(); // Clear all items in localStorage
    navigate("/"); // Navigate to the login page
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <CSVLink
            headers={csvHeaders}
            data={csvData}
            filename="dashboard_report.csv"
            style={{ textDecoration: "none" }}
          >
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <DownloadOutlinedIcon sx={{ mr: "10px" }} />
              Download CSV
            </Button>
          </CSVLink>
          <Button
            onClick={handleLogout} // Call handleLogout on click
            sx={{
              backgroundColor: colors.redAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              marginLeft: "10px", // Add some space between buttons
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
        {/* ROW 1 */}
        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={currentUsers.toString()} // Display dynamic current users
            subtitle="Current Users"
            progress="0.75" // Example progress (can be adjusted)
            increase="+14%"
            icon={<PeopleAltIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={newProducts.toString()} // Display dynamic new products
            subtitle="New Products"
            progress="0.50" // Example progress (can be adjusted)
            increase="+21%"
            icon={<InventoryIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={markets.toString()} // Display dynamic markets
            subtitle="Markets"
            progress="0.30" // Example progress (can be adjusted)
            increase="+5%"
            icon={<StorefrontIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Typography variant="h5" fontWeight="600" sx={{ padding: "30px 30px 0 30px" }}>
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
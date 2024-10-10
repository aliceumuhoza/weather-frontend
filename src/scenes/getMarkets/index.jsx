import React, { useEffect, useState } from "react";
import { Box, useTheme, IconButton, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';

const ListMarkets = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await fetch("http://localhost:4000/markets");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        const formattedData = data.map((market) => ({
          id: market._id,
          name: market.name,
          district: market.district_id.name,
        }));
        setMarkets(formattedData);
      } catch (error) {
        console.error("Failed to fetch markets:", error);
        toast.error("Failed to fetch markets: " + error.message);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchMarkets();
  }, []);

  const removeMarket = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/markets/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to remove market");
      setMarkets((prevMarkets) => prevMarkets.filter((market) => market.id !== id));
      toast.success("Market deleted successfully!");
    } catch (error) {
      toast.error("Failed to remove market: " + error.message);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "district", headerName: "District", flex: 1 },
    {
      field: "remove",
      headerName: "Remove",
      width: 100,
      renderCell: (params) => (
        <IconButton aria-label="delete" onClick={() => removeMarket(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      field: "update",
      headerName: "Update",
      width: 100,
      renderCell: (params) => (
        <IconButton aria-label="edit" onClick={() => navigate(`/updateMarket/${params.row.id}`)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="All Markets List" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            color: colors.grey[100],
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            checkboxSelection
            rows={markets}
            columns={columns}
            getRowId={(row) => row.id}
          />
        )}
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default ListMarkets;

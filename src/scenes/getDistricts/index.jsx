import React, { useEffect, useState } from "react";
import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GetDistricts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch("http://localhost:4000/districts");
        const data = await response.json();
        const formattedData = data.map((district) => ({
          id: district._id,  // Assuming the district ID is stored as _id in the database
          name: district.name,
        }));
        setDistricts(formattedData);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
      }
    };

    fetchDistricts();
  }, []);

  const removeDistrict = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/districts/${id}`, { method: "DELETE" });
      if (response.ok) {
        setDistricts((prevDistricts) => prevDistricts.filter((district) => district.id !== id));
        toast.success("District deleted successfully!");
      } else {
        toast.error("Failed to remove district: " + response.statusText);
      }
    } catch (error) {
      toast.error("Failed to remove district: " + error.message);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "District Name", flex: 1 },
    {
      field: "remove",
      headerName: "Remove",
      width: 100,
      renderCell: (params) => (
        <IconButton aria-label="delete" onClick={() => removeDistrict(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="All Districts List" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none", color: colors.grey[100] },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={districts}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default GetDistricts;

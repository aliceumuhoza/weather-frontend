import React, { useEffect, useState } from "react";
import { Box, useTheme, IconButton, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";

const ListStaff = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await fetch("http://localhost:4000/staffs");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        const formattedData = data.map((staff) => ({
          id: staff._id,
          name: staff.name,
          email: staff.email,
          role: staff.role.name,
          district: staff.district_id.name,
        }));
        setStaffMembers(formattedData);
      } catch (error) {
        console.error("Failed to fetch staff:", error);
        toast.error("Failed to fetch staff: " + error.message);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchStaff();
  }, []);

  const removeStaff = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/staffs/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to remove staff member");
      setStaffMembers((prevStaff) => prevStaff.filter((staff) => staff.id !== id));
      toast.success("Staff member deleted successfully!");
    } catch (error) {
      toast.error("Failed to remove staff member: " + error.message);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "district", headerName: "District", flex: 1 },
    {
      field: "remove",
      headerName: "Remove",
      width: 100,
      renderCell: (params) => (
        <IconButton aria-label="delete" onClick={() => removeStaff(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      field: "update",
      headerName: "Update",
      width: 100,
      renderCell: (params) => (
        <IconButton aria-label="edit" onClick={() => navigate(`/updateStaff/${params.row.id}`)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="All Staff List" />
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
            rows={staffMembers}
            columns={columns}
            getRowId={(row) => row.id}
          />
        )}
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default ListStaff;

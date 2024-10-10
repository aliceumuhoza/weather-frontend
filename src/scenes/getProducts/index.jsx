import { Box, Typography, useTheme, IconButton, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom"; // Correct import

const Products = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:4000/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();

        // Map through products and properly extract the market name from market_id
        const formattedData = data.map((product) => ({
          id: product._id,
          name: product.name,
          market: product.market_id?.name || "No Market Assigned", // Extract market name from market_id
          price: product.price,
        }));

        setProducts(formattedData);
      } catch (error) {
        toast.error("Error fetching products: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Remove product function
  const removeProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
        toast.success("Product deleted successfully!");
      } else {
        toast.error("Failed to remove product: " + response.statusText);
      }
    } catch (error) {
      toast.error("Failed to remove product: " + error.message);
    }
  };

  // Columns for the product table
  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Product Name", flex: 1 },
    { field: "market", headerName: "Marketplace", flex: 1 },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>${params.row.price}</Typography>
      ),
    },
    {
      field: "remove",
      headerName: "Remove",
      width: 100,
      renderCell: (params) => (
        <IconButton aria-label="delete" onClick={() => removeProduct(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      field: "update",
      headerName: "Update",
      width: 100,
      renderCell: (params) => (
        <IconButton 
          aria-label="edit" 
          onClick={() => navigate(`/updateProduct/${params.row.id}`)} // Use navigate
        >
          <EditIcon />
        </IconButton>
      ),
    },
    
  ];

  return (
    <Box m="20px">
      <Header title="PRODUCTS" subtitle="List of Market Products" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            checkboxSelection
            rows={products}
            columns={columns}
            getRowId={(row) => row.id} // Specify id field
          />
        )}
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Products;

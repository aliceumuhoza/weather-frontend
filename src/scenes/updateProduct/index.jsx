import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', price: '', market_id: { name: '' } });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:4000/products/${id}`);
        if (!response.ok) throw new Error('Product not found');

        const data = await response.json();
        setProduct({
          name: data.name,
          price: data.price,
          market_id: data.market_id // Assuming market_id is populated with an object
        });
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:4000/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          market_id: product.market_id._id // Send market ID for updating
        }),
      });
      if (response.ok) {
        toast.success('Product updated successfully!');
        navigate('/products'); // Redirect to the products list after successful update
      } else {
        toast.error('Failed to update product: ' + response.statusText);
      }
    } catch (error) {
      toast.error('Failed to update product: ' + error.message);
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>Update Product</Typography>
      <Box display="flex" flexDirection="column" gap="20px">
        <TextField 
          name="name" 
          label="Name" 
          value={product.name} 
          onChange={handleChange} 
          fullWidth 
          variant="outlined"
        />
        <TextField 
          name="price" 
          label="Price" 
          value={product.price} 
          onChange={handleChange} 
          fullWidth 
          variant="outlined"
        />
        <TextField
          name="market_id"
          label="Market"
          value={product.market_id.name || ''} // Display market name instead of ID
          onChange={(e) => handleChange({ target: { name: 'market_id', value: { name: e.target.value } } })} // Update market object
          fullWidth
          variant="outlined"
        />
      </Box>
      <Button onClick={handleUpdate} variant="contained" sx={{ mt: 2 }}>
        Update Product
      </Button>
      <ToastContainer />
    </Box>
  );
};

export default UpdateProduct;
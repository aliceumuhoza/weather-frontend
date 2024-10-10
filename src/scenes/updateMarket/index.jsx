import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateMarket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [market, setMarket] = useState({ name: '', district: { name: '' } });

  // Fetch market data by ID
  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const response = await fetch(`http://localhost:4000/markets/${id}`);
        const data = await response.json();
        if (response.ok) {
          setMarket({
            name: data.name,
            district: data.district_id, // district_id is now an object, including district name
            
          });
        } else {
          toast.error('Market not found');
        }
      } catch (error) {
        toast.error('Error fetching market data: ' + error.message);
      }
    };
    fetchMarket();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district') {
      setMarket({ ...market, district: { ...market.district, name: value } });
    } else {
      setMarket({ ...market, [name]: value });
    }
  };

  // Update market by ID
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:4000/markets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: market.name,
          district_id: market.district._id, // Send district ID back for updating
        
        }),
      });
      if (response.ok) {
        toast.success('Market updated successfully!');
        navigate('/listmarket'); // Navigate to list after update
      } else {
        toast.error('Failed to update market: ' + response.statusText);
      }
    } catch (error) {
      toast.error('Failed to update market: ' + error.message);
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h4">Update Market</Typography>
      <TextField
        name="name"
        label="Market Name"
        value={market.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="district"
        label="District Name"
        value={market.district.name} // Display district name instead of ID
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ mt: 2 }}>
        Update Market
      </Button>
      <ToastContainer />
    </Box>
  );
};

export default UpdateMarket;

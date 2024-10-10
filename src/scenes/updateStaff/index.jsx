import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

const UpdateStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState({ name: '', email: '', role: {name: ''}, district_id: { name: '' } });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`http://localhost:4000/staffs/${id}`);
        if (!response.ok) throw new Error('Staff not found');
        
        const data = await response.json();

        console.log("Fetched Staff Data:", data); // Debugging line to check the API response
        
        setStaff({
          name: data.name,
          email: data.email,
          role: data.role.name, // Role is now just the ID
          district_id: data.district_id // Assuming district_id is populated with an object
        });
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchStaff();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff({ ...staff, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:4000/staffs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: staff.name,
          email: staff.email,
          role: staff.role.name, // Sending the role ID directly
          district_id: staff.district_id._id // Send district ID for updating
        }),
      });
      if (response.ok) {
        toast.success('Staff updated successfully!');
        navigate('/listuser'); // Redirect to the list of users after successful update
      } else {
        toast.error('Failed to update staff: ' + response.statusText);
      }
    } catch (error) {
      toast.error('Failed to update staff: ' + error.message);
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>Update Staff</Typography>
      <Box display="flex" flexDirection="column" gap="20px">
        <TextField 
          name="name" 
          label="Name" 
          value={staff.name} 
          onChange={handleChange} 
          fullWidth 
          variant="outlined"
          sx={{ padding: '10px' }} // Adjust padding as needed
        />
        <TextField 
          name="email" 
          label="Email" 
          value={staff.email} 
          onChange={handleChange} 
          fullWidth 
          variant="outlined"
          sx={{ padding: '10px' }} // Adjust padding as needed
        />
        <TextField 
          name="role" 
          label="Role ID" // Change label to indicate that this is the role ID
          value={staff.role} 
          onChange={handleChange} 
          fullWidth 
          variant="outlined"
          sx={{ padding: '10px' }} // Adjust padding as needed
        />
        <TextField
          name="district_id"
          label="District"
          value={staff.district_id.name || ''} // Display district name instead of ID
          onChange={(e) => handleChange({ target: { name: 'district_id', value: { name: e.target.value } } })} // Update district object
          fullWidth
          variant="outlined"
          sx={{ padding: '10px' }} // Adjust padding as needed
        />
      </Box>
      <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ mt: 2 }}>
        Update Staff
      </Button>
      <ToastContainer />
    </Box>
  );
};

export default UpdateStaff;

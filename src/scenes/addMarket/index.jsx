import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Header from "../../components/Header";

const AddMarket = () => {
  const [districts, setDistricts] = useState([]);

  // Fetch districts for the dropdown
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch("http://localhost:4000/districts");
        const data = await response.json();
        setDistricts(data);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
      }
    };

    fetchDistricts();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await fetch("http://localhost:4000/markets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to add market");
      }

      toast.success("Market added successfully!");
      resetForm(); // Reset the form after successful submission
    } catch (error) {
      toast.error("Failed to add market: " + error.message);
    }
  };

  return (
    <Box m="20px">
      <Header title="Add New Market" />
      <Formik
        initialValues={initialMarketValues}
        validationSchema={marketSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Market Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                select
                label="District"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.district_id} // Using district_id for form value
                name="district_id"
                error={!!touched.district_id && !!errors.district_id}
                helperText={touched.district_id && errors.district_id}
                sx={{ gridColumn: "span 4" }}
              >
                {districts.map((district) => (
                  <MenuItem key={district._id} value={district._id}>
                    {district.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Submit
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Validation schema for markets
const marketSchema = yup.object().shape({
  name: yup.string().required("Market name is required"),
  district_id: yup.string().required("District is required"),
});

// Initial market form values
const initialMarketValues = {
  name: "",
  district_id: "", // Set this to an empty string for the initial value
};

export default AddMarket;

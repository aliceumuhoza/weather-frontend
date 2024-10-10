import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Header from "../../components/Header";

const AddDistrict = () => {
  const [districts, setDistricts] = useState([]);

  // Fetch districts on component mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch("http://localhost:4000/districts");
        const data = await response.json();
        setDistricts(data);
      } catch (error) {
        toast.error("Failed to fetch districts: " + error.message);
      }
    };

    fetchDistricts();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await fetch("http://localhost:4000/districts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to add district");
      }

      toast.success("District added successfully!");
      resetForm(); // Reset the form after successful submission
    } catch (error) {
      toast.error("Failed to add district: " + error.message);
    }
  };

  return (
    <Box m="20px">
      <Header title="Add New District" />
      <Formik
        initialValues={initialDistrictValues}
        validationSchema={districtSchema}
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
                label="District Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
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

// Validation schema for districts
const districtSchema = yup.object().shape({
  name: yup.string().required("District name is required"),
});

// Initial district form values
const initialDistrictValues = {
  name: "",
};

export default AddDistrict;

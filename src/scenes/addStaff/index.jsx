import { Box, Button, TextField, Autocomplete } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const AddStaffForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [districts, setDistricts] = useState([]);
  const [roles, setRoles] = useState([]);

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

  // Fetch roles for the dropdown
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:4000/roles");
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const response = await fetch("http://localhost:4000/staffs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create staff");
      }

      const data = await response.json();
      toast.success("Staff created successfully!");
      console.log(data);

      // Clear form fields after successful submission
      resetForm();
    } catch (error) {
      toast.error("Failed to create staff: " + error.message);
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE STAFF" subtitle="Create a New Staff Profile" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
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
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <Autocomplete
                options={roles}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) => setFieldValue("role", value ? value._id : "")}
                onBlur={handleBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="filled"
                    label="Role"
                    error={!!touched.role && !!errors.role}
                    helperText={touched.role && errors.role}
                    sx={{ gridColumn: "span 4" }}
                  />
                )}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
              <Autocomplete
                options={districts}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) => setFieldValue("district_id", value ? value._id : "")}
                onBlur={handleBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="filled"
                    label="District"
                    error={!!touched.district_id && !!errors.district_id}
                    helperText={touched.district_id && errors.district_id}
                    sx={{
                      gridColumn: "span 4",
                      "& .MuiFilledInput-root": { height: "56px" }, // Increase height
                      "& .MuiInputBase-input": { fontSize: "16px" }, // Increase font size
                    }}
                  />
                )}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Staff
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  role: yup.string().required("Role is required"), // Validate role
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  district_id: yup.string().required("District is required"), // Validate district
});

const initialValues = {
  name: "",
  email: "",
  role: "",
  password: "",
  district_id: "", // Initial district value
};

export default AddStaffForm;

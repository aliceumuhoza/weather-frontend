import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { toast } from "react-toastify";

const AddProduct = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [markets, setMarkets] = useState([]);

  // Fetch markets from the database
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch("http://localhost:4000/markets");
        const data = await response.json();
        setMarkets(data);
      } catch (error) {
        console.error("Failed to fetch markets:", error);
      }
    };

    fetchMarkets();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await fetch("http://localhost:4000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const data = await response.json();

      console.log(data);
      toast.success("Product added successfully!");
      resetForm(); // Reset the form after successful submission
    } catch (error) {
      toast.error("Failed to add product: " + error.message);
    }
  };

  return (
    <Box m="20px">
      <Header title="Add New Product" />
      <Formik
        initialValues={initialProductValues}
        validationSchema={productSchema}
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
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Product Name"
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
                type="number"
                label="Price in $"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
                <InputLabel>Market</InputLabel>
                <Select
                  value={values.marketId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="marketId"
                  error={!!touched.marketId && !!errors.marketId}
                >
                  {markets.map((market) => (
                    <MenuItem key={market._id} value={market._id}>
                      {market.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

// Validation schema for products
const productSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  price: yup.number().required("Price is required"),
  marketId: yup.string().required("Market is required"),
});

// Initial product form values
const initialProductValues = {
  name: "",
  price: "",
  marketId: "",
};

export default AddProduct;

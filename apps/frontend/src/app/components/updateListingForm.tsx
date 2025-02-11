// "use client";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import {
  MenuItem,
  Select,
  Stack,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  Typography,
} from "@mui/material";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { BACKEND } from "../utils/constants";
import { Toast } from "./toast";
import { useRouter } from "next/navigation";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";
import { ListingType } from "../interface/listingType";

const listingSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  type: Yup.string()
    .required("Type is required")
    .oneOf(
      ["house", "land", "apartment"],
      'Type must be either "house", "land", or "apartment"',
    ),
  price: Yup.number().required("Price is required"),
  city: Yup.string().required("City is required"),
  district: Yup.string().required("District is required"),
  area: Yup.number().required("Area is required"),
  stories: Yup.number().required("Stories is required"),
  bedroom: Yup.number().required("Bedroom count is required"),
  bathroom: Yup.number().required("Bathroom count is required"),
  kitchen: Yup.number().required("Kitchen count is required"),
  car_parking: Yup.number().required("Car parking count is required"),
});

const districts: string[] = ["Kathmandu", "Lalitpur", "Bhaktapur"];

export default function UpdateListingForm({
  openDialog,
  handleCloseDialog,
  listing,
  trigger,
  setTrigger,
}: {
  openDialog: any;
  handleCloseDialog: any;
  listing: ListingType;
  trigger: Boolean;
  setTrigger: any;
}) {
  const router = useRouter();

  const [previews, setPreviews] = useState<string[]>([]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".png", ".jpg"] },
    onDrop: (acceptedFiles: File[]) => {
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    },
  });
  const files = acceptedFiles.map((file: any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const onSubmit = async (values: any, actions: FormikHelpers<any>) => {
    console.log("accepted files: ", acceptedFiles);
    actions.setSubmitting(false);

    try {
      const listingResponse = await axios.patch(
        `${BACKEND}/listing/${listing.id}`,
        values,
        { withCredentials: true },
      );
      console.log("listingResponse", listingResponse);
      Toast("success", "Listing updated successfully!");
      setTrigger(!trigger);
      if (listingResponse.status === 200) {
        const formData = new FormData();
        formData.append("id", listingResponse.data.id);
        acceptedFiles.forEach((file) => {
          formData.append("files", file);
        });
        const imageResponse = await axios.post(
          `${BACKEND}/listing/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          },
        );
        if (imageResponse.status === 201) {
          Toast("success", "Listing created successfully!");
          router.push("/listings/" + listingResponse.data.id);
        }
      }
    } catch (err) {
      Toast("error", err);
      console.log("error: ", err);
    } finally {
      actions.resetForm();
      handleCloseDialog();
    }
  };
  // const formik = useFormik
  const formik = useFormik({
    initialValues: {
      title: listing.title,
      description: listing.description,
      type: listing.type,
      price: listing.price,
      city: listing.city,
      district: listing.district,
      area: listing.area,
      stories: listing.stories,
      bedroom: listing.bedroom,
      bathroom: listing.bedroom,
      kitchen: listing.kitchen,
      car_parking: listing.car_parking,
    },
    validationSchema: listingSchema,
    onSubmit,
  });

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xl">
      <DialogTitle>
        <Typography variant="h5" paddingLeft={3}>
          Update Listing
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form action="" onSubmit={formik.handleSubmit}>
          <Stack
            direction="row"
            alignItems="stretch"
            justifyContent="space-evenly"
          >
            <Stack gap={3} margin={3} sx={{ maxWidth: "45%" }}>
              <TextField
                id="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Title"
                variant="outlined"
                error={
                  formik.errors.title && formik.touched.title ? true : false
                }
                helperText={
                  formik.errors.title && formik.touched.title
                    ? formik.errors.title
                    : ""
                }
              />
              <TextField
                id="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                error={
                  formik.errors.description && formik.touched.description
                    ? true
                    : false
                }
                helperText={
                  formik.errors.description && formik.touched.description
                    ? formik.errors.description
                    : ""
                }
              />
              <FormControl
                fullWidth
                variant="outlined"
                error={Boolean(formik.errors.type && formik.touched.type)}
              >
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  id="type"
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Type"
                >
                  <MenuItem value="house">House</MenuItem>
                  <MenuItem value="land">Land</MenuItem>
                  <MenuItem value="apartment">Apartment</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Price"
                variant="outlined"
                type="number"
                error={
                  formik.errors.price && formik.touched.price ? true : false
                }
                helperText={
                  formik.errors.price && formik.touched.price
                    ? formik.errors.price
                    : ""
                }
              />
              <TextField
                id="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="City"
                variant="outlined"
                error={formik.errors.city && formik.touched.city ? true : false}
                helperText={
                  formik.errors.city && formik.touched.city
                    ? formik.errors.city
                    : ""
                }
              />
              <FormControl
                fullWidth
                variant="outlined"
                error={Boolean(
                  formik.errors.district && formik.touched.district,
                )}
              >
                <InputLabel>District</InputLabel>
                <Select
                  labelId="type-label"
                  id="district"
                  name="district"
                  value={formik.values.district}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="District"
                >
                  {districts.map((district) => {
                    return (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    );
                  })}
                </Select>
                {formik.errors.district && (
                  <FormHelperText>{formik.errors.district}</FormHelperText>
                )}
              </FormControl>
              <Stack
                direction="row"
                alignContent="center"
                justifyContent="space-between"
                gap={3}
              >
                <TextField
                  id="area"
                  value={formik.values.area}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Area (Aana)"
                  variant="outlined"
                  type="number"
                  error={
                    formik.errors.area && formik.touched.area ? true : false
                  }
                  helperText={
                    formik.errors.area && formik.touched.area
                      ? formik.errors.area
                      : ""
                  }
                />
                <TextField
                  id="stories"
                  value={formik.values.stories}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Stories"
                  variant="outlined"
                  type="number"
                  error={
                    formik.errors.stories && formik.touched.stories
                      ? true
                      : false
                  }
                  helperText={
                    formik.errors.stories && formik.touched.stories
                      ? formik.errors.stories
                      : ""
                  }
                />
                <TextField
                  id="bedroom"
                  value={formik.values.bedroom}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Bedroom"
                  variant="outlined"
                  type="number"
                  error={
                    formik.errors.bedroom && formik.touched.bedroom
                      ? true
                      : false
                  }
                  helperText={
                    formik.errors.bedroom && formik.touched.bedroom
                      ? formik.errors.bedroom
                      : ""
                  }
                />
              </Stack>
              <Stack
                direction="row"
                alignContent="center"
                justifyContent="space-between"
                gap={3}
              >
                <TextField
                  id="bathroom"
                  value={formik.values.bathroom}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Bathroom"
                  variant="outlined"
                  type="number"
                  error={
                    formik.errors.bathroom && formik.touched.bathroom
                      ? true
                      : false
                  }
                  helperText={
                    formik.errors.bathroom && formik.touched.bathroom
                      ? formik.errors.bathroom
                      : ""
                  }
                />
                <TextField
                  id="kitchen"
                  value={formik.values.kitchen}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Kitchen"
                  variant="outlined"
                  type="number"
                  error={
                    formik.errors.kitchen && formik.touched.kitchen
                      ? true
                      : false
                  }
                  helperText={
                    formik.errors.kitchen && formik.touched.kitchen
                      ? formik.errors.kitchen
                      : ""
                  }
                />
                <TextField
                  id="car_parking"
                  value={formik.values.car_parking}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Car Parking"
                  variant="outlined"
                  type="number"
                  error={
                    formik.errors.car_parking && formik.touched.car_parking
                      ? true
                      : false
                  }
                  helperText={
                    formik.errors.car_parking && formik.touched.car_parking
                      ? formik.errors.car_parking
                      : ""
                  }
                />
              </Stack>
            </Stack>
            <Box
              sx={{
                p: 2,
                border: "1px dashed grey",
                minHeight: "100%",
                flexGrow: 1,
                marginY: 3,
                marginX: "24px",
              }}
              {...getRootProps({ className: "dropzone" })}
            >
              <Stack
                alignItems="center"
                justifyContent="center"
                height="100%"
                gap={4}
              >
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 40 }} />
                <Typography>
                  Drag and Drop images, or click to select images
                </Typography>
                {/* <ul>{files}</ul> */}
                <Stack direction="row" gap={2} flexWrap="wrap">
                  {previews.map((preview, index) => (
                    <img
                      height={100}
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const updatedPreviews = [...previews]; // Create a copy of the previews array
                        updatedPreviews.splice(index, 1); // Remove the clicked image from the copy
                        setPreviews(updatedPreviews); // Update the state with the new array
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Stack>
          <Stack alignItems="center" justifyContent="center">
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{
                fontWeight: "bold",
                backgroundColor: "#fb6749",
                padding: 1.5,
                borderRadius: 7,
                maxWidth: 230,
                "&:hover": {
                  backgroundColor: "#282e38",
                },
              }}
            >
              Update
            </Button>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

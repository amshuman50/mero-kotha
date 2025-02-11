"use client";

import HeaderBox from "@/app/components/headerBox";
import { Toast } from "@/app/components/toast";
import { BACKEND } from "@/app/utils/constants";
import { useAuth } from "@/app/utils/context/authContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ListingType } from "@/app/interface/listingType";
import { Button, Container, Stack, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Image from "next/image";

const Columns = [
  "Id",
  "Image",
  "Title",
  "Description",
  "Type",
  "Price",
  "Location",
  "Area",
  "Stories",
  "Bed",
  "Bath",
  "Kitchen",
  "Parking",
  "Created at",
  "Updated at",
  "User id",
  "Actions",
];

export default function AdminListings() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<ListingType[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id: number | undefined) => {
    if (id) {
      console.log("Delete called for listing id ", id);
      try {
        const response = await axios.delete(`${BACKEND}/listing/${id}`, {
          withCredentials: true,
        });
        if (response.statusText === "OK") {
          Toast("success", "Deleted successfully!");
          fetchData();
        }
      } catch (err) {
        Toast("error", err);
      }
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BACKEND}/listing`);
      if (response.statusText === "OK" && user) {
        setListings(response.data);
      }
    } catch (err) {
      Toast("error", err);
    }
  };

  useEffect(() => {
    fetchData();
  });

  return (
    <>
      <HeaderBox title="Listings" />
      {user && user.role === 0 && router.replace("/")}

      {user && user.role === 1 && (
        <>
          <Stack
            sx={{
              margin: 3,
              minWidth: "95%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TableContainer component={Paper} elevation={8}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    {Columns.map((col) => {
                      return (
                        <TableCell key={col} sx={{ fontWeight: "bold" }}>
                          {col}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listings &&
                    listings.map((listing) => {
                      return (
                        <TableRow
                          key={listing.id}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#eeeeee",
                              cursor: "pointer",
                            },
                          }}
                        >
                          <TableCell>{listing.id}</TableCell>
                          <TableCell>
                            <Image
                              src={`${BACKEND}/uploads/listings/${listing.images[0]}`}
                              alt="Listing image"
                              height={100}
                              width={100}
                            />
                          </TableCell>
                          <TableCell>{listing.title}</TableCell>
                          <TableCell>{listing.description}</TableCell>
                          <TableCell>{listing.type}</TableCell>
                          <TableCell>{listing.price}</TableCell>
                          <TableCell>
                            {listing.city}, {listing.district}
                          </TableCell>
                          <TableCell>{listing.area}</TableCell>
                          <TableCell>{listing.stories}</TableCell>
                          <TableCell>{listing.bedroom}</TableCell>
                          <TableCell>{listing.bathroom}</TableCell>
                          <TableCell>{listing.kitchen}</TableCell>
                          <TableCell>{listing.car_parking}</TableCell>
                          <TableCell>
                            {listing.created_at
                              ? new Date(listing.created_at).toLocaleString(
                                  "en-US",
                                  {
                                    hour12: false,
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "short",
                                    year: "2-digit",
                                  },
                                )
                              : ""}
                          </TableCell>

                          <TableCell>
                            {listing.updated_at
                              ? new Date(listing.updated_at).toLocaleString(
                                  "en-US",
                                  {
                                    hour12: false,
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "short",
                                    year: "2-digit",
                                  },
                                )
                              : ""}
                          </TableCell>

                          <TableCell>{listing.user.id}</TableCell>
                          <TableCell>
                            <Stack>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  location.replace("/listings/" + listing.id);
                                  // router.push("/listings/" + listing.id);
                                }}
                              >
                                Details
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                sx={{ marginTop: 1, paddingX: 2.3 }}
                                onClick={() => {
                                  setSelectedId(listing.id);
                                  handleClickOpen();
                                }}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText component="div" id="alert-dialog-description">
            Are you sure you want to delete the listing with id{" "}
            <Typography sx={{ fontWeight: "bold", display: "inline" }}>
              {selectedId}
            </Typography>
            ?
          </DialogContentText>
          <Stack justifyContent="center" alignItems="center" marginTop={2}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDelete(selectedId);
                handleClose();
              }}
            >
              Delete
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

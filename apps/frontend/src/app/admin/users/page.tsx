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
import { Avatar, Button, Container, Stack, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Image from "next/image";
import { UserType } from "@/app/interface/userType";

const Columns = [
  "id",
  "Avatar",
  "Email",
  "Name",
  "Phone Number",
  "Is Admin?",
  "Created At",
  "Updated At",
  "Actions",
];

export default function AdminUsers() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
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
        const response = await axios.delete(`${BACKEND}/user/delete/${id}`, {
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
      const response = await axios.get(`${BACKEND}/user/all`);
      if (response.statusText === "OK" && user) {
        setUsers(response.data);
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
                  <TableRow sx={{ fontWeight: "bold" }}>
                    {Columns.map((col) => {
                      return <TableCell key={col}>{col}</TableCell>;
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users &&
                    users.map((item) => {
                      return (
                        <TableRow
                          key={item.id}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#eeeeee",
                              cursor: "pointer",
                            },
                          }}
                        >
                          <TableCell>{item.id}</TableCell>
                          <TableCell>
                            <Avatar
                              alt="user profile image"
                              sx={{ width: 58, height: 58, cursor: "pointer" }}
                              src={`${BACKEND}/uploads/avatars/${item.avatar}`}
                            />
                          </TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.phone}</TableCell>
                          <TableCell>
                            {item.role === 1 ? "Admin" : "User"}
                          </TableCell>
                          <TableCell>
                            {item.created_at
                              ? new Date(item.created_at).toLocaleString(
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
                            {item.updated_at
                              ? new Date(item.updated_at).toLocaleString(
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
                            <Stack>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  // console.log("user info for id ", item.id);
                                  location.replace("/admin/users/" + item.id);
                                  // router.refresh();
                                  // router.push("/admin/users/" + item.id);
                                }}
                              >
                                Details
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                sx={{ marginTop: 1, paddingX: 2.3 }}
                                onClick={() => {
                                  setSelectedId(item.id);
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

"use client";

import {
  Avatar,
  Container,
  FormControl,
  OutlinedInput,
  Stack,
  Typography,
  Button,
  Box,
} from "@mui/material";
import HeaderBox from "../components/headerBox";
import { useAuth } from "../utils/context/authContext";
import { BACKEND } from "../utils/constants";
import { useEffect, useState } from "react";
import { Toast } from "../components/toast";
import axios from "axios";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";

export default function Profile() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phone);

  useEffect(() => {
    user && setName(user.name);
    user && setEmail(user.email);
    user && setPhone(user.phone);
  }, [user]);

  const handleSubmit = async () => {
    console.log(name, email, phone);
    try {
      const response = await axios.patch(
        `${BACKEND}/user/update/${user?.id}`,
        { name, email, phone },
        { withCredentials: true },
      );
      console.log(response);
      Toast("success", "Profile updated successfully!");
    } catch (err) {
      console.log(err);
      Toast("error", err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files !== null) {
      try {
        const formData = new FormData();
        user && formData.append("id", user.id.toString());
        formData.append("file", e.target.files[0]);

        const response = await axios.post(`${BACKEND}/user/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        console.log(response);
        Toast("success", "Profile image updated successfully!");
      } catch (err) {
        console.log(err);
        Toast("error", "Failed to update image");
      }
    }
  };

  return (
    <>
      <HeaderBox title="Profile" />
      <Container sx={{ marginY: 10, width: "80%" }}>
        <Stack
          direction="row"
          alignItems="start"
          justifyContent="space-between"
          gap={8}
        >
          <img
            src={BACKEND + "/uploads/avatars/" + user?.avatar}
            alt="user profile image"
          />
          <Stack justifyContent="flex-start" gap={5} marginY={3}>
            <Stack direction="row" gap={3} alignItems="center">
              <Box
                sx={{
                  backgroundColor: "#fff0ec",
                  borderRadius: 2,
                  padding: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PermIdentityOutlinedIcon
                  sx={{ color: "#fb6749", fontSize: 30 }}
                />
              </Box>
              <FormControl sx={{ width: "60ch" }}>
                <OutlinedInput
                  sx={{ fontSize: 18 }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
            </Stack>
            <Stack direction="row" gap={3} alignItems="center">
              <Box
                sx={{
                  backgroundColor: "#fff0ec",
                  borderRadius: 2,
                  padding: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MailOutlineOutlinedIcon
                  sx={{ color: "#fb6749", fontSize: 30 }}
                />
              </Box>
              <FormControl sx={{ width: "60ch" }}>
                <OutlinedInput
                  sx={{ fontSize: 18 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
            </Stack>
            <Stack direction="row" gap={3} alignItems="center">
              <Box
                sx={{
                  backgroundColor: "#fff0ec",
                  borderRadius: 2,
                  padding: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LocalPhoneOutlinedIcon
                  sx={{ color: "#fb6749", fontSize: 30 }}
                />
              </Box>
              <FormControl sx={{ width: "60ch" }}>
                <OutlinedInput
                  sx={{ fontSize: 18 }}
                  value={phone}
                  onChange={(e) => setPhone(+e.target.value)}
                />
              </FormControl>
            </Stack>

            <Stack alignItems="center" justifyContent="center">
              <Button
                onClick={handleSubmit}
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  fontWeight: "bold",
                  marginY: 3,
                  backgroundColor: "#fb6749",
                  padding: 1.5,
                  borderRadius: 7,
                  maxWidth: 230,
                  "&:hover": {
                    backgroundColor: "#282e38",
                  },
                }}
              >
                Update Profile
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

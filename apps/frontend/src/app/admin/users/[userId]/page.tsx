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
import { useEffect, useState } from "react";
import axios from "axios";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { UserType } from "@/app/interface/userType";
import { BACKEND } from "@/app/utils/constants";
import { Toast } from "@/app/components/toast";
import HeaderBox from "@/app/components/headerBox";
import EventNoteIcon from "@mui/icons-material/EventNote";

export default function UserDetails({
  params,
}: {
  params: { userId: string };
}) {
  const [userData, setUserData] = useState<UserType>();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BACKEND}/user/${params.userId}`, {
        withCredentials: true,
      });
      if (response.statusText === "OK") {
        setUserData(response.data);
      }
    } catch (err) {
      Toast("error", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <HeaderBox title="Profile" />

      {userData && (
        <Container sx={{ marginY: 10, width: "80%" }}>
          <Stack
            direction="row"
            alignItems="start"
            justifyContent="space-between"
            gap={8}
          >
            <img
              src={BACKEND + "/uploads/avatars/" + userData.avatar}
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
                    value={userData.name}
                    readOnly
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
                    value={userData.email}
                    readOnly
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
                    value={userData.phone}
                    readOnly
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
                  <EventNoteIcon sx={{ color: "#fb6749", fontSize: 30 }} />
                </Box>
                <FormControl sx={{ width: "60ch" }}>
                  <OutlinedInput
                    sx={{ fontSize: 18 }}
                    readOnly
                    value={new Date(userData.created_at).toLocaleString(
                      "en-US",
                      {
                        hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  />
                </FormControl>
              </Stack>

              {/* <Stack alignItems="center" justifyContent="center">
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
        </Stack> */}
            </Stack>
          </Stack>
        </Container>
      )}
    </>
  );
}

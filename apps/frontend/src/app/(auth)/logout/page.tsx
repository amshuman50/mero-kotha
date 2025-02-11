"use client";

import AuthBox from "@/app/components/headerBox";
import { useAuth } from "@/app/utils/context/authContext";
import { Button, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Logout() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const router = useRouter();
  return (
    <>
      {!isLoggedIn && router.replace("/")}
      <AuthBox title="logout" />
      <Container maxWidth="lg" sx={{ marginY: 14 }}>
        <Stack
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          gap={2}
        >
          <Typography variant="h4">Are you sure you want to logout?</Typography>
          <Button
            onClick={logout}
            // onClick={() => console.log("logout")}
            fullWidth
            variant="contained"
            disabled={isLoading ? true : false}
            sx={{
              mt: 4,
              mb: 2,
              backgroundColor: "#fb6749",
              padding: 1.5,
              borderRadius: 7,
              maxWidth: 230,
              "&:hover": {
                backgroundColor: "#282e38",
              },
            }}
          >
            Logout
          </Button>
        </Stack>
      </Container>
    </>
  );
}

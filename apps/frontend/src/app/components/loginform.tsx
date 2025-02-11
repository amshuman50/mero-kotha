"use client";

import {
  Container,
  Box,
  TextField,
  Stack,
  FormControlLabel,
  Button,
  Typography,
  Checkbox,
} from "@mui/material";
import { useRouter } from "next/router";

export default function LoginForm({
  emailValidate,
  email,
  setEmail,
  passwordValidate,
  password,
  setPassword,
  handleSubmit,
  isLoading,
  router,
}: any) {
  return (
    <Container maxWidth="sm" sx={{ marginLeft: 0, marginRight: 0 }}>
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          // marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            error={emailValidate === "" ? false : true}
            helperText={emailValidate}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // autoFocus
          />
          <TextField
            error={passwordValidate === "" ? false : true}
            helperText={passwordValidate}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Stack
            direction="row"
            gap={0}
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              variant="text"
              sx={{ color: "#fb6749", textTransform: "capitalize" }}
            >
              Forgot Password?
            </Button>
          </Stack>
          <Button
            onClick={handleSubmit}
            fullWidth
            variant="contained"
            disabled={isLoading ? true : false}
            sx={{
              mt: 4,
              mb: 2,
              backgroundColor: "#fb6749",
              padding: 1.5,
              borderRadius: 7,
              "&:hover": {
                backgroundColor: "#282e38",
              },
            }}
          >
            Sign In
          </Button>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Typography variant="body2">No Account?</Typography>
            <Button
              variant="text"
              sx={{ color: "#fb6749", textTransform: "capitalize" }}
              onClick={() => router.push("/register")}
            >
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}

import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function RegisterForm({
  nameValidate,
  setName,
  emailValidate,
  name,
  email,
  setEmail,
  phone,
  setPhone,
  phoneValidate,
  password,
  setPassword,
  passwordValidate,
  verifyPassword,
  verifyPwdValidate,
  setVerifyPassword,
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
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            error={nameValidate === "" ? false : true}
            helperText={nameValidate}
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
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
          />
          <TextField
            error={phoneValidate === "" ? false : true}
            helperText={phoneValidate}
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="phone"
            value={phone ? phone : ""}
            type="number"
            onChange={(e) => setPhone(e.target.value)}
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
          <TextField
            error={verifyPwdValidate === "" ? false : true}
            helperText={verifyPwdValidate}
            margin="normal"
            required
            fullWidth
            name="passwordVerify"
            label="Verify Password"
            type="password"
            id="passwordVerify"
            autoComplete="current-password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
          />
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
            Sign Up
          </Button>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Typography variant="body2">Already have an account?</Typography>
            <Button
              variant="text"
              sx={{ color: "#fb6749", textTransform: "capitalize" }}
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}

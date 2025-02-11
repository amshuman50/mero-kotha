"use client";

import { useAuth } from "@/app/utils/context/authContext";
// import { useRouter } from "next/router";
import { redirect, useRouter } from "next/navigation";
import { Container, Stack, Typography, Button } from "@mui/material";
import { useState } from "react";
import { Toast, ToastBox } from "@/app/components/toast";
import HeaderBox from "@/app/components/headerBox";
import LoginForm from "@/app/components/loginform";

export default function Login() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailValidate, setEmailValidate] = useState<string>("");
  const [passwordValidate, setPasswordValidate] = useState<string>("");

  const router = useRouter();

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  const handleSubmit = async () => {
    setEmailValidate("");
    setPasswordValidate("");

    if (email === "") setEmailValidate("Email is required");
    if (password === "") setPasswordValidate("Password is required");
    if (email !== "" && !isValidEmail(email))
      setEmailValidate("Enter a valid Email Address");

    if (
      emailValidate === "" &&
      passwordValidate === "" &&
      isValidEmail(email) &&
      password.length > 0
    ) {
      console.log("all things validated");
      login(email, password);
    }

    // console.log(response);
  };

  return (
    <>
      <HeaderBox title="Login" />

      <Container maxWidth="lg" sx={{ paddingX: 10, marginY: 10 }}>
        <Stack
          direction="row"
          alignItems="start"
          justifyContent="space-between"
        >
          <Container>
            <Typography variant="h4" mb={2}>
              Login
            </Typography>
            <Typography variant="subtitle1">
              Welcome back! Log in to your account to access all the features.{" "}
              <br />
              Need an account?
            </Typography>
            <Button
              variant="text"
              sx={{
                color: "#fb6749",
                textTransform: "capitalize",
                paddingX: 0,
              }}
              onClick={() => router.push("/register")}
            >
              Sign Up Now!
            </Button>
          </Container>
          <LoginForm
            emailValidate={emailValidate}
            email={email}
            setEmail={setEmail}
            passwordValidate={passwordValidate}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            router={router}
          />
        </Stack>
      </Container>
    </>
  );
}

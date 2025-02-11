"use client";

import { useAuth } from "@/app/utils/context/authContext";
// import { useRouter } from "next/router";
import { redirect, useRouter } from "next/navigation";
import {
  Container,
  Stack,
  Typography,
  Button,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState } from "react";
import { Toast, ToastBox } from "@/app/components/toast";
import HeaderBox from "@/app/components/headerBox";
import LoginForm from "@/app/components/loginform";
import RegisterForm from "@/app/components/signupform";
import axios from "axios";
import { BACKEND } from "@/app/utils/constants";

export default function Register() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [verifyPassword, setVerifyPassword] = useState<string>("");
  const [phone, setPhone] = useState<number>(0);

  const [nameValidate, setNameValidate] = useState<string>("");
  const [emailValidate, setEmailValidate] = useState<string>("");
  const [passwordValidate, setPasswordValidate] = useState<string>("");
  const [verifyPwdValidate, setVerifyPwdValidate] = useState<string>("");
  const [phoneValidate, setPhoneValidate] = useState<string>("");

  const [registerLoading, setRegisterLoading] = useState<boolean>(false);

  const router = useRouter();

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isPhoneNumber(phone: number | undefined): boolean {
    if (phone) {
      const numberString = phone.toString();
      const phoneNumberPattern = /^9\d{9}$/;
      return phoneNumberPattern.test(numberString);
    } else return false;
  }

  const handleSubmit = async () => {
    setNameValidate("");
    setEmailValidate("");
    setPasswordValidate("");
    setVerifyPwdValidate("");
    setPhoneValidate("");

    // Validate fields
    let isValid = true;
    if (!name) {
      setNameValidate("Name is required");
      isValid = false;
    }
    if (!email) {
      setEmailValidate("Email is required");
      isValid = false;
    }
    if (!password) {
      setPasswordValidate("Password is required");
      isValid = false;
    }
    if (!phone) {
      setPhoneValidate("Phone is required");
      isValid = false;
    }
    if (!isValidEmail(email)) {
      setEmailValidate("Enter valid email!");
      isValid = false;
    }
    if (!verifyPassword || verifyPassword !== password) {
      setVerifyPwdValidate("Passwords do not match!");
      isValid = false;
    }
    if (phone && !isPhoneNumber(phone)) {
      setPhoneValidate("Enter a valid phone number!");
      isValid = false;
    }

    if (isValid) {
      setRegisterLoading(true);
      try {
        const response = await axios.post(
          `${BACKEND}/user/register/`,
          { name, email, password, phone },
          { withCredentials: true },
        );
        if (response.status === 201) {
          Toast("success", "Registered Successfully!");
        }
      } catch (error: any) {
        Toast("error", error.response.data.message);
      } finally {
        setRegisterLoading(false);
      }
    }
  };

  return (
    <>
      <HeaderBox title="Register" />

      <Container maxWidth="lg" sx={{ paddingX: 10, marginY: 10 }}>
        <Stack
          direction="row"
          alignItems="start"
          justifyContent="space-between"
        >
          <Container>
            <Typography variant="h4" mb={2}>
              Sign up
            </Typography>
            <Typography variant="subtitle1">
              Unlock access to exclusive listings by creating your account
              today! Join our real estate community and discover your dream
              home. <br />
              Already have an account?
            </Typography>
            <Button
              variant="text"
              sx={{
                color: "#fb6749",
                textTransform: "capitalize",
                paddingX: 0,
                justifyContent: "start",
              }}
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </Container>

          <RegisterForm
            nameValidate={nameValidate}
            setName={setName}
            emailValidate={emailValidate}
            name={name}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            phoneValidate={phoneValidate}
            password={password}
            setPassword={setPassword}
            passwordValidate={passwordValidate}
            verifyPassword={verifyPassword}
            verifyPwdValidate={verifyPwdValidate}
            setVerifyPassword={setVerifyPassword}
            handleSubmit={handleSubmit}
            isLoading={registerLoading}
            router={router}
          />
        </Stack>
      </Container>
    </>
  );
}

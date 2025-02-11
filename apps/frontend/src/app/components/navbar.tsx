"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { Button, Divider, Stack } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../utils/context/authContext";
import ProfileMenu from "./profileMenu";
import { BACKEND } from "../utils/constants";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
}

function ElevationScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    style: {
      backgroundColor: trigger ? "rgba(40, 46, 56, 1)" : "transparent", // Change the background color based on scroll position
      transition: "background-color 0.3s ease-in-out", // Add transition effect
    },
  });
}

const navItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Listing",
    href: "/listings",
  },
  {
    name: "Conversations",
    href: "/chat",
  },
];

const adminNavItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Listing",
    href: "/admin/listings",
  },
  {
    name: "Users",
    href: "/admin/users",
  },
];

export default function Navbar() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const router = useRouter();
  return (
    <ElevationScroll>
      <AppBar color="transparent" position="fixed" sx={{ border: "3px" }}>
        {/* <Toolbar> */}
        {/* <Typography variant="h6" component="div" color="white">
            Scroll to elevate App bar
          </Typography> */}
        <Stack justifyContent="center" alignItems="center" direction="row">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            padding={3}
            width="70%"
          >
            <Stack
              direction="row"
              alignItems="center"
              gap={2}
              onClick={() => router.push("/")}
              sx={{ cursor: "pointer" }}
            >
              <Image
                src="/home_logo.png"
                alt="home logo"
                height={56}
                width={56}
              />
              <Typography variant="h6" color="white">
                MeroKotha
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
              gap={3}
            >
              {user?.role === 1 &&
                adminNavItems.map((item) => {
                  return (
                    <Button
                      key={item.name}
                      onClick={(e) => {
                        e.preventDefault();
                        location.replace(item.href);
                        // router.refresh();
                        // router.push(item.href);
                        // router.refresh();
                        // window.history.pushState(null, item.href);
                      }}
                      variant="text"
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(229, 231, 235, 0.25)", // Transparent grey color
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        color="white"
                        textTransform="capitalize"
                      >
                        {item.name}
                      </Typography>
                    </Button>
                  );
                })}
              {user?.role === 0 &&
                navItems.map((item) => {
                  return (
                    <Button
                      key={item.name}
                      onClick={() => {
                        router.push(item.href);
                      }}
                      variant="text"
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(229, 231, 235, 0.25)", // Transparent grey color
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        color="white"
                        textTransform="capitalize"
                      >
                        {item.name}
                      </Typography>
                    </Button>
                  );
                })}
            </Stack>
            {isLoggedIn ? (
              <ProfileMenu
                picLink={BACKEND + "/uploads/avatars/" + user?.avatar}
              />
            ) : (
              <Button
                variant="outlined"
                // href="/login"
                onClick={() => router.push("/login")}
                sx={{
                  borderRadius: 4,
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    backgroundColor: "rgba(229, 231, 235, 0.25)",
                    borderColor: "white",
                  },
                }}
              >
                Login
              </Button>
            )}
          </Stack>
        </Stack>
        {/* </Toolbar> */}
        <Divider color="transparent" />
      </AppBar>
    </ElevationScroll>
    // <Toolbar />
  );
}

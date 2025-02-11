"use client";

import { useAuth } from "../utils/context/authContext";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import BounceLoader from "react-spinners/BounceLoader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND } from "../utils/constants";
import { Toast } from "../components/toast";
import { ListingType } from "../interface/listingType";
import ListingCard from "../components/listingCard";

export default function HomePage() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const router = useRouter();

  const [latestListings, setLatestListings] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND}/search?limit=3`);
        if (response.statusText === "OK") {
          console.log(response.data);
          setLatestListings(response.data);
        } else {
          Toast("error", "Failed to load lastest listings!");
        }
      } catch (err: any) {
        console.error(`Error: ${err}`);
        Toast("error", err || "Server error");
      }
      console.log("latestListings : ", latestListings);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <BounceLoader color="#36d7b7" size={150} />;
  }

  return (
    <>
      {/* <Navbar /> */}
      <Box sx={{ width: "100%", height: "100vh", overflow: "hidden" }}>
        <Box
          sx={{ top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}
        >
          <Box
            component="div"
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              filter: "blur(3px) brightness(0.5)",
              backgroundImage: "url('/modern_building.jpg')",
              overflow: "hidden",
              backdropFilter: "none",
              transform: "scale(1.1)",
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            textAlign: "left",
            color: "white",
          }}
        >
          <Typography variant="h2" fontWeight="bold">
            Find your perfect <br /> Room with us
          </Typography>
          <Typography variant="subtitle1" lineHeight="3">
            Find your perfect Room here!
          </Typography>
        </Box>
      </Box>
      <Container maxWidth="lg" sx={{ paddingX: 10, marginY: 10 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack gap={1}>
            <Typography variant="h3" fontWeight="bold">
              Latest Room Listings
            </Typography>
            <Typography variant="subtitle1">
              Our latest listings at a glance. Explore Rooms from all sizes and
              types
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            onClick={() => router.push("/listings")}
            sx={{
              borderRadius: 2,
              paddingX: 3,
              paddingY: 1,
              fontWeight: "bold",
              textTransform: "capitalize",
              fontSize: [18],
              color: "#fb6749",
              borderColor: "#fb6749",
              "&:hover": {
                borderColor: "#fb6749",
                backgroundColor: "#fb6749",
                color: "white",
              },
            }}
          >
            Browse All Listings
          </Button>
        </Stack>

        {/* <LatestListingCard latestListings={latestListings} /> */}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          marginY={5}
        >
          {latestListings &&
            latestListings.map((item: any) => {
              return <ListingCard key={item.id} listing={item} />;
            })}
        </Stack>
      </Container>
    </>
  );
}

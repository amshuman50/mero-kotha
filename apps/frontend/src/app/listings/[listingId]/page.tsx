"use client";

import HeaderBox from "@/app/components/headerBox";
import { Toast } from "@/app/components/toast";
import { ListingType } from "@/app/interface/listingType";
import { BACKEND, MODEL_BACKEND } from "@/app/utils/constants";
import { useAuth } from "@/app/utils/context/authContext";
import axios from "axios";
import { Metadata } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import Carousel from "react-spring-3d-carousel";
import { v4 as uuidv4 } from "uuid";
import { config } from "react-spring";
import {
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  Box,
  FormControl,
  OutlinedInput,
  Avatar,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import ShowerIcon from "@mui/icons-material/Shower";
import KitchenIcon from "@mui/icons-material/Kitchen";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CropFreeIcon from "@mui/icons-material/CropFree";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CorporateFare from "@mui/icons-material/CorporateFare";
import FeatureCard from "@/app/components/featureCard";
import UpdateListingForm from "@/app/components/updateListingForm";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { useRouter } from "next/navigation";
import ListingCard from "@/app/components/listingCard";

type Props = {
  params: {
    listingId: string;
  };
};

// export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
//   return {
//     title: `Property ${params.listingId}`,
//   };
// };

export default function ListingDetails({
  params,
}: {
  params: { listingId: string };
}) {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const [listing, setListing] = useState<ListingType | null>(null);
  const [slides, setSlides] = useState<any | null>(null);
  const [trigger, setTrigger] = useState<Boolean>(false);
  const [recommendPrice, setRecommendedPrice] = useState<number>();
  const [latestListings, setLatestListings] = useState<any>(null);

  const router = useRouter();

  // dialog box
  const [openDialog, setOpenDialog] = useState(false);
  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND}/listing/${params.listingId}`,
        );
        if (response.statusText === "OK") {
          setListing(response.data);

          const price = await axios.post(
            `${MODEL_BACKEND}/recommendation`,
            {
              city: response.data.city,
              district: response.data.district,
              area: response.data.area,
              stories: response.data.stories,
              bedroom: response.data.bedroom,
              bathroom: response.data.bathroom,
              kitchen: response.data.kitchen,
              car_parking: response.data.car_parking,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          setRecommendedPrice(price.data.Price);
        } else {
          Toast("error", "Failed to load lastest listings!");
        }
      } catch (err: any) {
        console.error(`Error: ${err}`);
        Toast("error", err);
      }
    };

    fetchData();
  }, [trigger]);

  useEffect(() => {
    if (listing) {
      const imgList = listing.images.map((img, index) => ({
        key: uuidv4(),
        content: (
          <img
            key={index}
            // width={0}
            // height={0}
            // sizes="100vw"
            // style={{ width: "100%", height: "auto" }}
            src={`${BACKEND}/uploads/listings/${img}`}
            alt={`Slide ${index}`}
          />
        ),
      }));
      setSlides(imgList);
    }
  }, [listing]);

  useEffect(() => {
    console.log(slides);
  }, [slides]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND}/search?limit=3`);
        if (response.statusText === "OK") {
          setLatestListings(response.data);
        } else {
          Toast("error", "Failed to load lastest listings!");
        }
      } catch (err: any) {
        console.error(`Error: ${err}`);
        Toast("error", err || "Server error");
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <HeaderBox title="Listing Details" />
      <Container maxWidth="lg" sx={{ marginTop: 10 }}>
        <Stack
          direction="row"
          gap={3}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h3">{listing?.title}</Typography>
          <Typography variant="h3">
            Rs. {listing?.price.toLocaleString("en-IN")}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="body1" marginTop={1} marginBottom={3}>
            {listing?.city}, {listing?.district}
          </Typography>
          <Typography variant="body1" marginTop={1} marginBottom={3}>
            (Recommended Price) Rs.{" "}
            {recommendPrice ? recommendPrice.toLocaleString("en-IN") : ""}
          </Typography>
        </Stack>

        {user && listing && listing.user.id === user.id && (
          <Stack>
            <Button
              onClick={handleClickOpen}
              fullWidth
              variant="contained"
              disabled={isLoading ? true : false}
              sx={{
                alignSelf: "end",
                marginBottom: 3,
                fontWeight: "bold",
                backgroundColor: "#fb6749",
                padding: 1.5,
                borderRadius: 7,
                maxWidth: 230,
                "&:hover": {
                  backgroundColor: "#282e38",
                },
              }}
            >
              Edit
            </Button>
          </Stack>
        )}

        <Container sx={{ width: "100%", height: "500px", margin: "0 auto" }}>
          {slides && (
            <Carousel
              slides={slides}
              showNavigation
              goToSlide={0}
              offsetRadius={2}
            />
          )}
        </Container>

        <Stack
          marginY={14}
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Stack width="50%" height="100%">
            <Stack
              direction="column"
              alignItems="flex-start"
              justifyContent="space-between"
              height="100%"
            >
              <div>
                <Typography variant="h4">About this Property</Typography>
                <Typography variant="subtitle1">
                  {listing?.description}
                </Typography>
              </div>
            </Stack>
          </Stack>
          <Container
            sx={{
              width: "50%",
              backgroundColor: "#282e38",
              padding: 4,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h4"
              fontSize={22}
              color="white"
              fontWeight="bold"
              paddingTop={1}
              paddingBottom={2}
            >
              Features
            </Typography>

            <Grid
              container
              rowSpacing={2.5}
              columnSpacing={2.5}
              columns={2}
              justifyContent="space-between"
            >
              <FeatureCard
                title="Stories"
                icon={CorporateFare}
                value={listing?.stories}
              />
              <FeatureCard
                title="Area"
                icon={CropFreeIcon}
                value={listing?.area}
              />
              <FeatureCard
                title="Bathroom"
                icon={ShowerIcon}
                value={listing?.bathroom}
              />
              <FeatureCard
                title="Bedroom"
                icon={HotelIcon}
                value={listing?.bedroom}
              />
              <FeatureCard
                title="Kitchen"
                icon={KitchenIcon}
                value={listing?.kitchen}
              />
              <FeatureCard
                title="Parking"
                icon={DirectionsCarIcon}
                value={listing?.car_parking}
              />
            </Grid>
          </Container>
        </Stack>
      </Container>

      <Container
        sx={{
          width: "100vw",
          height: "60vh",
          backgroundColor: "#282e38",
          margin: 0,
          padding: 0,
          minWidth: "100%",
        }}
      >
        <Container>
          <Typography
            variant="h4"
            sx={{ color: "white", fontWeight: "bold", paddingTop: 5 }}
          >
            Seller Details
          </Typography>
          <Stack direction="row" alignItems="start" gap={10} marginY={6}>
            <Avatar
              alt="user profile image"
              sx={{ width: 300, height: 300 }}
              src={
                listing?.user.avatar
                  ? `${BACKEND}/uploads/avatars/${listing.user.avatar}`
                  : "/default.jpg"
              }
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
                <Typography variant="h5" sx={{ color: "white" }}>
                  {listing?.user.name}
                </Typography>
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
                <Typography variant="h5" sx={{ color: "white" }}>
                  {listing?.user.email}
                </Typography>
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
                <Typography variant="h5" sx={{ color: "white" }}>
                  +977 {listing?.user.phone}
                </Typography>
              </Stack>
              {listing?.user.id !== user?.id && (
                <Stack alignItems="center" justifyContent="center">
                  <Button
                    onClick={() => {
                      if (isLoggedIn) {
                        router.push(`/chat?userId=${listing?.user.id}`);
                      } else {
                        router.push("/login");
                      }
                    }}
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{
                      fontWeight: "bold",
                      marginY: 3,
                      backgroundColor: "#fb6749",
                      padding: 2,
                      borderRadius: 7,
                      maxWidth: 230,
                      "&:hover": {
                        backgroundColor: "#282e38",
                      },
                    }}
                  >
                    {isLoggedIn ? "Send Message" : "Login to continue"}
                  </Button>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Container>
      </Container>

      <Container maxWidth="lg" sx={{ paddingX: 10, marginY: 10 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack gap={1}>
            <Typography variant="h3" fontWeight="bold">
              Other listings you may like
            </Typography>
          </Stack>
        </Stack>

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

      {listing && (
        <UpdateListingForm
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          listing={listing}
          trigger={trigger}
          setTrigger={setTrigger}
        />
      )}
    </>
  );
}

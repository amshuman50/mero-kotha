"use client";

import { useRouter } from "next/navigation";
import HeaderBox from "../components/headerBox";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND } from "../utils/constants";
import { Toast } from "../components/toast";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DropDown from "../components/dropDown";
import ListingCard from "../components/listingCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ListingType } from "../interface/listingType";
import { useAuth } from "../utils/context/authContext";

type QueryParams = {
  [key: string]: string | number | null;
};

const initialQueryParams = {
  query: null,
  type: null,
  city: null,
  district: null,
  minPrice: null,
  maxPrice: null,
  sortByPrice: null,
  sortByDate: null,
  limit: null,
};

export default function Listings() {
  const { user, isLoggedIn } = useAuth();

  const [queryParams, setQueryParams] =
    useState<QueryParams>(initialQueryParams);
  const [listings, setListings] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [districts, setDistricts] = useState<any>();

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedMinPrice, setSelectedMinPrice] = useState<number | null>(null);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | null>(null);

  const updateQueryParam = (key: string, value: string | number | null) => {
    setQueryParams((prevParams) => ({
      ...prevParams,
      [key]: value ? value : null,
    }));
  };

  const clearFilters = () => {
    setQueryParams(initialQueryParams);
    setSearchQuery("");
    setSelectedDistrict("");
    setSelectedOrder("");
    setSelectedType("");
    setSelectedCity("");
    setSelectedMinPrice(null);
    setSelectedMaxPrice(null);
  };

  const fetchData = async (paramsUrl: string) => {
    try {
      const response = await axios.get(
        `${BACKEND}/search?${paramsUrl.slice(1)}`,
      );
      if (response.statusText === "OK") {
        // console.log(response.data);
        if (isLoggedIn && user) {
          const filteredList = response.data.filter(
            (listing: ListingType) => listing.user.id !== user.id,
          );
          setListings(filteredList);
        } else {
          setListings(response.data);
        }
      }
    } catch (err: any) {
      console.error(`Error: ${err}`);
      Toast("error", err || "Server error");
    }
    // console.log("Listings : ", listings);
  };

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(`${BACKEND}/district`);
        if (response.statusText === "OK") {
          console.log("districts: ", response.data);
          setDistricts(
            Object.values(response.data).map((item: any) => item.name),
          );
        }
      } catch (err: any) {
        console.error(`Error: ${err}`);
        Toast("error", err || "Server error");
      }
    };
    fetchDistricts();
  }, []);

  // useEffect(() => {
  //   console.log("listings form use effect: ", listings);
  // }, [listings]);
  // useEffect(() => {
  //   console.log("districts form use effect: ", districts);
  // }, [districts]);

  useEffect(() => {
    let paramsUrl = "";

    const filteredParams = Object.entries(queryParams)
      .filter(([_, value]) => value !== null)
      .reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {} as QueryParams,
      );

    for (const key in filteredParams) {
      if (Object.hasOwnProperty.call(filteredParams, key)) {
        // console.log(`${key}: ${filteredParams[key]}`);
        paramsUrl += `&${key}=${filteredParams[key]}`;
      }
    }

    console.log("paramsUrl: ", paramsUrl.slice(1));

    fetchData(paramsUrl);
  }, [queryParams, user]);

  return (
    <>
      <HeaderBox title="Listings" />

      <Container maxWidth="lg" sx={{ marginY: 10 }}>
        <Stack alignItems="center" justifyContent="center" marginX={3.5}>
          <Paper
            // component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 3,
              border: 1.5,
              borderColor: "#282e38",
              width: "100%",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Properties"
              inputProps={{ "aria-label": "search properties" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateQueryParam("query", searchQuery);
              }}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Stack>

        <Container maxWidth="md" sx={{ marginTop: 4 }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <FilterAltIcon />
              <Typography paddingX={3}>Filters</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Container maxWidth="lg">
                <Stack
                  sx={{ flexDirection: { xs: "column", sm: "row" } }}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <DropDown
                    menu={districts}
                    label="District"
                    initialValue={selectedDistrict}
                    setter={setSelectedDistrict}
                    updateQueryParam={updateQueryParam}
                  />

                  <DropDown
                    menu={[
                      "Newest First",
                      "Oldest First",
                      "Price Low to High",
                      "Price High to Low",
                    ]}
                    label="Sort By"
                    initialValue={selectedOrder}
                    setter={setSelectedOrder}
                    updateQueryParam={updateQueryParam}
                  />
                </Stack>
              </Container>

              <Container maxWidth="lg">
                <Stack
                  sx={{ flexDirection: { xs: "column", sm: "row" } }}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack width="100%">
                    <Typography marginY={1.5} marginX={2}>
                      City:
                    </Typography>
                    <TextField
                      sx={{ m: 1 }}
                      variant="outlined"
                      label="City"
                      value={selectedCity}
                      onChange={(event) => {
                        setSelectedCity(event.target.value);
                        updateQueryParam("city", event.target.value);
                      }}
                    />
                  </Stack>

                  <DropDown
                    menu={["house", "land", "apartment"]}
                    label="Property Type"
                    initialValue={selectedType}
                    setter={setSelectedType}
                    updateQueryParam={updateQueryParam}
                  />
                </Stack>
              </Container>

              <Container maxWidth="lg">
                <Stack
                  sx={{ flexDirection: { xs: "column", sm: "row" } }}
                  alignItems="center"
                  justifyContent="space-between"
                  gap={3}
                >
                  <Stack
                    width="100%"
                    marginY={2}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <TextField
                      type="number"
                      sx={{ m: 1 }}
                      variant="outlined"
                      label="Min Price"
                      value={selectedMinPrice ? selectedMinPrice : ""}
                      onChange={(event) => {
                        setSelectedMinPrice(+event.target.value);
                        // updateQueryParam("minPrice", +event.target.value);
                      }}
                    />
                    -
                    <TextField
                      type="number"
                      sx={{ m: 1 }}
                      variant="outlined"
                      label="Max Price"
                      value={selectedMaxPrice ? selectedMaxPrice : ""}
                      onChange={(event) => {
                        setSelectedMaxPrice(+event.target.value);
                      }}
                    />
                    <Button
                      onClick={() => {
                        updateQueryParam("minPrice", selectedMinPrice);
                        updateQueryParam("maxPrice", selectedMaxPrice);
                      }}
                      fullWidth
                      variant="outlined"
                      sx={{
                        maxWidth: 60,
                        borderColor: "#282e38",
                        color: "#282e38",
                        padding: 1.4,
                        paddingX: 8,
                        borderRadius: 7,
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "#fb6749",
                          borderColor: "#fb6749",
                          color: "white",
                        },
                      }}
                    >
                      Apply
                    </Button>
                  </Stack>

                  <Button
                    onClick={clearFilters}
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: "#fb6749",
                      padding: 1.4,
                      borderRadius: 7,
                      textTransform: "capitalize",
                      fontWeight: "bold",
                      fontSize: 18,
                      "&:hover": {
                        backgroundColor: "#282e38",
                      },
                    }}
                  >
                    Clear Filters
                  </Button>
                </Stack>
              </Container>
            </AccordionDetails>
          </Accordion>
        </Container>
      </Container>

      <Container maxWidth="lg" sx={{ marginY: 10 }}>
        <Grid
          container
          columns={{ xs: 1, sm: 3 }}
          gap={3}
          alignItems="center"
          justifyContent="center"
        >
          {listings &&
            listings.map((item: any) => {
              return (
                <Grid item key={item.id}>
                  <ListingCard listing={item} />
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </>
  );
}

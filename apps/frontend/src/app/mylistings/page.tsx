"use client";

import { useRouter } from "next/navigation";
import HeaderBox from "../components/headerBox";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND } from "../utils/constants";
import { Toast } from "../components/toast";
import {
  Container,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ListingCard from "../components/listingCard";
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

export default function MyListings() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const [queryParams, setQueryParams] =
    useState<QueryParams>(initialQueryParams);
  const [listings, setListings] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const updateQueryParam = (key: string, value: string | number | null) => {
    setQueryParams((prevParams) => ({
      ...prevParams,
      [key]: value ? value : null,
    }));
  };

  const fetchData = async (paramsUrl: string) => {
    try {
      const response = await axios.get(
        `${BACKEND}/search?${paramsUrl.slice(1)}`,
      );
      if (response.statusText === "OK" && user !== null) {
        // console.log(response.data);
        const filteredList = response.data.filter(
          (list: ListingType) => list.user.id === user.id,
        );
        setListings(filteredList);
      }
    } catch (err: any) {
      console.error(`Error: ${err}`);
      Toast("error", err || "Server error");
    }
  };

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
        paramsUrl += `&${key}=${filteredParams[key]}`;
      }
    }

    console.log("paramsUrl: ", paramsUrl.slice(1));

    fetchData(paramsUrl);
  }, [queryParams, user]);

  return (
    <>
      <HeaderBox title="My Listings" />

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

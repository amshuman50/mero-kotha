import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { BACKEND } from "../utils/constants";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import HotelIcon from "@mui/icons-material/Hotel";
import ShowerIcon from "@mui/icons-material/Shower";
import KitchenIcon from "@mui/icons-material/Kitchen";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CropFreeIcon from "@mui/icons-material/CropFree";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useRouter } from "next/navigation";

export default function ListingCard({ listing }: any) {
  const router = useRouter();
  return (
    <Card
      sx={{ width: 365, borderRadius: 2 }}
      key={listing.id}
      onClick={() => router.push("/listings/" + listing.id)}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={`${BACKEND}/uploads/listings/${listing.images[0]}`}
          alt="property image"
        />
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            marginY={1.5}
            marginX={0}
          >
            <Chip
              label="For Sale"
              sx={{ backgroundColor: "#fb6749", color: "white" }}
            />
            <Typography textTransform="capitalize">{listing.type}</Typography>
          </Stack>
          <Typography variant="h5">{listing.title}</Typography>
          <Typography variant="h4" fontWeight="bold" lineHeight={1.3}>
            Rs. {Number(listing.price).toLocaleString("en-IN")}
          </Typography>
        </CardContent>
        <CardContent
          sx={{ marginX: 2.5, border: 2, color: "#e9eaeb", borderRadius: 1.2 }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <CorporateFareIcon sx={{ color: "#282e38" }} />
              <Typography color="#282e38">{listing.area}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={2}>
              <HotelIcon sx={{ color: "#282e38" }} />
              <Typography color="#282e38">{listing.bedroom}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={2}>
              <ShowerIcon sx={{ color: "#282e38" }} />
              <Typography color="#282e38">{listing.bathroom}</Typography>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ marginTop: 2 }}
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <KitchenIcon sx={{ color: "#282e38" }} />
              <Typography color="#282e38">{listing.kitchen}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={2}>
              <DirectionsCarIcon sx={{ color: "#282e38" }} />
              <Typography color="#282e38">{listing.car_parking}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={2}>
              <CropFreeIcon sx={{ color: "#282e38" }} />
              <Typography color="#282e38">{listing.area}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ marginX: 2.5, marginY: 1.3 }}>
        <LocationOnIcon />
        <Typography>
          {listing.city}, {listing.district}
        </Typography>
      </CardActions>
    </Card>
  );
}

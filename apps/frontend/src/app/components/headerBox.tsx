import { Box, Divider, Typography } from "@mui/material";

export default function HeaderBox({ title }: { title: string }) {
  return (
    <>
      <Box
        height={
          title === "Listings" ||
          title === "Conversations" ||
          title === "Profile" ||
          title === "User Details"
            ? "32vh"
            : "40vh"
        }
        sx={{ width: "100%", overflow: "hidden" }}
      >
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
              backgroundImage: "url('/modern_house_login.jpeg')",
              overflow: "hidden",
              transform: "scale(1.1)",
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
          }}
        >
          <Typography variant="h2" fontWeight="bold">
            {title}
          </Typography>
        </Box>
      </Box>

      <Divider color="#fb6749" />
    </>
  );
}

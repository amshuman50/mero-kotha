import {
  Box,
  Container,
  Grid,
  Stack,
  SvgIconProps,
  Typography,
} from "@mui/material";

export default function FeatureCard({
  title,
  icon: Icon,
  value,
}: {
  title: string;
  icon: React.ElementType<SvgIconProps>;
  value: any;
}) {
  return (
    <Grid item width="50%">
      <Container sx={{ backgroundColor: "white", borderRadius: 2 }}>
        <Stack
          alignItems="flex-start"
          justifyContent="space-between"
          gap={2}
          paddingY={2}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Typography color="#8f98a5" fontSize={18}>
              {title}
            </Typography>
            <Box
              sx={{
                backgroundColor: "#fff0ec",
                borderRadius: 2,
                padding: 0.8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon sx={{ color: "#fb6749" }} />
            </Box>
          </Stack>
          <Typography fontWeight="bold">{value}</Typography>
        </Stack>
      </Container>
    </Grid>
  );
}

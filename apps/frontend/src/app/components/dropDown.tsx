import {
  FormControl,
  Stack,
  Typography,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function DropDown({
  menu,
  label,
  initialValue,
  setter,
  updateQueryParam,
}: {
  menu: string[];
  label: string;
  initialValue: string;
  setter: any;
  updateQueryParam: any;
}) {
  return (
    <>
      <Stack width="100%">
        <Typography marginY={1.5} marginX={2}>
          {label} :
        </Typography>
        <FormControl sx={{ m: 1 }} size="medium">
          <InputLabel>{label}</InputLabel>
          <Select
            value={initialValue}
            label={label}
            size="medium"
            onChange={(event) => {
              setter(event.target.value);
              if (label === "District")
                updateQueryParam("district", event.target.value);
              if (label === "Property Type")
                updateQueryParam("type", event.target.value);
              if (label === "Sort By") {
                updateQueryParam("sortByDate", null);
                updateQueryParam("sortByPrice", null);
                if (event.target.value === "Newest First")
                  updateQueryParam("sortByDate", "desc");
                if (event.target.value === "Oldest First")
                  updateQueryParam("sortByDate", "asc");
                if (event.target.value === "Price Low to High")
                  updateQueryParam("sortByPrice", "asc");
                if (event.target.value === "Price High to Low")
                  updateQueryParam("sortByPrice", "desc");
              }
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {menu &&
              menu.map((menuItem: string) => {
                return (
                  <MenuItem key={menuItem} value={menuItem}>
                    {menuItem}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}

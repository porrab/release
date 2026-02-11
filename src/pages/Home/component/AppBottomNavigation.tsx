// components/AppBottomNavigation.tsx
import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { SxProps, Theme } from "@mui/system";

type Props = {
  value: number | string;
  onChange: (newValue: number | string) => void;

  sx?: SxProps<Theme>;
};

const AppBottomNavigation: React.FC<Props> = ({ value, onChange, sx }) => {
  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(_event, newValue) => onChange(newValue)}
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        ...((sx as object) ?? {}),
      }}
    >
      <BottomNavigationAction
        label="Performance"
        value="performance"
        icon={<TrendingUpIcon />}
        onClick={() => onChange("performance")}
      />
      <BottomNavigationAction
        label="Favorites"
        value="favorites"
        icon={<FavoriteIcon />}
        onClick={() => onChange("favorites")}
      />
      <BottomNavigationAction
        label="Nearby"
        value="nearby"
        icon={<LocationOnIcon />}
        onClick={() => onChange("nearby")}
      />
    </BottomNavigation>
  );
};

export default AppBottomNavigation;

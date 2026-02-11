"use client";

import { Stack, IconButton, Typography } from "@mui/material";
import {
  TbLayoutDashboard,
  TbCalendar,
  TbPlus,
  TbChartBar,
} from "react-icons/tb";
import { useState } from "react";

export const Menu = () => {
  const [active, setActive] = useState("summary");

  const items = [
    { key: "summary", icon: <TbLayoutDashboard size={22} />, label: "Summary" },
    { key: "calendar", icon: <TbCalendar size={22} />, label: "Calendar" },
    { key: "insights", icon: <TbChartBar size={22} />, label: "Insights" },
  ];

  return (
    <Stack
      position="fixed"
      bottom={16}
      left="50%"
      sx={{ transform: "translateX(-50%)", backdropFilter: "blur(12px)" }}
      width="calc(100% - 32px)"
      maxWidth={500}
      height={70}
      borderRadius={5}
      bgcolor="rgba(255,255,255,0.85)"
      boxShadow="0 10px 30px rgba(0,0,0,0.15)"
      direction="row"
      alignItems="center"
      justifyContent="space-around"
      zIndex={1000}
    >
      {items.map((item) => (
        <Stack
          key={item.key}
          alignItems="center"
          justifyContent="center"
          sx={{
            color: active === item.key ? "black" : "grey",
            transition: "0.2s",
            cursor: "pointer",
          }}
          onClick={() => setActive(item.key)}
        >
          {item.icon}
          <Typography fontSize={11}>{item.label}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};

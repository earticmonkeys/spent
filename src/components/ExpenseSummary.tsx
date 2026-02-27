"use client";

import { Stack, Typography, Divider } from "@mui/material";
import { formatterTHB } from "@/utils/date";

type ExpenseSummaryProps = {
  sum: number;
  itemCount: number;
};

export const ExpenseSummary = ({ sum, itemCount }: ExpenseSummaryProps) => {
  return (
    <Stack paddingX={2} marginTop={3} width={"100%"}>
      <Typography
        textAlign={"left"}
        fontSize={14}
        fontWeight={400}
        color="grey"
      >
        TOTAL SPENT
      </Typography>
      <Stack
        display={"flex"}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"end"}
      >
        <Typography fontSize={32} fontWeight={900}>
          {formatterTHB.format(sum ?? 0)}
        </Typography>
        <Typography fontSize={12} fontWeight={400} color="grey">
          {itemCount} items
        </Typography>
      </Stack>
      <Divider
        sx={{
          marginTop: 2,
          color: "grey",
          width: "100%",
        }}
      />
    </Stack>
  );
};

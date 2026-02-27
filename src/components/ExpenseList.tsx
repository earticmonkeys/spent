"use client";

import { Stack, Typography, Divider } from "@mui/material";
import { PiSunHorizonFill, PiSunFill, PiMoonFill } from "react-icons/pi";
import { SwipeItem, ExpenseItem } from "./SwipeItem";

export type GroupedExpenses = {
  morning: ExpenseItem[];
  afternoon: ExpenseItem[];
  night: ExpenseItem[];
};

type ExpenseListProps = {
  expenses: GroupedExpenses;
  onDelete: (id: number) => void;
};

export const ExpenseList = ({ expenses, onDelete }: ExpenseListProps) => {
  const totalItems =
    (expenses?.morning.length ?? 0) +
    (expenses?.afternoon.length ?? 0) +
    (expenses?.night.length ?? 0);

  if (totalItems === 0) {
    return (
      <Stack
        height={300}
        width={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography color="grey">No expenses yet today</Typography>
        <Typography fontSize={12} color="grey">
          Start typing above to add one
        </Typography>
      </Stack>
    );
  }

  const morningLength = expenses.morning.length ?? 0;
  const afternoonLength = expenses.afternoon.length ?? 0;

  return (
    <Stack maxHeight={300} overflow={"scroll"} marginTop={2} paddingX={2}>
      {expenses.morning.map((item, index) => (
        <SwipeItem
          key={`morning-${index}`}
          item={item}
          index={index}
          onDelete={onDelete}
        />
      ))}

      {morningLength > 0 && afternoonLength > 0 && (
        <Stack direction="row" alignItems="center" gap={1} my={1}>
          <Divider sx={{ flex: 1 }}>
            <Stack
              display={"flex"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={1}
            >
              <PiSunHorizonFill size={14} color="#DA3D20" />
              <Typography
                fontSize={12}
                fontStyle={"italic"}
                fontWeight={400}
                color="textDisabled"
              >
                ☕︎fresh start ~
              </Typography>
            </Stack>
          </Divider>
        </Stack>
      )}

      {expenses.afternoon.map((item, index) => (
        <SwipeItem
          key={`afternoon-${index}`}
          item={item}
          index={morningLength + index}
          onDelete={onDelete}
        />
      ))}

      {afternoonLength > 0 && (expenses.night.length ?? 0) > 0 && (
        <Stack direction="row" alignItems="center" gap={1} my={1}>
          <Divider sx={{ flex: 1 }}>
            <Stack
              display={"flex"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={1}
            >
              <PiSunFill size={14} color="#FFC300" />
              <Typography
                fontSize={12}
                fontStyle={"italic"}
                fontWeight={400}
                color="textDisabled"
              >
                Bon appétit 🍽️
              </Typography>
            </Stack>
          </Divider>
        </Stack>
      )}

      {(expenses.night.length ?? 0) > 0 && (
        <Stack direction="row" alignItems="center" gap={1} my={1}>
          <Divider sx={{ flex: 1 }}>
            <Stack
              display={"flex"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={1}
            >
              <PiMoonFill size={14} color="#3D45AA" />
              <Typography
                fontSize={12}
                fontStyle={"italic"}
                fontWeight={400}
                color="textDisabled"
              >
                sweet dreams ᶻ𝗓𐰁 .ᐟ
              </Typography>
            </Stack>
          </Divider>
        </Stack>
      )}

      {expenses.night.map((item, index) => (
        <SwipeItem
          key={`night-${index}`}
          item={item}
          index={morningLength + afternoonLength + index}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  );
};

"use client";

import { saveToast } from "@/component/Toaster";
import { expense } from "@/libs/expense";
import {
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import React from "react";
import { TbCirclePlusFilled, TbCurrencyBaht, TbX } from "react-icons/tb";

dayjs.extend(calendar);

function formatDate(date: string | Date) {
  return dayjs(date).calendar(null, {
    sameDay: "[Today]",
    lastDay: "[Yesterday]",
    lastWeek: "ddd, MMM D",
    sameElse: "ddd, MMM D",
  });
}
const formatterTHB = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
});

export const Expense = () => {
  const [expenseInput, setExpenseInput] = React.useState({
    title: "",
    amount: 0,
  });

  const [expenses, setExpenses] = React.useState<{
    sum: number;
    expense: { title: string; amount: number }[];
  }>();

  const handleOnGetExpense = async () => {
    const today = dayjs();

    const response = await expense.get(today.toDate());

    setExpenses(response);
  };

  React.useEffect(() => {
    handleOnGetExpense();
  }, []);

  const handleOnExpenseInput = (field: "title" | "amount", value: string) => {
    setExpenseInput((prev) => ({
      ...prev,
      [field]: field === "amount" ? Number(value) : value,
    }));
  };

  const handleOnExpenseSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (expenseInput.title.length <= 0 || expenseInput.amount <= 0) {
      return saveToast("INVALID");
    }
    const response = await expense.save(expenseInput);

    if (response.status !== 200) {
      return saveToast("FAIL");
    }

    setExpenseInput({ title: "", amount: 0 });
    await handleOnGetExpense();
    return saveToast("SUCCESS");
  };

  return (
    <Container
      maxWidth={"sm"}
      sx={{
        paddingY: 3,
        paddingX: 2,
      }}
    >
      <Stack width={"100%"} height={"100%"}>
        <Stack
          width={"100%"}
          display={"flex"}
          justifyContent={"flex-start"}
          alignItems={"start"}
        >
          <Typography fontSize={24} fontWeight={600}>
            Spent
          </Typography>
          <Stack
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {/* DATE SECTION */}
            <Stack>
              <Typography textAlign={"center"} fontSize={16} fontWeight={500}>
                {formatDate(new Date())}
              </Typography>
              <Typography fontSize={12} fontWeight={400} color="grey">
                {dayjs(new Date()).format("dddd")},{" "}
                {dayjs(new Date()).format("MMMM DD")}
              </Typography>
            </Stack>

            {/* SUMMARY SECTION */}
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
                  {formatterTHB.format(expenses?.sum ?? 0)}
                </Typography>
                <Typography fontSize={12} fontWeight={400} color="grey">
                  {expenses?.expense.length} items
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

            {/* INPUT SECTION */}
            <form style={{ width: "100%" }} onSubmit={handleOnExpenseSave}>
              <Stack
                borderRadius={"10px"}
                width={"100%"}
                display={"flex"}
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                paddingX={2}
                marginTop={3}
              >
                <Stack
                  width={"100%"}
                  direction={"row"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  paddingX={1.5}
                  paddingY={2}
                  border={"1px solid rgba(0,0,0,0.1)"}
                  borderRadius={"10px"}
                  bgcolor={"rgba(0,0,0,0.02)"}
                >
                  <Stack width={"60%"}>
                    <TextField
                      fullWidth
                      placeholder="What is it ?"
                      variant="standard"
                      value={expenseInput.title}
                      onChange={(e) =>
                        handleOnExpenseInput("title", e.target.value)
                      }
                      slotProps={{
                        input: {
                          disableUnderline: true,
                          sx: {
                            color: "black",
                          },
                        },
                      }}
                    />
                  </Stack>
                  <Stack width={"30%"}>
                    <TextField
                      placeholder="0.00"
                      variant="standard"
                      fullWidth
                      type="number"
                      value={
                        expenseInput.amount === 0 ? "" : expenseInput.amount
                      }
                      onChange={(e) =>
                        handleOnExpenseInput("amount", e.target.value)
                      }
                      slotProps={{
                        input: {
                          sx: {
                            fontWeight: 500,
                            color: "black",
                          },

                          disableUnderline: true,
                          startAdornment: (
                            <TbCurrencyBaht
                              color="grey"
                              size={30}
                              style={{ marginRight: 20 }}
                            />
                          ),
                        },
                      }}
                    />
                  </Stack>
                  <IconButton
                    type="submit"
                    sx={{
                      borderRadius: "10px",
                    }}
                    size="medium"
                  >
                    <TbCirclePlusFilled />
                  </IconButton>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Stack>
        <Stack maxHeight={500} overflow={"scroll"} marginTop={2} paddingX={3}>
          {expenses?.expense.map((item, index) => (
            <div key={index}>
              <Stack
                marginBottom={1}
                width={"100%"}
                direction={"row"}
                key={index}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Stack direction={"row"}>
                  <Typography color="grey" marginRight={2}>
                    {index >= 9 ? index + 1 : "0" + (index + 1)}
                  </Typography>
                  <Typography>{item.title}</Typography>
                </Stack>
                <Stack
                  display={"flex"}
                  gap={1}
                  direction={"row"}
                  alignItems={"center"}
                >
                  <Typography>{formatterTHB.format(item.amount)}</Typography>
                  <IconButton size="small" disableFocusRipple>
                    <TbX />
                  </IconButton>
                </Stack>
              </Stack>
              <Divider
                sx={{
                  marginBottom: 3,
                }}
              />
            </div>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
};

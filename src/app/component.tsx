"use client";

import { saveToast } from "@/component/Toaster";
import { expense } from "@/libs/expense";
import { Button, Container, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import toast from "react-hot-toast";
import { DateNavigator, TodayButton } from "@/components/DateNavigator";
import { ExpenseSummary } from "@/components/ExpenseSummary";
import { ExpenseInput } from "@/components/ExpenseInput";
import { ExpenseList, GroupedExpenses } from "@/components/ExpenseList";

export const Expense = (props: {
  expense: {
    sum: number;
    expense: GroupedExpenses;
  };
  queryDate: string;
}) => {
  const [selectedDate, setSelectedDate] = React.useState(dayjs(props.queryDate));
  const [expenseInput, setExpenseInput] = React.useState({ title: "", amount: "" });
  const [expenses, setExpenses] = React.useState(props.expense);

  const formRef = React.useRef<HTMLFormElement>(null);

  const handleOnGetExpense = async () => {
    const response = await expense.get(selectedDate.toDate());
    setExpenses(response);
  };

  React.useEffect(() => {
    handleOnGetExpense();
  }, [selectedDate]);

  const handleOnExpenseInput = (field: "title" | "amount", value: string) => {
    setExpenseInput((prev) => ({
      ...prev,
      [field]: field === "amount" ? Number(value) : value,
    }));
  };

  const evaluateAmount = (value: string): number => {
    const clean = value.replace(/,/g, "");
    if (!/^[\d+\-*/().\s]+$/.test(clean)) return NaN;
    try {
      const result = Function(`"use strict"; return (${clean})`)();
      return typeof result === "number" && isFinite(result)
        ? Number(result.toFixed(2))
        : NaN;
    } catch {
      return NaN;
    }
  };

  const handleOnExpenseSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!expenseInput.title || !expenseInput.amount) {
      return saveToast("INVALID");
    }

    const finalAmount = evaluateAmount(expenseInput.amount);
    if (isNaN(finalAmount)) {
      return toast.error("Invalid amount expression");
    }

    const response = await expense.save(
      { title: expenseInput.title, amount: finalAmount.toString() },
      selectedDate.toDate(),
    );

    if (response.status !== 200) {
      return saveToast("FAIL");
    }

    setExpenseInput({ title: "", amount: "" });
    await handleOnGetExpense();
    return saveToast("SUCCESS");
  };

  const handlePrevDay = () => setSelectedDate((prev) => prev.subtract(1, "day"));

  const handleNextDay = () => {
    const tomorrow = selectedDate.add(1, "day");
    if (tomorrow.isAfter(dayjs(), "day")) return;
    setSelectedDate(tomorrow);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleDelete = async (id: number) => {
    const response = await expense.delete(id);
    if (response.status !== 200) {
      return toast.error(response.message);
    }
    await sleep(250);
    await handleOnGetExpense();
    return toast.success(response.message);
  };

  const itemCount =
    (expenses?.expense.morning.length ?? 0) +
    (expenses?.expense.afternoon.length ?? 0) +
    (expenses?.expense.night.length ?? 0);

  return (
    <Container maxWidth={"sm"} sx={{ paddingY: 3, paddingX: 2 }}>
      <Stack width={"100%"} height={"100%"}>
        <Stack width={"100%"} display={"flex"} justifyContent={"flex-start"} alignItems={"start"}>
          <Stack width={"100%"} direction={"row"} display={"flex"} justifyContent={"space-between"}>
            <Typography fontSize={24} fontWeight={600}>Spent</Typography>
            <TodayButton />
          </Stack>
          <Stack width={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <DateNavigator
              selectedDate={selectedDate}
              onPrev={handlePrevDay}
              onNext={handleNextDay}
            />
            <ExpenseSummary sum={expenses?.sum ?? 0} itemCount={itemCount} />
            <ExpenseInput
              value={expenseInput}
              onChange={handleOnExpenseInput}
              onSubmit={handleOnExpenseSave}
              formRef={formRef}
            />
          </Stack>
        </Stack>
        <ExpenseList expenses={expenses?.expense} onDelete={handleDelete} />
      </Stack>
    </Container>
  );
};

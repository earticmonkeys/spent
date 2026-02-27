"use server";

import dayjs from "dayjs";
import { prisma } from "../prisma";
import utc from "dayjs/plugin/utc";

import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Bangkok";

interface ExpenseSave {
  title: string;
  amount: string;
}

export const saveExpense = async (
  { title, amount }: ExpenseSave,
  selectedDate: Date,
) => {
  const expense = await prisma.expense.create({
    data: {
      title,
      amount: parseFloat(amount.replace(/,/g, "")),
      createdAt: selectedDate,
    },
  });

  if (!expense) {
    return {
      status: 400,
    };
  }

  return {
    status: 200,
    expense,
  };
};

const getTimePeriod = (date: Date): "morning" | "afternoon" | "night" => {
  const hour = dayjs(date).tz(TZ).hour();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "night";
};

export const getExpense = async (date: Date) => {
  const start = dayjs(date).tz(TZ).startOf("day").toDate();
  const end = dayjs(date).tz(TZ).endOf("day").toDate();

  const expenses = await prisma.expense.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  const grouped = {
    morning: [] as typeof expenses,
    afternoon: [] as typeof expenses,
    night: [] as typeof expenses,
  };

  let sum = 0;
  for (const expense of expenses) {
    const period = getTimePeriod(expense.createdAt);
    grouped[period].push(expense);
    sum += expense.amount;
  }

  return {
    sum,
    expense: grouped,
  };
};

export const deleteExpense = async (id: number) => {
  const expense = await prisma.expense.delete({
    where: {
      id,
    },
  });

  if (!expense) {
    return {
      status: 400,
      message: "Oouch ! delete expense unsuccessful",
    };
  }

  return {
    status: 200,
    message: "Becareful Next Time !",
  };
};

export const getExpenseDateMonth = async (date: Date) => {
  const start = dayjs(date).tz(TZ).startOf("month").toDate();
  const end = dayjs(date).tz(TZ).endOf("month").toDate();

  console.log(start, end);
  const expense = await prisma.expense.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  return expense;
};

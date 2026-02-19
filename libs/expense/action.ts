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

export const getExpense = async (date: Date) => {
  const start = dayjs(date).tz(TZ).startOf("day").toDate();
  const end = dayjs(date).tz(TZ).endOf("day").toDate();

  const [expense, aggregate] = await Promise.all([
    prisma.expense.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    }),
    prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    }),
  ]);

  return {
    sum: aggregate._sum.amount ?? 0,
    expense: expense,
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

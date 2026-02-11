"use server";

import dayjs from "dayjs";
import { prisma } from "../prisma";

interface ExpenseSave {
  title: string;
  amount: number;
}

export const saveExpense = async ({ title, amount }: ExpenseSave) => {
  const expense = await prisma.expense.create({
    data: {
      title,
      amount,
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
  const start = dayjs(date).startOf("day").toDate();
  const end = dayjs(date).endOf("day").toDate();

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

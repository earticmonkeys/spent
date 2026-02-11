import { getExpense, saveExpense } from "./action";

export const expense = {
  save: saveExpense,
  get: getExpense,
};

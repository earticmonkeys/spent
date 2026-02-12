import { deleteExpense, getExpense, saveExpense } from "./action";

export const expense = {
  save: saveExpense,
  get: getExpense,
  delete: deleteExpense,
};

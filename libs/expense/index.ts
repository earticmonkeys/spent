import {
  deleteExpense,
  getExpense,
  getExpenseDateMonth,
  saveExpense,
} from "./action";

export const expense = {
  save: saveExpense,
  get: getExpense,
  delete: deleteExpense,
  month: getExpenseDateMonth,
};

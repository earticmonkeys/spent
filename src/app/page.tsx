import { expense } from "@/libs/expense";
import { Expense } from "./component";
import dayjs from "dayjs";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryDate = (await searchParams).date;

  let expenses;

  if (!queryDate) {
    expenses = await expense.get(dayjs().toDate());
  } else {
    expenses = await expense.get(dayjs(queryDate.toString()).toDate());
  }

  return (
    <>
      <Expense
        expense={expenses}
        queryDate={queryDate?.toString() ?? dayjs().toString()}
      />
    </>
  );
}

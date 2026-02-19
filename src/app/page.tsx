import { expense } from "@/libs/expense";
import { Expense } from "./component";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";

import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Bangkok";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryDate = (await searchParams).date;

  let expenses;
  console.log("Server now:", new Date());
  console.log("Bangkok now:", dayjs().tz("Asia/Bangkok").format());

  const start = dayjs().tz("Asia/Bangkok").startOf("day").utc();
  const end = dayjs().tz("Asia/Bangkok").endOf("day").utc();

  console.log("Query start (UTC):", start.format());
  console.log("Query end (UTC):", end.format());

  if (!queryDate) {
    expenses = await expense.get(dayjs().tz(TZ).toDate());
  } else {
    expenses = await expense.get(
      dayjs(
        queryDate?.toString() ??
          dayjs().tz("Asia/Bangkok").format("YYYY-MM-DD"),
      ).toDate(),
    );
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

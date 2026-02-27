"use client";

import React from "react";
import { Stack, Typography, Badge, Divider, IconButton } from "@mui/material";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { expense } from "@/libs/expense";
import { motion } from "motion/react";
import { FaGear } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import utc from "dayjs/plugin/utc";

import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Bangkok";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs());
  const [currentMonth, setCurrentMonth] = React.useState<Dayjs>(dayjs());
  const [markedDates, setMarkedDates] = React.useState<Set<string>>(new Set());

  const router = useRouter();

  const [dailyExpense, setDailyExpense] = React.useState<{
    sum: number;
    expense: {
      morning: { id: number; title: string; amount: number; createdAt: Date }[];
      afternoon: { id: number; title: string; amount: number; createdAt: Date }[];
      night: { id: number; title: string; amount: number; createdAt: Date }[];
    };
  } | null>(null);

  // ===========================
  // โหลดข้อมูลทั้งเดือน
  // ===========================
  const loadMonthExpense = async (date: Dayjs) => {
    const data = await expense.month(date.tz(TZ).toDate());

    const dateSet = new Set<string>();

    data.forEach((item: any) => {
      dateSet.add(dayjs(item.createdAt).format("YYYY-MM-DD"));
    });

    setMarkedDates(dateSet);
  };

  // ===========================
  // โหลดข้อมูลของวันเดียว
  // ===========================
  const loadDailyExpense = async (date: Dayjs) => {
    const data = await expense.get(date.tz(TZ).toDate());
    setDailyExpense(data);
  };

  // โหลดเดือนตอน mount และตอนเปลี่ยนเดือน
  React.useEffect(() => {
    loadMonthExpense(currentMonth);
  }, [currentMonth]);

  // โหลดวันแรกตอนเข้า page
  React.useEffect(() => {
    loadDailyExpense(selectedDate);
  }, []);

  return (
    <Stack
      padding={3}
      spacing={3}
      maxWidth="sm"
      margin="0 auto"
      height={"100vh"}
      overflow={"scroll"}
    >
      <Typography fontSize={22} fontWeight={700}>
        📅 Calendar
      </Typography>

      <DateCalendar
        sx={{
          width: "100%",
          background: "white",
          height: 300,
          boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
          borderRadius: 5,
        }}
        value={selectedDate}
        disableFuture
        onChange={(newValue) => {
          if (!newValue) return;
          setSelectedDate(newValue);
          loadDailyExpense(newValue);
        }}
        onMonthChange={(newMonth) => {
          setCurrentMonth(newMonth);
        }}
        slotProps={{
          day: {
            sx: {
              "&.Mui-selected": {
                backgroundColor: "#111827 !important", // สีพื้นหลังตอน active
                color: "#fff", // สีตัวอักษร
              },
            },
          },
        }}
        slots={{
          day: (props: PickersDayProps) => {
            const formatted = props.day.format("YYYY-MM-DD");
            const isMarked = markedDates.has(formatted);

            return (
              <Badge
                key={formatted}
                overlap="circular"
                variant="dot"
                color="error"
                invisible={!isMarked}
              >
                <PickersDay {...props} />
              </Badge>
            );
          },
        }}
      />

      {/* ===========================
          DAILY PREVIEW CARD
         =========================== */}
      {dailyExpense && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Stack
            p={3}
            borderRadius={3}
            bgcolor="white"
            boxShadow="0 6px 16px rgba(0,0,0,0.06)"
          >
            <Stack
              display={"flex"}
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width={"100%"}
            >
              <Typography fontWeight={600}>
                {selectedDate.format("dddd, MMM D")}
              </Typography>
              <IconButton
                onClick={() =>
                  router.push(`/?date=${selectedDate.toISOString()}`)
                }
                sx={{
                  fontSize: 14,
                  background: "white",
                  color: "#111827",
                }}
              >
                <FaGear />
              </IconButton>
            </Stack>

            <Typography fontSize={28} fontWeight={900} mt={1}>
              ฿{dailyExpense.sum.toLocaleString()}
            </Typography>

            <Typography fontSize={12} color="grey">
              {dailyExpense.expense.morning.length + dailyExpense.expense.afternoon.length + dailyExpense.expense.night.length} items
            </Typography>

            <Divider sx={{ my: 2 }} />

            {dailyExpense.expense.morning.length > 0 ||
            dailyExpense.expense.afternoon.length > 0 ||
            dailyExpense.expense.night.length > 0 ? (
              <>
                {["morning", "afternoon", "night"].map((period) => {
                  const items = dailyExpense.expense[period as keyof typeof dailyExpense.expense];
                  if (items.length === 0) return null;
                  return (
                    <Stack key={period} mb={2}>
                      <Typography fontSize={12} fontWeight={600} color="grey.600" mb={1}>
                        {period === "morning" ? "🌅 Morning" : period === "afternoon" ? "☀️ Afternoon" : "🌙 Night"}
                      </Typography>
                      {items.slice(0, 3).map((item: { id: number; title: string; amount: number }) => (
                        <Stack
                          key={item.id}
                          direction="row"
                          justifyContent="space-between"
                          mb={1}
                        >
                          <Typography fontSize={14}>{item.title}</Typography>
                          <Typography fontSize={14}>
                            ฿{item.amount.toLocaleString()}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  );
                })}
              </>
            ) : (
              <Typography fontSize={13} color="grey">
                No expenses on this day
              </Typography>
            )}
          </Stack>
        </motion.div>
      )}
    </Stack>
  );
}

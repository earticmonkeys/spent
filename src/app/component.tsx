"use client";

import { saveToast } from "@/component/Toaster";
import { expense } from "@/libs/expense";
import {
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import React from "react";
import {
  TbCirclePlusFilled,
  TbCurrencyBaht,
  TbMoon,
  TbTrash,
} from "react-icons/tb";

import { PiSunHorizonFill, PiSunFill, PiMoonFill } from "react-icons/pi";

import { FcCalendar } from "react-icons/fc";

import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { motion, useMotionValue, useTransform } from "motion/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

dayjs.extend(calendar);

function parsedDateIcon(date: string | Date) {
  const hour = dayjs(date).hour();
  const size = 18;

  if (hour >= 5 && hour < 12) {
    return <PiSunHorizonFill size={size} color="#DA3D20" />;
  } else if (hour >= 12 && hour < 18) {
    return <PiSunFill size={size} color="#FFC300" />;
  } else {
    return <PiMoonFill size={size} color="#3D45AA" />;
  }
}

function formatDate(date: string | Date) {
  return dayjs(date).calendar(null, {
    sameDay: "[Today]",
    lastDay: "[Yesterday]",
    lastWeek: "ddd, MMM D",
    sameElse: "ddd, MMM D",
  });
}
const formatterTHB = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
});

export const Expense = (props: {
  expense: {
    sum: number;
    expense: { id: number; title: string; amount: number; createdAt: Date }[];
  };
  queryDate: string;
}) => {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = React.useState(
    dayjs(props.queryDate),
  );
  const [expenseInput, setExpenseInput] = React.useState({
    title: "",
    amount: "",
  });
  const [expenses, setExpenses] = React.useState<{
    sum: number;
    expense: { id: number; title: string; amount: number; createdAt: Date }[];
  }>(props.expense);

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

  const handleAmountChange = (value: string) => {
    const input = value.replace(/,/g, "");

    // allow only numbers + math operators
    if (!/^[\d+\-*/().\s]*$/.test(input)) return;

    const hasOperator = /[+\-*/()]/.test(input);

    // ถ้ามี operator → ไม่ต้อง format comma
    if (hasOperator) {
      setExpenseInput((prev) => ({
        ...prev,
        amount: input,
      }));
      return;
    }

    // ถ้าเป็นตัวเลขล้วน ค่อย validate ทศนิยม
    if (!/^\d*\.?\d{0,2}$/.test(input)) return;

    const [integer, decimal] = input.split(".");

    const formattedInteger = integer
      ? Number(integer).toLocaleString("th-TH")
      : "";

    const formatted =
      decimal !== undefined
        ? `${formattedInteger}.${decimal}`
        : formattedInteger;

    setExpenseInput((prev) => ({
      ...prev,
      amount: formatted,
    }));
  };

  const formRef = React.useRef<HTMLFormElement>(null);

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
      {
        title: expenseInput.title,
        amount: finalAmount.toString(),
      },
      selectedDate.toDate(),
    );

    if (response.status !== 200) {
      return saveToast("FAIL");
    }

    setExpenseInput({ title: "", amount: "" });
    await handleOnGetExpense();
    return saveToast("SUCCESS");
  };
  const handlePrevDay = () => {
    setSelectedDate((prev) => prev.subtract(1, "day"));
  };

  const handleNextDay = () => {
    const tomorrow = selectedDate.add(1, "day");

    if (tomorrow.isAfter(dayjs(), "day")) return; // ❌ ห้ามเกินวันนี้

    setSelectedDate(tomorrow);
  };
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const handleDelete = async (id: number) => {
    const response = await expense.delete(id);

    if (response.status !== 200) {
      return toast.error(response.message);
    }

    await sleep(250);

    await handleOnGetExpense();
    return toast.success(response.message);
  };

  type SwipeItemProps = {
    item: { id: number; title: string; amount: number; createdAt: Date };
    index: number;
    onDelete: (id: number) => void;
  };
  const SwipeItem = ({ item, index, onDelete }: SwipeItemProps) => {
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-80, -40], [1, 0]);
    const scale = useTransform(x, [-80, -40], [1, 0.5]);

    return (
      <div style={{ position: "relative", marginBottom: 12, width: "100%" }}>
        {/* Background */}
        <motion.div style={{ opacity, scale }} dragElastic={0.08}>
          <Stack
            position="absolute"
            right={0}
            top={0}
            bottom={0}
            width={120}
            bgcolor="#F63049"
            justifyContent="center"
            alignItems="center"
            borderRadius={2}
          >
            <TbTrash size={24} color="white" />
          </Stack>
        </motion.div>

        {/* Foreground */}
        <motion.div
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -85, right: 0 }}
          dragElastic={0.5}
          onDragEnd={(e, info) => {
            if (info.offset.x < -80) {
              onDelete(item.id);
            }
          }}
        >
          <Stack
            bgcolor="white"
            padding={2.5}
            width={"100%"}
            borderRadius={2}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            boxShadow="0 2px 8px rgba(0,0,0,0.05)"
          >
            <Stack
              direction="row"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Typography color="grey" mr={2}>
                {index >= 9 ? index + 1 : "0" + (index + 1)}
              </Typography>
              <Stack
                display={"flex"}
                direction={"column"}
                justifyContent={"center"}
              >
                <Typography>{item.title}</Typography>
                <Stack
                  display={"flex"}
                  direction={"row"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={0.5}
                >
                  {parsedDateIcon(item.createdAt)}
                  <Typography fontSize={12} color="textDisabled">
                    {dayjs(item.createdAt).format("DD MMM  | HH:mm:ss")}{" "}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Typography>฿{item.amount.toLocaleString()}</Typography>
          </Stack>
        </motion.div>
      </div>
    );
  };

  return (
    <Container
      maxWidth={"sm"}
      sx={{
        paddingY: 3,
        paddingX: 2,
      }}
    >
      <Stack width={"100%"} height={"100%"}>
        <Stack
          width={"100%"}
          display={"flex"}
          justifyContent={"flex-start"}
          alignItems={"start"}
        >
          <Stack
            width={"100%"}
            direction={"row"}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={24} fontWeight={600}>
              Spent
            </Typography>
            <Button
              onClick={() => {
                setSelectedDate(dayjs());
                router.replace("/");
              }}
              variant="contained"
              sx={{
                borderRadius: 5,
                width: 30,
                paddingX: 6,
                fontWeight: 700,
                fontSize: 12,
                background: "white",
                color: "#111827",
                boxShadow: "0 0px 5px rgba(0,0,0,0.10)",
              }}
              disableElevation
              startIcon={<FcCalendar size={20} color="red" />}
            >
              Today
            </Button>
          </Stack>
          <Stack
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {/* DATE SECTION */}
            <Stack
              marginTop={3}
              width={"100%"}
              display={"flex"}
              direction={"row"}
              gap={3}
              justifyContent={"center"}
            >
              <IconButton onClick={() => handlePrevDay()} disableRipple>
                <MdChevronLeft />
              </IconButton>
              <Stack width={"100%"}>
                <Typography textAlign={"center"} fontSize={16} fontWeight={500}>
                  {formatDate(selectedDate.toDate())}
                </Typography>
                <Typography
                  textAlign={"center"}
                  fontSize={12}
                  noWrap
                  fontWeight={400}
                  color="grey"
                >
                  {dayjs(selectedDate).format("dddd")},{" "}
                  {dayjs(selectedDate).format("MMMM DD")}
                </Typography>
              </Stack>
              {!selectedDate.isSame(dayjs(), "day") ? (
                <IconButton onClick={handleNextDay} disableRipple>
                  <MdChevronRight />
                </IconButton>
              ) : (
                <IconButton
                  sx={{
                    visibility: "hidden",
                  }}
                >
                  <MdChevronRight />
                </IconButton>
              )}
            </Stack>

            {/* SUMMARY SECTION */}
            <Stack paddingX={2} marginTop={3} width={"100%"}>
              <Typography
                textAlign={"left"}
                fontSize={14}
                fontWeight={400}
                color="grey"
              >
                TOTAL SPENT
              </Typography>
              <Stack
                display={"flex"}
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"end"}
              >
                <Typography fontSize={32} fontWeight={900}>
                  {formatterTHB.format(expenses?.sum ?? 0)}
                </Typography>
                <Typography fontSize={12} fontWeight={400} color="grey">
                  {expenses?.expense.length} items
                </Typography>
              </Stack>
              <Divider
                sx={{
                  marginTop: 2,
                  color: "grey",
                  width: "100%",
                }}
              />
            </Stack>

            {/* INPUT SECTION */}
            <form
              ref={formRef}
              style={{ width: "100%" }}
              onSubmit={handleOnExpenseSave}
            >
              <Stack
                borderRadius={"10px"}
                width={"100%"}
                display={"flex"}
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                paddingX={2}
                marginTop={3}
              >
                <Stack
                  width={"100%"}
                  direction={"row"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  paddingX={1.5}
                  paddingY={2}
                  border={"1px solid rgba(0,0,0,0.1)"}
                  borderRadius={"10px"}
                  bgcolor={"rgba(0,0,0,0.02)"}
                >
                  <Stack width={"60%"}>
                    <TextField
                      fullWidth
                      placeholder="What is it ?"
                      variant="standard"
                      value={expenseInput.title}
                      onChange={(e) =>
                        handleOnExpenseInput("title", e.target.value)
                      }
                      slotProps={{
                        input: {
                          disableUnderline: true,
                          sx: {
                            color: "black",
                          },
                          onKeyDown: (e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              formRef.current?.requestSubmit();
                            }
                          },
                        },
                      }}
                    />
                  </Stack>
                  <Stack width={"30%"}>
                    <TextField
                      placeholder="0.00"
                      variant="standard"
                      fullWidth
                      type="text"
                      inputMode="decimal"
                      value={expenseInput.amount}
                      onChange={(e) =>
                        handleAmountChange(e.currentTarget.value)
                      }
                      slotProps={{
                        input: {
                          sx: {
                            fontWeight: 500,
                            color: "black",
                          },

                          disableUnderline: true,
                          onKeyDown: (e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              formRef.current?.requestSubmit();
                            }
                          },
                          startAdornment: (
                            <TbCurrencyBaht
                              color="grey"
                              size={30}
                              style={{ marginRight: 20 }}
                            />
                          ),
                        },
                      }}
                    />
                  </Stack>
                  <IconButton
                    type="submit"
                    sx={{
                      borderRadius: "10px",
                    }}
                    size="medium"
                  >
                    <TbCirclePlusFilled />
                  </IconButton>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Stack>
        {(expenses?.expense?.length ?? 0) > 0 ? (
          <Stack maxHeight={300} overflow={"scroll"} marginTop={2} paddingX={2}>
            {expenses?.expense.map((item, index) => (
              <SwipeItem
                key={index}
                item={item}
                index={index}
                onDelete={handleDelete}
              />
            ))}
          </Stack>
        ) : (
          <Stack
            height={300}
            width={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography color="grey">No expenses yet today</Typography>
            <Typography fontSize={12} color="grey">
              Start typing above to add one
            </Typography>
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

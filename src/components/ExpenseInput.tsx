"use client";

import { Stack, TextField, IconButton } from "@mui/material";
import { TbCirclePlusFilled, TbCurrencyBaht } from "react-icons/tb";

type ExpenseInputProps = {
  value: { title: string; amount: string };
  onChange: (field: "title" | "amount", value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
};

export const ExpenseInput = ({
  value,
  onChange,
  onSubmit,
  formRef,
}: ExpenseInputProps) => {
  const handleAmountChange = (inputValue: string) => {
    const input = inputValue.replace(/,/g, "");

    if (!/^[\d+\-*/().\s]*$/.test(input)) return;

    const hasOperator = /[+\-*/()]/.test(input);

    if (hasOperator) {
      onChange("amount", input);
      return;
    }

    if (!/^\d*\.?\d{0,2}$/.test(input)) return;

    const [integer, decimal] = input.split(".");
    const formattedInteger = integer
      ? Number(integer).toLocaleString("th-TH")
      : "";
    const formatted =
      decimal !== undefined
        ? `${formattedInteger}.${decimal}`
        : formattedInteger;

    onChange("amount", formatted);
  };

  return (
    <form ref={formRef} style={{ width: "100%" }} onSubmit={onSubmit}>
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
              value={value.title}
              onChange={(e) => onChange("title", e.target.value)}
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: { color: "black" },
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
              value={value.amount}
              onChange={(e) => handleAmountChange(e.currentTarget.value)}
              slotProps={{
                input: {
                  sx: { fontWeight: 500, color: "black" },
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
            sx={{ borderRadius: "10px" }}
            size="medium"
          >
            <TbCirclePlusFilled />
          </IconButton>
        </Stack>
      </Stack>
    </form>
  );
};

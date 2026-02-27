"use client";

import { Stack, Typography } from "@mui/material";
import { motion, useMotionValue, useTransform } from "motion/react";
import { TbTrash } from "react-icons/tb";
import dayjs from "dayjs";
import { parsedDateIcon } from "@/utils/date";

export type ExpenseItem = {
  id: number;
  title: string;
  amount: number;
  createdAt: Date;
};

type SwipeItemProps = {
  item: ExpenseItem;
  index: number;
  onDelete: (id: number) => void;
};

export const SwipeItem = ({ item, index, onDelete }: SwipeItemProps) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-80, -40], [1, 0]);
  const scale = useTransform(x, [-80, -40], [1, 0.5]);

  return (
    <div style={{ position: "relative", marginBottom: 12, width: "100%" }}>
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

      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -85, right: 0 }}
        dragElastic={0.5}
        onDragEnd={(_, info) => {
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
                  {dayjs(item.createdAt).format("HH:mm")}{" "}
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

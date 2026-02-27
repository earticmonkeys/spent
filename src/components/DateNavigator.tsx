"use client";

import { Stack, Typography, IconButton } from "@mui/material";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FcCalendar } from "react-icons/fc";
import { Button } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { formatDate } from "@/utils/date";
import { useRouter } from "next/navigation";

type DateNavigatorProps = {
  selectedDate: Dayjs;
  onPrev: () => void;
  onNext: () => void;
};

export const DateNavigator = ({
  selectedDate,
  onPrev,
  onNext,
}: DateNavigatorProps) => {
  const router = useRouter();
  const isToday = selectedDate.isSame(dayjs(), "day");

  return (
    <Stack
      marginTop={3}
      width={"100%"}
      display={"flex"}
      direction={"row"}
      gap={3}
      justifyContent={"center"}
    >
      <IconButton onClick={onPrev} disableRipple>
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
          {selectedDate.format("dddd")}, {selectedDate.format("MMMM DD")}
        </Typography>
      </Stack>
      {!isToday ? (
        <IconButton onClick={onNext} disableRipple>
          <MdChevronRight />
        </IconButton>
      ) : (
        <IconButton sx={{ visibility: "hidden" }}>
          <MdChevronRight />
        </IconButton>
      )}
    </Stack>
  );
};

export const TodayButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
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
  );
};

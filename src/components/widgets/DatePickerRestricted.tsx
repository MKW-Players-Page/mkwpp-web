import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { dateToSeconds } from "../../utils/DateUtils";
import { mkwReleaseDate } from "../../utils/Numbers";

interface DatePickerRestrictedProps {
  date: Date;
  setDate: (x: Date) => void;
  validDates: Date[];
}

const DatePickerRestricted = ({ date, validDates, setDate }: DatePickerRestrictedProps) => {
  return (
    <DatePicker
      sx={{ flexGrow: 1 }}
      value={dayjs(date)}
      onChange={(v) => {
        if (v === null) return;
        setDate(v.toDate());
      }}
      slotProps={{
        actionBar: {
          actions: ["today"],
        },
      }}
      views={["year", "month", "day"]}
      minDate={dayjs(mkwReleaseDate)}
      maxDate={dayjs(validDates[0])}
      timezone="UTC"
      shouldDisableDate={(date) => {
        for (const validDate of validDates ?? [new Date()])
          if (date.unix() === dateToSeconds(validDate)) return false;
        return true;
      }}
    />
  );
};

export default DatePickerRestricted;

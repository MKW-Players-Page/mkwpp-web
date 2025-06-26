import { LapModeEnum } from "../api";

/** Given a time in milliseconds, format it to a string in the form of
 *
 * `m'ss"000`
 *
 * where `m` stands for minutes, `s` stands for seconds, and `0` stands for milliseconds.
 *
 * @param time The time in milliseconds
 * @returns A human readable score time string
 */
export const formatTime = (time: number) => {
  const minutes = Math.trunc(time / 60000);
  const seconds = Math.trunc((time % 60000) / 1000);
  const milliseconds = time % 1000;
  return `${minutes}'${String(seconds).padStart(2, "0")}"${String(milliseconds).padStart(3, "0")}`;
};

/** Given a time difference in milliseconds, format it to a string in the form of
 *
 * `-m'ss"000` or `-s"000`
 *
 * where `-` is present if diff is negative, `m` stands for minutes and only when greater than 0,
 * `s` stands for seconds, and `0` stands for milliseconds.
 *
 * @param time The time difference in milliseconds
 * @returns A human readable time difference string
 */
export const formatTimeDiff = (diff: number) => {
  const minutes = Math.trunc(Math.abs(diff) / 60000);
  const seconds = Math.trunc((Math.abs(diff) % 60000) / 1000);
  const milliseconds = Math.abs(diff) % 1000;
  if (minutes > 0) {
    return `${diff < 0 ? "-" : diff > 0 ? "+" : ""}${minutes}'${String(seconds).padStart(2, "0")}"${String(milliseconds).padStart(3, "0")}`;
  } else {
    return `${diff < 0 ? "-" : diff > 0 ? "+" : ""}${seconds}"${String(milliseconds).padStart(3, "0")}`;
  }
};

/** Parses a time string which follows either of these formats:
 *
 * `m'ss"000`, `ss"000`, `s"000`, `m:ss.000`, `ss.000`, `s.000`
 *
 * where `m` stands for minutes, `s` stands for seconds, and `0` stands for milliseconds.
 *
 * @param time The formatted time string
 * @returns The parsed time in milliseconds
 */
export const parseTime = (time: string) => {
  const pattern = /^(?:(?:([0-9])[':]([0-9]{2}))|([0-9]{1,2}))[".]([0-9]{3})$/;
  const groups = time.match(pattern);
  if (!groups) {
    return null;
  }

  const minutes = groups[1] ? +groups[1] : 0;
  const seconds = groups[2] ? +groups[2] : +groups[3];
  const milliseconds = +groups[4];
  return (minutes * 60 + seconds) * 1000 + milliseconds;
};

/** Format a date in the form of
 *
 * `YYYY-MM-DD`
 *
 * where `Y` stands for year, `M` stands for month, and `D` stands for day.
 *
 * @param date The date to format
 * @returns A human readable date string
 */
export const formatDate = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

/** Format LapMode into a readable string
 *
 * @param lap mode
 * @returns A human readable lap mode string
 */
export const formatLapMode = (lapMode: LapModeEnum): "Overall" | "Lap" | "Course" => {
  switch (lapMode) {
    case LapModeEnum.Overall:
      return "Overall";
    case LapModeEnum.Lap:
      return "Lap";
    case LapModeEnum.Course:
      return "Course";
  }
};

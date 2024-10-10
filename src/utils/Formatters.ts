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

export interface FormatDateDependableProps {
  date: Date;
  smallClass: string;
  bigClass: string;
}

/** Format a date in the form of
 *
 * `<><span className={bigClass}>YY</span><span className={smallClass}>'</span>YY-MM-DD</>`
 *
 * where `Y` stands for year, `M` stands for month, and `D` stands for day.
 *
 * @param date The date to format
 * @returns A human readable date element
 */
const FormatDateDependable = ({ date, smallClass, bigClass }: FormatDateDependableProps) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return (
    <>
      <span>{dateStr.substring(0, 2)}</span>
      <span>'</span>
      {dateStr.substring(2)}
    </>
  );
};

export default FormatDateDependable;

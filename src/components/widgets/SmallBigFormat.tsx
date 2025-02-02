export interface SmallBigFormatProps {
  smallText: React.ReactNode;
  bigText: React.ReactNode;
  smallClass: string;
  bigClass: string;
}

const SmallBigFormat = ({ smallText, bigText, smallClass, bigClass }: SmallBigFormatProps) => {
  return (
    <span>
      <span className={bigClass}>{bigText}</span>
      <span className={smallClass}>{smallText}</span>
    </span>
  );
};

export interface SmallBigFormatDateProps {
  date: Date | null | undefined;
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
export const SmallBigFormatDate = ({ date, smallClass, bigClass }: SmallBigFormatDateProps) => {
  let dateStr = "????-??-??";
  if (date !== undefined && date !== null) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  return (
    <span>
      {
        <SmallBigFormat
          bigClass={bigClass}
          smallClass={smallClass}
          bigText={dateStr.substring(0, 2)}
          smallText="'"
        />
      }
      {dateStr.substring(2)}
    </span>
  );
};

export default SmallBigFormat;

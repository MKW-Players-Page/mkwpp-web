import { useContext } from "react";
import { Track } from "../../rust_api";
import { I18nContext, translateTrack } from "../../utils/i18n/i18n";

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

export interface SmallBigTrackFormatProps {
  track: Track | undefined;
  smallClass: string;
  bigClass: string;
}

export const SmallBigTrackFormat = ({ track, smallClass, bigClass }: SmallBigTrackFormatProps) => {
  const { lang } = useContext(I18nContext);

  return (
    <SmallBigFormat
      bigClass={bigClass}
      smallClass={smallClass}
      bigText={translateTrack(track, lang)}
      smallText={track?.abbr}
    />
  );
};

export interface SmallBigDateFormatProps {
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
export const SmallBigDateFormat = ({ date, smallClass, bigClass }: SmallBigDateFormatProps) => {
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

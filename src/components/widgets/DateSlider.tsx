import { formatDate } from "../../utils/Formatters";
import "./DateSlider.css";

export interface DateSliderProps {
  validDates: Date[];
  currentDateIndex: number;
  setCurrentDateIndex: (dateIndex: number) => void;
}

const DateSlider = ({ validDates, currentDateIndex, setCurrentDateIndex }: DateSliderProps) => {
  return (
    <div className="module date-slider">
      <span
        className="date-slider-button"
        onClick={() => {
          if (currentDateIndex < validDates.length - 1) setCurrentDateIndex(currentDateIndex + 1);
        }}
      >
        «
      </span>
      <span>{formatDate(validDates[currentDateIndex])}</span>
      <span
        className="date-slider-button"
        onClick={() => {
          if (currentDateIndex > 0) setCurrentDateIndex(currentDateIndex - 1);
        }}
      >
        »
      </span>
    </div>
  );
};

export default DateSlider;

import "./PaginationButtons.css";

interface ButtonNumberProps extends MoveByOneButtons {
  selected: boolean;
}

const ButtonNumber = ({ pageNumber, selected, setSelectedPage }: ButtonNumberProps) => {
  return (
    <span
      onClick={
        selected
          ? undefined
          : () => {
              setSelectedPage(pageNumber);
            }
      }
      className={`page-number-button${selected ? " active" : ""}`}
    >
      {pageNumber}
    </span>
  );
};

interface ButtonNumberTypeableProps {
  maxPageNumber: number;
  setSelectedPage: (page: number) => void;
}
const ButtonNumberTypeable = ({ maxPageNumber, setSelectedPage }: ButtonNumberTypeableProps) => {
  return (
    <input
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setSelectedPage(Math.min(maxPageNumber, parseInt(e.currentTarget.value)));
          e.currentTarget.value = "";
          e.currentTarget.blur();
        }
        if (
          e.key !== "Backspace" &&
          e.key !== "ArrowDown" &&
          e.key !== "ArrowLeft" &&
          e.key !== "ArrowRight" &&
          e.key !== "ArrowUp" &&
          !"012345689".includes(e.key)
        )
          e.preventDefault();
      }}
      className="page-number-button"
      inputMode="numeric"
      min={1}
      max={maxPageNumber}
      placeholder="..."
    />
  );
};
interface MoveByOneButtons {
  pageNumber: number;
  setSelectedPage: (page: number) => void;
}

const NextButton = ({ pageNumber, setSelectedPage }: MoveByOneButtons) => {
  return (
    <span
      onClick={() => {
        setSelectedPage(pageNumber);
      }}
      className={`page-number-button`}
    >
      »
    </span>
  );
};

const PreviousButton = ({ pageNumber, setSelectedPage }: MoveByOneButtons) => {
  return (
    <span
      onClick={() => {
        setSelectedPage(pageNumber);
      }}
      className={`page-number-button`}
    >
      «
    </span>
  );
};

export interface PaginationProps {
  selectedPage: number;
  setSelectedPage: (page: number) => void;
  numberOfPages: number;
}

export const PaginationButtonRow = ({
  selectedPage,
  setSelectedPage,
  numberOfPages,
}: PaginationProps) => {
  return (
    <div style={{ justifyContent: "center" }} className="module-row wrap">
      <div className="module pagination-button-row">
        {selectedPage !== 1 && (
          <PreviousButton
            pageNumber={Math.max(1, selectedPage - 1)}
            setSelectedPage={setSelectedPage}
          />
        )}
        <ButtonNumber
          pageNumber={1}
          selected={selectedPage === 1}
          setSelectedPage={setSelectedPage}
        />
        <ButtonNumber
          pageNumber={
            selectedPage === 1
              ? 2
              : selectedPage === numberOfPages
                ? numberOfPages - 1
                : selectedPage
          }
          selected={!(selectedPage === 1 || selectedPage === numberOfPages)}
          setSelectedPage={setSelectedPage}
        />
        <ButtonNumber
          pageNumber={numberOfPages}
          selected={selectedPage === numberOfPages}
          setSelectedPage={setSelectedPage}
        />
        {selectedPage !== numberOfPages && (
          <NextButton
            pageNumber={Math.min(numberOfPages, selectedPage + 1)}
            setSelectedPage={setSelectedPage}
          />
        )}
        <ButtonNumberTypeable maxPageNumber={numberOfPages} setSelectedPage={setSelectedPage} />
      </div>
    </div>
  );
};

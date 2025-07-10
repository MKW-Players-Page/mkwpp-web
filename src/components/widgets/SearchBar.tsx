import { useContext } from "react";
import { I18nContext, translate } from "../../utils/i18n/i18n";

export interface SearchBarProps {
  setFilterString: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({ setFilterString }: SearchBarProps) => {
  const { lang } = useContext(I18nContext);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "4fr 1fr",
        gridGap: "5px",
      }}
    >
      <input
        id="filterText"
        type="search"
        className="module"
        onKeyDown={(e) => {
          if (e.key === "Enter") document.getElementById("searchBtn")?.click();
        }}
      />
      <button
        style={{
          borderRadius: 0,
        }}
        id="searchBtn"
        className="module"
        onClick={(e) => {
          setFilterString(
            (document.getElementById("filterText") as HTMLInputElement).value
              .toLowerCase()
              .normalize("NFKD"),
          );
        }}
      >
        {translate("playerListPageSearchBtn", lang)}
      </button>
    </div>
  );
};

export default SearchBar;

import { useContext, useRef } from "react";
import { I18nContext, translate } from "../../utils/i18n/i18n";

export interface SearchBarProps {
  setFilterString: React.Dispatch<React.SetStateAction<string>>;
  onChange?: boolean;
}

const SearchBar = ({ setFilterString, onChange = false }: SearchBarProps) => {
  const { lang } = useContext(I18nContext);

  let searchBar = useRef<HTMLInputElement>(null);

  let setText = () =>
    setFilterString((searchBar.current?.value ?? "").toLowerCase().normalize("NFKD"));

  return (
    <div
      style={
        onChange
          ? undefined
          : {
              display: "grid",
              gridTemplateColumns: "4fr 1fr",
              gridGap: "5px",
            }
      }
    >
      <input
        ref={searchBar}
        type="search"
        className="module"
        onChange={onChange ? setText : undefined}
        placeholder={onChange ? translate("playerListPageSearchBtn", lang) : undefined}
        onKeyDown={
          onChange
            ? undefined
            : (e) => {
                if (e.key === "Enter") setText();
              }
        }
      />
      {onChange ? (
        <></>
      ) : (
        <button
          style={{
            borderRadius: 0,
          }}
          id="searchBtn"
          className="module"
          onClick={setText}
        >
          {translate("playerListPageSearchBtn", lang)}
        </button>
      )}
    </div>
  );
};

export default SearchBar;

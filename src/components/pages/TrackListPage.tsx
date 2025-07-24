import { useContext, useState } from "react";

import { I18nContext, translate } from "../../utils/i18n/i18n";
import CupsList from "../widgets/CupsList";
import RecentTimes from "../widgets/RecentTimes";

const TrackListPage = () => {
  const { lang } = useContext(I18nContext);

  const [limit, setLimit] = useState(30);

  return (
    <>
      <h1>{translate("trackListPageHeading", lang)}</h1>
      <CupsList />
      <p>{translate("trackListPageMoreTimes", lang)}</p>
      <input
        style={{ marginBottom: "16px" }}
        type="number"
        defaultValue={30}
        onChange={(e) => {
          let value = parseInt(e.target.value);
          if (isNaN(value)) {
            e.target.value = String((value = 30));
          } else if (value < 1) {
            e.target.value = String((value = 1));
          }
          setLimit(value);
        }}
        step="30"
        min="1"
        pattern="[0-9]*"
      />
      <RecentTimes limit={limit} />
    </>
  );
};

export default TrackListPage;

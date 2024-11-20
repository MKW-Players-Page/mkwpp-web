import { useContext } from "react";

import { I18nContext } from "../../utils/i18n/i18n";
import CupsList from "../widgets/CupsList";
import RecentTimes from "../widgets/RecentTimes";

const TrackListPage = () => {
  const { translations, lang } = useContext(I18nContext);

  return (
    <>
      <h1>{translations.trackListPageHeading[lang]}</h1>
      <CupsList />
      <RecentTimes records={true} limit={30} />
      <RecentTimes records={false} limit={30} />
    </>
  );
};

export default TrackListPage;

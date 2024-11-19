import { useContext } from "react";

import { I18nContext } from "../../utils/i18n/i18n";
import CupsList from "../widgets/CupsList";

const TrackListPage = () => {
  const { translations, lang } = useContext(I18nContext);
  return (
    <>
      <h1>{translations.trackListPageHeading[lang]}</h1>
      <CupsList />
    </>
  );
};

export default TrackListPage;

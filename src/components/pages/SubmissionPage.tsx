import { useContext } from "react";

import Deferred from "../widgets/Deferred";
import { Tab, TabbedModule } from "../widgets";
import api from "../../api";
import { MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";
import { Navigate } from "react-router-dom";
import { Pages, resolvePage } from "./Pages";
import { useApi } from "../../hooks";
import { I18nContext, translate } from "../../utils/i18n/i18n";
import SubmitForm from "../widgets/SubmitForm";
import SubmissionCard from "../widgets/SubmissionCard";

const SubmitTab = () => {
  return <SubmitForm />;
};

const BulkSubmitTab = () => {
  const { lang } = useContext(I18nContext);
  return (
    <div className="module-content">
      {translate("submissionPageBulkSubmitTabUnderConstruction", lang)}
    </div>
  );
};

const SubmissionsTab = () => {
  const metadata = useContext(MetadataContext);

  const { isLoading, data: submissions } = useApi(
    () => api.timetrialsSubmissionsList(),
    [],
    "trackSubmissions",
  );

  return (
    <div className="module-content">
      <Deferred isWaiting={isLoading || metadata.isLoading}>
        <div className="card-container">
          {submissions?.map((submission) => <SubmissionCard submission={submission} />)}
        </div>
      </Deferred>
    </div>
  );
};

const SubmissionPage = () => {
  const { isLoading, user } = useContext(UserContext);
  const { lang } = useContext(I18nContext);

  return (
    <>
      <Deferred isWaiting={isLoading}>
        {!user && <Navigate to={resolvePage(Pages.UserLogin)} />}
        <h1>{translate("submissionPageTabbedModuleHeading", lang)}</h1>
        <TabbedModule>
          <Tab title={translate("submissionPageSubmitTabTitle", lang)} element={<SubmitTab />} />
          <Tab
            title={translate("submissionPageBulkSubmitTabTitle", lang)}
            element={<BulkSubmitTab />}
          />
          <Tab
            title={translate("submissionPageSubmissionsTabTitle", lang)}
            element={<SubmissionsTab />}
          />
          <Tab
            title={translate("submissionPageTimesheetTabTitle", lang)}
            element={<SubmissionsTab />}
          />
        </TabbedModule>
      </Deferred>
    </>
  );
};

export default SubmissionPage;

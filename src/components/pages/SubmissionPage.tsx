import { useContext, useState } from "react";

import Deferred from "../widgets/Deferred";
import { Tab, TabbedModule } from "../widgets";
import api from "../../api";
import { MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";
import { Navigate } from "react-router-dom";
import { Pages, resolvePage } from "./Pages";
import { useApi } from "../../hooks";
import { I18nContext, translate } from "../../utils/i18n/i18n";
import SubmissionForm from "../widgets/SubmissionForm";
import SubmissionCard from "../widgets/SubmissionCard";
import RadioButtons from "../widgets/RadioButtons";

const SubmitTab = () => {
  return <SubmissionForm />;
};

enum SubmissionFilter {
  All = 1,
  ByYou = 2,
  ForYou = 3,
}

const SubmissionsTab = () => {
  const metadata = useContext(MetadataContext);
  const { user } = useContext(UserContext);
  const [reload, setReload] = useState(Math.random());
  const [filter, setFilter] = useState<SubmissionFilter>(SubmissionFilter.All);

  const { isLoading, data: submissions } = useApi(
    () => api.timetrialsSubmissionsList(),
    [reload],
    "trackSubmissions",
  );

  return (
    <div className="module-content">
      <RadioButtons
        state={filter}
        setState={setFilter}
        data={[
          { text: "Submitted By You", value: SubmissionFilter.ByYou },
          { text: "Submitted For You", value: SubmissionFilter.ForYou },
          { text: "All your Submissions", value: SubmissionFilter.All },
        ]}
      />
      <Deferred isWaiting={isLoading || metadata.isLoading}>
        <div key={reload} className="card-container">
          {submissions
            ?.filter((submission) =>
              SubmissionFilter.All
                ? true
                : SubmissionFilter.ByYou
                  ? submission.submittedBy.player.id === user?.player
                  : submission.player.id === user?.player,
            )
            .map((submission) => <SubmissionCard setReload={setReload} submission={submission} />)}
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

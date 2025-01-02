import { useContext } from "react";

import "./SubmissionPage.css";

import Deferred from "../../widgets/Deferred";
import { Icon, Tab, TabbedModule, Tooltip } from "../../widgets";
import api from "../../../api";
import { getTrackById, MetadataContext } from "../../../utils/Metadata";
import { formatTime } from "../../../utils/Formatters";
import { UserContext } from "../../../utils/User";
import { Navigate } from "react-router-dom";
import { Pages, resolvePage } from "../Pages";
import { useApi } from "../../../hooks";
import {
  I18nContext,
  translate,
  translateCategoryName,
  translateTrack,
} from "../../../utils/i18n/i18n";
import OverwriteColor from "../../widgets/OverwriteColor";
import SubmitForm from "../../widgets/SubmitForm";

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
  const { lang } = useContext(I18nContext);

  const { isLoading, data: submissions } = useApi(
    () => api.timetrialsSubmissionsList(),
    [],
    "trackSubmissions",
  );

  return (
    <div className="module-content">
      <Deferred isWaiting={isLoading || metadata.isLoading}>
        <div className="card-container">
          {submissions?.map((submission) => (
            <div key={submission.id} className="card">
              <p className="nobr">
                {translateTrack(getTrackById(metadata.tracks, submission.track), lang)}
                ,&nbsp;
                {translateCategoryName(submission.category, lang)},&nbsp;
                {submission.isLap
                  ? translate("constantLapModeLap", lang)
                  : translate("constantLapModeCourse", lang)}
              </p>
              <p>{formatTime(submission.value)}</p>
              <p>
                <div className="submission-card-flex-div">
                  <div>
                    {submission.videoLink && (
                      <a href={submission.videoLink} target="_blank" rel="noopener noreferrer">
                        <Icon icon="Video" />
                      </a>
                    )}
                    {submission.ghostLink && (
                      <a href={submission.ghostLink} target="_blank" rel="noopener noreferrer">
                        <Icon icon="Ghost" />
                      </a>
                    )}
                    {submission.comment && (
                      <Tooltip left={true} text={submission.comment}>
                        <Icon icon="Comment" />
                      </Tooltip>
                    )}
                  </div>
                  <div>
                    {submission.status === "accepted" ? (
                      <Icon icon="SubmissionAccepted" />
                    ) : submission.status === "rejected" ? (
                      <Tooltip text="">
                        <Icon icon="SubmissionRejected" />
                      </Tooltip>
                    ) : submission.status === "pending" ? (
                      <OverwriteColor hue={20} saturationShift={1000}>
                        <Icon icon="SubmissionPending" />
                      </OverwriteColor>
                    ) : submission.status === "on_hold" ? (
                      <Tooltip text="">
                        <Icon icon="SubmissionPending" />
                      </Tooltip>
                    ) : (
                      <></>
                    )}
                    <Icon icon="Edit" />
                  </div>
                </div>
              </p>
            </div>
          ))}
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
        </TabbedModule>
      </Deferred>
    </>
  );
};

export default SubmissionPage;

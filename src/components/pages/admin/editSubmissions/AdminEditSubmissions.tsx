import { useContext, useState } from "react";
import { useSearchParams, Navigate, Link, useNavigate } from "react-router-dom";
import {
  AdminEditSubmission,
  AdminScore,
  LapModeEnum,
  Player,
  Score,
  SubmissionStatus,
  User,
} from "../../../../api";
import { useApi } from "../../../../hooks";
import { usePageNumber } from "../../../../utils/SearchParams";
import Deferred from "../../../widgets/Deferred";
import { PaginationButtonRow } from "../../../widgets/PaginationButtons";
import ArrayTable, { ArrayTableCellData, ArrayTableData } from "../../../widgets/Table";
import { Pages, resolvePage } from "../../Pages";
import {
  Language,
  translateCategoryName,
  translateLapModeName,
  translateSubmissionStatus,
  translateTrack,
} from "../../../../utils/i18n/i18n";
import { MetadataContext } from "../../../../utils/Metadata";
import ObscuredModule from "../../../widgets/ObscuredModule";
import SearchBar from "../../../widgets/SearchBar";
import { formatTime } from "../../../../utils/Formatters";
import PlayerMention from "../../../widgets/PlayerMention";
import SubmissionForm from "../../../widgets/SubmissionForm";
import { secondsToDate } from "../../../../utils/DateUtils";

export interface AdminEditSubmissionUpdateButtonProps {
  submission: AdminEditSubmission;
  score: AdminScore;
}

const AdminEditSubmissionUpdateButton = ({
  submission,
  score,
}: AdminEditSubmissionUpdateButtonProps) => {
  const [visibleObscured, setVisibleObscured] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <span
        style={{ cursor: "pointer" }}
        onClick={() => {
          setVisibleObscured(true);
        }}
      >
        {submission.id}
      </span>
      <ObscuredModule stateVisible={visibleObscured} setStateVisible={setVisibleObscured}>
        <SubmissionForm
          editModeScore={score as unknown as Score}
          submissionId={submission.id}
          starterPlayer={score.playerId}
          starterTrack={score.trackId}
          starterCategory={score.category}
          starterLapMode={score.isLap ? LapModeEnum.Lap : LapModeEnum.Course}
          starterValue={score.value}
          starterDate={secondsToDate(submission.date)}
          starterGhostLink={submission.ghostLink}
          starterVideoLink={submission.videoLink}
          starterComment={submission.comment}
          starterSubmitterNote={submission.submitterNote}
          starterAdminNote={submission.adminNote ?? ""}
          starterReviewerNote={submission.reviewerNote ?? ""}
          starterStatus={submission.status}
          isAdmin
          onSuccess={() => {
            navigate(0);
          }}
        />
      </ObscuredModule>
    </>
  );
};

const AdminEditSubmissionsListPage = () => {
  const { isLoading: adminIsLoading, data: isAdmin } = useApi(() => User.isAdmin(), [], "isAdmin");
  const searchParams = useSearchParams();
  const { pageNumber, setPageNumber } = usePageNumber(searchParams);
  const metadata = useContext(MetadataContext);

  const [textFilter, setTextFilter] = useState("");

  const { isLoading, data } = useApi(
    () =>
      AdminEditSubmission.getList().then(async (submissions) => {
        if (submissions === null) return undefined;
        const scores = submissions.map((submission) => AdminScore.getById(submission.scoreId));
        await Player.getPlayersBasic(
          submissions.flatMap((submission) => [submission.submitterId]),
          metadata,
        );
        return submissions
          .sort((a, b) => a.id - b.id)
          .reduce(
            async (accumulatorPromise, submission, index) => {
              const score = await scores[index];
              if (score === null) return accumulatorPromise;
              const player = await Player.getPlayerBasic(score.playerId, metadata);
              const submitter = await Player.getPlayerBasic(submission.submitterId, metadata);
              if (submitter === undefined || player === undefined) return accumulatorPromise;
              const accumulator = await accumulatorPromise;
              const timeFormatted = formatTime(score.value);
              const trackName = translateTrack(
                metadata.getTrackById(score.trackId),
                Language.English,
              );
              const categoryName = translateCategoryName(score.category, Language.English);
              const lapModeName = translateLapModeName(
                score.isLap ? LapModeEnum.Lap : LapModeEnum.Course,
                Language.English,
              );
              const submissionStatus = translateSubmissionStatus(
                submission.status,
                Language.English,
              );
              accumulator.tableArray.push([
                {
                  content:
                    submission.status === SubmissionStatus.Accepted ? (
                      submission.id
                    ) : (
                      <AdminEditSubmissionUpdateButton submission={submission} score={score} />
                    ),
                },
                { content: trackName },
                { content: categoryName },
                { content: lapModeName },
                { content: timeFormatted },
                { content: <PlayerMention playerOrId={player} showRegFlagRegardless xxFlag /> },
                { content: <PlayerMention playerOrId={submitter} showRegFlagRegardless xxFlag /> },
                { content: secondsToDate(submission.submittedAt).toLocaleString(Language.English) },
                {
                  content: submissionStatus,
                },
              ]);
              accumulator.keys.push(submission.id.toString());
              accumulator.filterStrings.push(
                (
                  submission.id.toString() +
                  categoryName +
                  score.value +
                  lapModeName +
                  trackName +
                  timeFormatted +
                  player.name +
                  (player.alias ?? "") +
                  submitter.name +
                  (submitter.alias ?? "") +
                  submissionStatus
                )
                  .toLowerCase()
                  .normalize("NFKD"),
              );
              return accumulator;
            },
            Promise.resolve({
              tableArray: [] as ArrayTableCellData[][],
              keys: [] as string[],
              filterStrings: [] as string[],
            }),
          );
      }),
    [metadata],
    "editSubmissionsList",
  );

  const rowsPerPage = 100;
  const [maxPageNumber, setMaxPageNumber] = useState(
    Math.ceil((data?.tableArray ?? []).length / rowsPerPage),
  );

  const tableData: ArrayTableData = {
    classNames: [],
    rowKeys: data?.keys ?? [],
    filterData: {
      currentString: textFilter,
      rowStrings: data?.filterStrings ?? [],
    },
    paginationData: {
      rowsPerPage,
      page: pageNumber,
      setMaxPageNumber,
    },
  };

  return (
    <>
      <Link to={resolvePage(Pages.AdminUi)}>« Back</Link>
      <h1>Submissions List</h1>
      <SearchBar setFilterString={setTextFilter} />

      <Link to={resolvePage(Pages.Submission)}>
        <button className="module">New Submission</button>
      </Link>

      <PaginationButtonRow
        selectedPage={pageNumber}
        setSelectedPage={setPageNumber}
        numberOfPages={maxPageNumber}
      />
      <div className="module table-hover-rows">
        <Deferred isWaiting={isLoading || adminIsLoading}>
          {!isAdmin && <Navigate to={resolvePage(Pages.Home)} />}
          <ArrayTable
            headerRows={[
              [
                { content: "ID" },
                { content: "Track" },
                { content: "Category" },
                { content: "Laps" },
                { content: "Time" },
                { content: "Player" },
                { content: "Submitter" },
                { content: "Submitted At" },
                { content: "Status" },
              ],
            ]}
            rows={data?.tableArray ?? []}
            tableData={tableData}
          />
        </Deferred>
      </div>

      <PaginationButtonRow
        selectedPage={pageNumber}
        setSelectedPage={setPageNumber}
        numberOfPages={maxPageNumber}
      />
    </>
  );
};

export default AdminEditSubmissionsListPage;

import { apiFetch, CategoryEnum } from "..";
import { getToken } from "../../utils/Auth";

export enum SubmissionStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  OnHold = 3,
}

export const SubmissionStatusValues: SubmissionStatus[] = [
  SubmissionStatus.Pending,
  SubmissionStatus.Accepted,
  SubmissionStatus.Rejected,
  SubmissionStatus.OnHold,
];

export const stringToSubmissionStatusEnum = (x: string): SubmissionStatus => {
  switch (x) {
    case "1":
      return SubmissionStatus.Accepted;
    case "2":
      return SubmissionStatus.Rejected;
    case "3":
      return SubmissionStatus.OnHold;
    default:
      return SubmissionStatus.Pending;
  }
};

export class Submission {
  readonly id: number;
  readonly value: number;
  readonly category: CategoryEnum;
  readonly isLap: boolean;
  readonly playerId: number;
  readonly trackId: number;
  readonly date: number;
  readonly status: SubmissionStatus;
  readonly submitterId: number;
  readonly submittedAt: number;
  readonly reviewerId?: number;
  readonly reviewedAt?: number;
  readonly scoreId?: number;
  readonly videoLink?: string;
  readonly ghostLink?: string;
  readonly comment?: string;
  readonly reviewerNote?: string;
  readonly submitterNote?: string;

  constructor(
    id: number,
    value: number,
    category: CategoryEnum,
    isLap: boolean,
    playerId: number,
    trackId: number,
    date: number,
    status: SubmissionStatus,
    submitterId: number,
    submittedAt: number,
    reviewerId?: number,
    reviewedAt?: number,
    scoreId?: number,
    videoLink?: string,
    ghostLink?: string,
    comment?: string,
    reviewerNote?: string,
    submitterNote?: string,
  ) {
    this.id = id;
    this.value = value;
    this.category = category;
    this.isLap = isLap;
    this.playerId = playerId;
    this.trackId = trackId;
    this.date = date;
    this.status = status;
    this.submitterId = submitterId; // This is actually a Player Id, because the Backend converts it
    this.submittedAt = submittedAt;
    this.reviewerId = reviewerId; // This is actually a Player Id, because the Backend converts it
    this.reviewedAt = reviewedAt;
    this.scoreId = scoreId;
    this.videoLink = videoLink;
    this.ghostLink = ghostLink;
    this.comment = comment;
    this.reviewerNote = reviewerNote;
    this.submitterNote = submitterNote;
  }
}

export class EditSubmission {
  readonly id: number;
  readonly status: SubmissionStatus;
  readonly submitterId: number; // This is actually a Player Id, the Backend converts it
  readonly submittedAt: number;
  readonly date: number;
  readonly video_link_edited: boolean;
  readonly ghost_link_edited: boolean;
  readonly comment_edited: boolean;
  readonly date_edited: boolean;
  readonly reviewerId?: number; // This is actually a Player Id, the Backend converts it
  readonly reviewedAt?: number;
  readonly scoreId?: number;
  readonly videoLink?: string;
  readonly ghostLink?: string;
  readonly comment?: string;
  readonly reviewerNote?: string;
  readonly submitterNote?: string;

  constructor(
    id: number,
    status: SubmissionStatus,
    submitterId: number,
    submittedAt: number,
    video_link_edited: boolean,
    ghost_link_edited: boolean,
    comment_edited: boolean,
    date: number,
    date_edited: boolean,
    reviewerId?: number,
    reviewedAt?: number,
    scoreId?: number,
    videoLink?: string,
    ghostLink?: string,
    comment?: string,
    reviewerNote?: string,
    submitterNote?: string,
  ) {
    this.id = id;
    this.status = status;
    this.submitterId = submitterId;
    this.submittedAt = submittedAt;
    this.reviewerId = reviewerId;
    this.reviewedAt = reviewedAt;
    this.date = date;
    this.date_edited = date_edited;
    this.video_link_edited = video_link_edited;
    this.ghost_link_edited = ghost_link_edited;
    this.comment_edited = comment_edited;
    this.scoreId = scoreId;
    this.videoLink = videoLink;
    this.ghostLink = ghostLink;
    this.comment = comment;
    this.reviewerNote = reviewerNote;
    this.submitterNote = submitterNote;
  }
}

export class AdminSubmission extends Submission {
  readonly adminNote?: string;
  constructor(
    id: number,
    value: number,
    category: CategoryEnum,
    isLap: boolean,
    playerId: number,
    trackId: number,
    date: number,
    status: SubmissionStatus,
    submitterId: number,
    submittedAt: number,
    reviewerId?: number,
    reviewedAt?: number,
    scoreId?: number,
    videoLink?: string,
    ghostLink?: string,
    comment?: string,
    reviewerNote?: string,
    submitterNote?: string,
    adminNote?: string,
  ) {
    super(
      id,
      value,
      category,
      isLap,
      playerId,
      trackId,
      date,
      status,
      submitterId,
      submittedAt,
      reviewerId,
      reviewedAt,
      scoreId,
      videoLink,
      ghostLink,
      comment,
      reviewerNote,
      submitterNote,
    );
    this.adminNote = adminNote;
  }

  public static async getList(): Promise<Array<AdminSubmission> | null> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch(
      "/admin/submissions/list_submissions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken },
    );
  }
}

export class AdminEditSubmission extends EditSubmission {
  readonly adminNote?: string;
  constructor(
    id: number,
    status: SubmissionStatus,
    submitterId: number,
    submittedAt: number,
    video_link_edited: boolean,
    ghost_link_edited: boolean,
    comment_edited: boolean,
    date: number,
    date_edited: boolean,
    reviewerId?: number,
    reviewedAt?: number,
    scoreId?: number,
    videoLink?: string,
    ghostLink?: string,
    comment?: string,
    reviewerNote?: string,
    submitterNote?: string,
    adminNote?: string,
  ) {
    super(
      id,
      status,
      submitterId,
      submittedAt,
      video_link_edited,
      ghost_link_edited,
      comment_edited,
      date,
      date_edited,
      reviewerId,
      reviewedAt,
      scoreId,
      videoLink,
      ghostLink,
      comment,
      reviewerNote,
      submitterNote,
    );
    this.adminNote = adminNote;
  }
  public static async getList(): Promise<Array<AdminSubmission> | null> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch(
      "/admin/submissions/list_edit_submissions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken },
    );
  }
}

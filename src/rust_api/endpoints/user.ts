import { apiFetch, EditSubmission, PlayerBasic, Submission, CategoryEnum } from "..";
import { getToken } from "../../utils/Auth";
import { formatDate } from "../../utils/Formatters";
import { Metadata } from "../../utils/Metadata";

export class AuthData {
  sessionToken: string;
  expiry: string;

  constructor(sessionToken: string, expiry: string) {
    this.sessionToken = sessionToken;
    this.expiry = expiry;
  }
}

export class User {
  readonly playerId: number = 0;
  readonly userId: number = 0;
  readonly username: string = "";

  constructor(playerId: number, userId: number, username: string) {
    this.playerId = playerId;
    this.userId = userId;
    this.username = username;
  }

  public static async register(username: string, password: string, email: string) {
    return apiFetch(
      "/auth/register",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { password, username, email },
    );
  }

  public static async login(username: string, password: string) {
    return apiFetch<AuthData>(
      "/auth/login",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { password, username },
    );
  }

  public static async logout(): Promise<null | User> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<User>(
      "/auth/logout",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken },
    );
  }

  public static async activate(token: string): Promise<{}> {
    return apiFetch<{}>(
      "/auth/activate",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { token },
    );
  }

  public static async password_change(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<null> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<null>(
      "/auth/update_password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId, oldPassword, newPassword },
    );
  }

  public static async fetch_data(): Promise<null | User> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<User>(
      "/auth/user_data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken },
    );
  }

  public static async update_bio(userId: number, bio: string): Promise<null | string> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<string>(
      "/auth/player/updbio",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId, data: bio },
    );
  }

  public static async update_alias(userId: number, alias: string): Promise<null | string> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<string>(
      "/auth/player/updalias",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId, data: alias },
    );
  }

  public static async add_to_submitter_list(
    userId: number,
    playerId: number,
  ): Promise<null | number> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<number>(
      "/auth/player/addsubmitter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId, playerId },
    );
  }

  public static async remove_from_submitter_list(
    userId: number,
    playerId: number,
  ): Promise<null | number> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<number>(
      "/auth/player/remsubmitter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId, playerId },
    );
  }

  public static async get_submitter_list(
    userId: number,
    metadata?: Metadata,
  ): Promise<null | Array<PlayerBasic>> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<Array<number>>(
      "/auth/player/submitters",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId },
    ).then((r) => PlayerBasic.getPlayersBasic(r, metadata));
  }

  public static async get_submittee_list(
    userId: number,
    metadata?: Metadata,
  ): Promise<null | Array<PlayerBasic>> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<Array<number>>(
      "/auth/player/submittees",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId },
    ).then((r) => PlayerBasic.getPlayersBasic(r, metadata));
  }

  public static async get_user_submissions_list(userId: number): Promise<null | Array<Submission>> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<Array<Submission>>(
      "/auth/submissions/get_submissions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId },
    );
  }

  public static async create_submission(
    userId: number,
    value: number,
    category: CategoryEnum,
    isLap: boolean,
    playerId: number,
    trackId: number,
    date: Date,
    videoLink?: string,
    ghostLink?: string,
    comment?: string,
    submitterNote?: string,
  ): Promise<null | {}> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<{}>(
      "/auth/submissions/create_submission",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        sessionToken,
        userId,
        submitterId: userId,
        videoLink: videoLink === "" ? undefined : videoLink,
        ghostLink: ghostLink === "" ? undefined : ghostLink,
        comment: comment === "" ? undefined : comment,
        submitterNote: submitterNote === "" ? undefined : submitterNote,
        value,
        category,
        isLap,
        playerId,
        trackId,
        date: formatDate(date),
      },
    );
  }

  public static async edit_submission(
    submissionId: number,
    userId: number,
    value: number,
    category: CategoryEnum,
    isLap: boolean,
    playerId: number,
    trackId: number,
    date: Date,
    videoLink?: string,
    ghostLink?: string,
    comment?: string,
    submitterNote?: string,
  ): Promise<null | {}> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<{}>(
      "/auth/submissions/create_submission",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        submissionId,
        sessionToken,
        userId,
        submitterId: userId,
        videoLink: videoLink === "" ? undefined : videoLink,
        ghostLink: ghostLink === "" ? undefined : ghostLink,
        comment: comment === "" ? undefined : comment,
        submitterNote: submitterNote === "" ? undefined : submitterNote,
        value,
        category,
        isLap,
        playerId,
        trackId,
        date: formatDate(date),
      },
    );
  }

  public static async delete_submission(userId: number, submissionId: number): Promise<null | {}> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<{}>(
      "/auth/submissions/delete_submission",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId, data: submissionId },
    );
  }

  public static async get_user_edit_submissions_list(
    userId: number,
  ): Promise<null | Array<EditSubmission>> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<Array<EditSubmission>>(
      "/auth/submissions/get_edit_submissions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId },
    );
  }

  public static async create_edit_submission(
    userId: number,
    scoreId: number,
    date: Date,
    submitterNote?: string,
    videoLink?: string,
    ghostLink?: string,
    comment?: string,
  ): Promise<null | {}> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<{}>(
      "/auth/submissions/create_edit_submission",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        sessionToken,
        userId,
        submitterId: userId,
        scoreId,
        date: formatDate(date),
        videoLink: videoLink === "" ? undefined : videoLink,
        ghostLink: ghostLink === "" ? undefined : ghostLink,
        comment: comment === "" ? undefined : comment,
        submitterNote: submitterNote === "" ? undefined : submitterNote,
        dateEdited: false,
        videoLinkEdited: false,
        ghostLinkEdited: false,
        commentEdited: false,
      },
    );
  }

  public static async edit_edit_submission(
    editSubmissionId: number,
    userId: number,
    scoreId: number,
    date: Date,
    submitterNote?: string,
    videoLink?: string,
    ghostLink?: string,
    comment?: string,
  ): Promise<null | {}> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<{}>(
      "/auth/submissions/create_edit_submission",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        editSubmissionId,
        sessionToken,
        userId,
        submitterId: userId,
        scoreId,
        date: formatDate(date),
        videoLink: videoLink === "" ? undefined : videoLink,
        ghostLink: ghostLink === "" ? undefined : ghostLink,
        comment: comment === "" ? undefined : comment,
        submitterNote: submitterNote === "" ? undefined : submitterNote,
        dateEdited: false,
        videoLinkEdited: false,
        ghostLinkEdited: false,
        commentEdited: false,
      },
    );
  }

  public static async delete_edit_submission(
    userId: number,
    submissionId: number,
  ): Promise<null | {}> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<{}>(
      "/auth/submissions/delete_edit_submission",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId, data: submissionId },
    );
  }
}

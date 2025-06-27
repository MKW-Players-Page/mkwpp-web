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

  public static async passwordChange(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<null> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<null>(
      "/auth/update_password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId, oldPassword, newPassword },
    );
  }

  public static async forgotPassword(email: string): Promise<null> {
    return apiFetch<null>(
      "/auth/password_forgot",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { email },
    );
  }

  public static async resetPassword(token: string, password: string): Promise<null> {
    return apiFetch<null>(
      "/auth/password_reset",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { token, password },
    );
  }

  public static async resetPasswordCheckToken(token: string): Promise<boolean> {
    return apiFetch<{ is_valid: boolean }>(
      "/auth/password_reset_check_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { token },
    ).then((r) => r.is_valid);
  }

  public static async fetchData(): Promise<null | User> {
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

  public static async updateBio(userId: number, bio: string): Promise<null | string> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<string>(
      "/auth/player/updbio",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId, data: bio },
    );
  }

  public static async updatePronouns(userId: number, pronouns: string): Promise<null | string> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<string>(
      "/auth/player/updpronouns",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId, data: pronouns },
    );
  }

  public static async updateAlias(userId: number, alias: string): Promise<null | string> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<string>(
      "/auth/player/updalias",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId, data: alias },
    );
  }

  public static async addToSubmitterList(userId: number, playerId: number): Promise<null | number> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<number>(
      "/auth/player/addsubmitter",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId, playerId },
    );
  }

  public static async removeFromSubmitterList(
    userId: number,
    playerId: number,
  ): Promise<null | number> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<number>(
      "/auth/player/remsubmitter",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, userId, playerId },
    );
  }

  public static async getSubmitterList(
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

  public static async getSubmitteeList(
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

  public static async getUserSubmissionsList(userId: number): Promise<null | Array<Submission>> {
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

  public static async createSubmission(
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

  public static async editSubmission(
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

  public static async deleteSubmission(userId: number, submissionId: number): Promise<null | {}> {
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

  public static async getUserEditSubmissionsList(
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

  public static async createEditSubmission(
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

  public static async editEditSubmission(
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

  public static async deleteEditSubmission(
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

  public static async isAdmin(): Promise<boolean> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(false));
    return apiFetch<{ isAdmin: boolean }>(
      "/auth/is_admin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken },
    ).then((r) => r.isAdmin);
  }
}

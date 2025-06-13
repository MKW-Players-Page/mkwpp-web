import { apiFetch, PlayerBasic } from "..";
import { getToken } from "../../utils/Auth";
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
    return apiFetch("/auth/register", {
      body: JSON.stringify({ password, username, email }),
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async login(username: string, password: string) {
    return apiFetch<AuthData>("/auth/login", {
      body: JSON.stringify({ password, username }),
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async logout(): Promise<null | User> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<User>("/auth/logout", {
      body: JSON.stringify({ sessionToken }),
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async fetch_data(): Promise<null | User> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<User>("/auth/user_data", {
      body: JSON.stringify({ sessionToken }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async update_bio(userId: number, bio: string): Promise<null | string> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<string>("/auth/player/updbio", {
      body: JSON.stringify({ sessionToken, userId, data: bio }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async update_alias(userId: number, alias: string): Promise<null | string> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<string>("/auth/player/updalias", {
      body: JSON.stringify({ sessionToken, userId, data: alias }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async add_to_submitter_list(
    userId: number,
    playerId: number,
  ): Promise<null | number> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<number>("/auth/player/updalias", {
      body: JSON.stringify({ sessionToken, userId, playerId }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async remove_from_submitter_list(
    userId: number,
    playerId: number,
  ): Promise<null | number> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<number>("/auth/player/updalias", {
      body: JSON.stringify({ sessionToken, userId, playerId }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async get_submitter_list(
    userId: number,
    metadata?: Metadata,
  ): Promise<null | Array<PlayerBasic>> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch<Array<number>>("/auth/player/submitters", {
      body: JSON.stringify({ sessionToken, userId }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => PlayerBasic.getPlayersBasic(r, metadata));
  }
}

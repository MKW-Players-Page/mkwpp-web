import { apiFetch } from "..";
import { getToken } from "../../utils/Auth";

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
}

import { apiFetch } from "..";
import { getToken } from "../../utils/Auth";
import { Metadata } from "../../utils/Metadata";
import { dateToSeconds } from "../../utils/DateUtils";

export const typeguardPlayer = (x: Object): x is Player => {
  return x.hasOwnProperty("joinedDate") && x.hasOwnProperty("lastActivity");
};

export class PlayerBasic {
  readonly id: number;
  readonly name: string;
  readonly alias?: string;
  readonly regionId: number;

  constructor(id: number, name: string, regionId: number, alias?: string) {
    this.id = id;
    this.name = name;
    this.regionId = regionId;
    this.alias = alias;
  }

  public static async getPlayerList(metadata?: Metadata): Promise<Array<PlayerBasic>> {
    return apiFetch<Array<PlayerBasic>>("/custom/players/list").then((players) => {
      if (metadata !== undefined)
        metadata.cachePlayers(
          ...players.filter((player) => metadata.getCachedPlayer(player.id) === undefined),
        );
      return players;
    });
  }

  public static async getPlayersBasic(
    ids: number[],
    metadata?: Metadata,
  ): Promise<Array<PlayerBasic>> {
    let actuallyFetchSet: Set<number> = new Set(ids);
    const alreadyGrabbedSet: Set<PlayerBasic> = new Set();
    if (metadata !== undefined)
      for (const id of ids) {
        const player = metadata.getCachedPlayer(id);
        if (player !== undefined) {
          alreadyGrabbedSet.add(player);
          actuallyFetchSet.delete(id);
        }
      }

    const actuallyFetch = Array.from(actuallyFetchSet);
    const alreadyGrabbed = Array.from(alreadyGrabbedSet);
    if (actuallyFetch.length === 0) return new Promise((res) => res(alreadyGrabbed));

    return apiFetch<Array<PlayerBasic>>(
      "/custom/players/select_basic",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      ids,
    ).then((r) => {
      if (metadata !== undefined) metadata.cachePlayers(...r);
      r.push(...alreadyGrabbed);
      return r;
    });
  }

  public static async getPlayerBasic(
    id: number,
    metadata?: Metadata,
  ): Promise<PlayerBasic | undefined> {
    return this.getPlayersBasic([id], metadata).then((r) => r[0]);
  }
}

export class Player extends PlayerBasic {
  readonly pronouns?: string;
  readonly bio?: string;
  readonly joinedDate: number;
  readonly lastActivity: number;

  constructor(
    id: number,
    name: string,
    regionId: number,
    joinedDate: number,
    lastActivity: number,
    bio?: string,
    alias?: string,
    pronouns?: string,
  ) {
    super(id, name, regionId, alias);
    this.bio = bio;
    this.pronouns = pronouns;
    this.joinedDate = joinedDate;
    this.lastActivity = lastActivity;
  }

  public static async getPlayers(ids: number[], metadata?: Metadata): Promise<Array<Player>> {
    let actuallyFetchSet: Set<number> = new Set(ids);
    const alreadyGrabbedSet: Set<Player> = new Set();
    if (metadata !== undefined)
      for (const id of ids) {
        const player = metadata.getCachedPlayer(id);
        if (player !== undefined && typeguardPlayer(player)) {
          alreadyGrabbedSet.add(player);
          actuallyFetchSet.delete(id);
        }
      }

    const actuallyFetch = Array.from(actuallyFetchSet);
    const alreadyGrabbed = Array.from(alreadyGrabbedSet);
    if (actuallyFetch.length === 0) return new Promise(() => alreadyGrabbed);

    return apiFetch<Array<Player>>(
      "/custom/players/select",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      ids,
    ).then((r) => {
      if (metadata !== undefined) metadata.cachePlayers(...r);
      r.push(...alreadyGrabbed);
      return r;
    });
  }

  public static async getPlayer(id: number, metadata?: Metadata): Promise<Player | undefined> {
    return this.getPlayers([id], metadata).then((r) => r[0]);
  }
}

export class AdminPlayer extends Player {
  readonly submitters: number[];

  constructor(
    id: number,
    name: string,
    regionId: number,
    joinedDate: number,
    lastActivity: number,
    bio?: string,
    alias?: string,
    pronouns?: string,
    submitters: number[] = [],
  ) {
    super(id, name, regionId, joinedDate, lastActivity, bio, alias, pronouns);
    this.submitters = submitters;
  }

  public static async getAdminPlayerList(): Promise<Array<AdminPlayer> | null> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch(
      "/admin/players/list",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken },
    );
  }

  public static async insertPlayer(
    name: string,
    regionId: number,
    joinedDate: Date,
    lastActivity: Date,
    submitters: Array<number>,
    alias?: string,
    bio?: string,
    pronouns?: string,
  ): Promise<boolean> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(false));
    return apiFetch<{ success: boolean }>(
      "/admin/players/insert",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        sessionToken,
        name,
        regionId,
        joinedDate: dateToSeconds(joinedDate),
        lastActivity: dateToSeconds(lastActivity),
        submitters,
        alias,
        bio,
        pronouns,
      },
    ).then((r) => r.success);
  }

  public static async editPlayer(
    id: number,
    name: string,
    regionId: number,
    joinedDate: Date,
    lastActivity: Date,
    submitters: Array<number>,
    alias?: string,
    bio?: string,
    pronouns?: string,
  ): Promise<boolean> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(false));
    return apiFetch<{ success: boolean }>(
      "/admin/players/edit",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        sessionToken,
        id,
        name,
        regionId,
        joinedDate: dateToSeconds(joinedDate),
        lastActivity: dateToSeconds(lastActivity),
        submitters,
        alias,
        bio,
        pronouns,
      },
    ).then((r) => r.success);
  }

  public static async deletePlayer(id: number): Promise<boolean> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(false));
    return apiFetch<{ success: boolean }>(
      "/admin/players/delete",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, id },
    ).then((r) => r.success);
  }
}

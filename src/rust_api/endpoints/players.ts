import { apiFetch } from "..";
import { Metadata } from "../../utils/Metadata";

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

  public static async getPlayerList(): Promise<Array<PlayerBasic>> {
    return apiFetch("/custom/players/list");
  }

  public static async getPlayersBasic(
    ids: number[],
    metadata?: Metadata,
  ): Promise<Array<PlayerBasic>> {
    let actuallyFetch: Array<number> = ids;
    const alreadyGrabbed: Array<PlayerBasic> = [];
    if (metadata !== undefined)
      for (const id of ids) {
        const player = metadata.getCachedPlayer(id);
        if (player !== undefined) {
          alreadyGrabbed.push(player);
          actuallyFetch = actuallyFetch.filter((r) => r !== id);
        }
      }

    if (actuallyFetch.length === 0) return new Promise((res) => res(alreadyGrabbed));

    return apiFetch<Array<PlayerBasic>>("/custom/players/select_basic", {
      body: JSON.stringify(ids),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => {
      if (metadata !== undefined) metadata.cachePlayers = r;
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
  readonly bio?: string;
  readonly joinedDate: Date;
  readonly lastActivity: Date;

  constructor(
    id: number,
    name: string,
    regionId: number,
    joinedDate: Date,
    lastActivity: Date,
    bio?: string,
    alias?: string,
  ) {
    super(id, name, regionId, alias);
    this.bio = bio;
    this.joinedDate = joinedDate;
    this.lastActivity = lastActivity;
  }

  public static async getPlayers(ids: number[], metadata?: Metadata): Promise<Array<Player>> {
    let actuallyFetch: Array<number> = ids;
    const alreadyGrabbed: Array<Player> = [];
    if (metadata !== undefined)
      for (const id of ids) {
        const player = metadata.getCachedPlayer(id);
        if (player !== undefined && typeguardPlayer(player)) {
          alreadyGrabbed.push(player);
          actuallyFetch = actuallyFetch.filter((r) => r === id);
        }
      }

    if (actuallyFetch.length === 0) return new Promise(() => alreadyGrabbed);

    return apiFetch<Array<Player>>("/custom/players/select_basic", {
      body: JSON.stringify(ids),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => {
      if (metadata !== undefined) metadata.cachePlayers = r;
      r.push(...alreadyGrabbed);
      return r;
    });
  }

  public static async getPlayer(id: number, metadata?: Metadata): Promise<Player | undefined> {
    return this.getPlayers([id], metadata).then((r) => r[0]);
  }
}

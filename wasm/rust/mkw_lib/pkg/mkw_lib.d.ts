/* tslint:disable */
/* eslint-disable */
export function read_rkg(rkg_bytes: Uint8Array): RKG;
export enum Character {
  Mario = 0,
  BabyPeach = 1,
  Waluigi = 2,
  Bowser = 3,
  BabyDaisy = 4,
  DryBones = 5,
  BabyMario = 6,
  Luigi = 7,
  Toad = 8,
  DonkeyKong = 9,
  Yoshi = 10,
  Wario = 11,
  BabyLuigi = 12,
  Toadette = 13,
  Koopa = 14,
  Daisy = 15,
  Peach = 16,
  Birdo = 17,
  DiddyKong = 18,
  KingBoo = 19,
  BowserJr = 20,
  DryBowser = 21,
  FunkyKong = 22,
  Rosalina = 23,
  MiiAMaleSmall = 24,
  MiiAFemaleSmall = 25,
  MiiBMaleSmall = 26,
  MiiBFemaleSmall = 27,
  MiiCMaleSmall = 28,
  MiiCFemaleSmall = 29,
  MiiAMaleMedium = 30,
  MiiAFemaleMedium = 31,
  MiiBMaleMedium = 32,
  MiiBFemaleMedium = 33,
  MiiCMaleMedium = 34,
  MiiCFemaleMedium = 35,
  MiiAMaleHeavy = 36,
  MiiAFemaleHeavy = 37,
  MiiBMaleHeavy = 38,
  MiiBFemaleHeavy = 39,
  MiiCMaleHeavy = 40,
  MiiCFemaleHeavy = 41,
  MediumMii = 42,
  SmallMii = 43,
  LargeMii = 44,
  BikerPeach = 45,
  BikerDaisy = 46,
  BikerRosalina = 47,
  Unknown = 48,
}
export enum Controller {
  WiiWheel = 0,
  Nunchuck = 1,
  ClassicController = 2,
  GameCube = 3,
  Unknown = 4,
}
export enum Miniturbo {
  Automatic = 0,
  Manual = 1,
  Unknown = 2,
}
export enum RegularTrack {
  LC = 0,
  MMM = 1,
  MG = 2,
  TF = 3,
  MC = 4,
  CM = 5,
  DKSC = 6,
  WGM = 7,
  DC = 8,
  KC = 9,
  MT = 10,
  GV = 11,
  DDR = 12,
  MH = 13,
  BC = 14,
  RR = 15,
  RPB = 16,
  RYF = 17,
  RGV2 = 18,
  RMR = 19,
  RSL = 20,
  RSGB = 21,
  RDS = 22,
  RWS = 23,
  RDH = 24,
  RBC3 = 25,
  RDKJP = 26,
  RMC = 27,
  RMC3 = 28,
  RPG = 29,
  RDKM = 30,
  RBC = 31,
}
export enum Vehicle {
  StandardKartS = 0,
  StandardKartM = 1,
  StandardKartL = 2,
  BoosterSeat = 3,
  ClassicDragster = 4,
  Offroader = 5,
  MiniBeast = 6,
  WildWing = 7,
  FlameFlyer = 8,
  CheepCharger = 9,
  SuperBlooper = 10,
  PiranhaProwler = 11,
  TinyTitan = 12,
  Daytripper = 13,
  Jetsetter = 14,
  BlueFalcon = 15,
  Sprinter = 16,
  Honeycoupe = 17,
  StandardBikeS = 18,
  StandardBikeM = 19,
  StandardBikeL = 20,
  BulletBike = 21,
  MachBike = 22,
  FlameRunner = 23,
  BitBike = 24,
  Sugarscoot = 25,
  WarioBike = 26,
  Quacker = 27,
  ZipZip = 28,
  ShootingStar = 29,
  Magikruiser = 30,
  Sneakster = 31,
  Spear = 32,
  JetBubble = 33,
  DolphinDasher = 34,
  Phantom = 35,
  Unknown = 36,
}
export class Combo {
  private constructor();
  free(): void;
  vehicle: Vehicle;
  character: Character;
}
export class RKG {
  private constructor();
  free(): void;
  track: RegularTrack;
  time: number;
  combo: Combo;
  controller: Controller;
  date: number;
  miniturbo: Miniturbo;
  lap1: number;
  lap2: number;
  lap3: number;
  shrooms: Shroomstrat;
}
export class Shroomstrat {
  private constructor();
  free(): void;
  get shroomstrat(): number | undefined;
  set shroomstrat(value: number | null | undefined);
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly read_rkg: (a: any) => [number, number, number];
  readonly __wbg_rkg_free: (a: number, b: number) => void;
  readonly __wbg_get_rkg_track: (a: number) => number;
  readonly __wbg_set_rkg_track: (a: number, b: number) => void;
  readonly __wbg_get_rkg_time: (a: number) => number;
  readonly __wbg_set_rkg_time: (a: number, b: number) => void;
  readonly __wbg_get_rkg_combo: (a: number) => number;
  readonly __wbg_set_rkg_combo: (a: number, b: number) => void;
  readonly __wbg_get_rkg_controller: (a: number) => number;
  readonly __wbg_set_rkg_controller: (a: number, b: number) => void;
  readonly __wbg_get_rkg_date: (a: number) => number;
  readonly __wbg_set_rkg_date: (a: number, b: number) => void;
  readonly __wbg_get_rkg_miniturbo: (a: number) => number;
  readonly __wbg_set_rkg_miniturbo: (a: number, b: number) => void;
  readonly __wbg_get_rkg_lap1: (a: number) => number;
  readonly __wbg_set_rkg_lap1: (a: number, b: number) => void;
  readonly __wbg_get_rkg_lap2: (a: number) => number;
  readonly __wbg_set_rkg_lap2: (a: number, b: number) => void;
  readonly __wbg_get_rkg_lap3: (a: number) => number;
  readonly __wbg_set_rkg_lap3: (a: number, b: number) => void;
  readonly __wbg_get_rkg_shrooms: (a: number) => number;
  readonly __wbg_set_rkg_shrooms: (a: number, b: number) => void;
  readonly __wbg_shroomstrat_free: (a: number, b: number) => void;
  readonly __wbg_get_shroomstrat_shroomstrat: (a: number) => number;
  readonly __wbg_set_shroomstrat_shroomstrat: (a: number, b: number) => void;
  readonly __wbg_combo_free: (a: number, b: number) => void;
  readonly __wbg_get_combo_vehicle: (a: number) => number;
  readonly __wbg_set_combo_vehicle: (a: number, b: number) => void;
  readonly __wbg_get_combo_character: (a: number) => number;
  readonly __wbg_set_combo_character: (a: number, b: number) => void;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>,
): Promise<InitOutput>;

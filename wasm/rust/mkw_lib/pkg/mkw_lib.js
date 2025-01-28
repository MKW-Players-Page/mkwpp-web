/* tslint:disable */
/* eslint-disable */
let wasm;

const cachedTextDecoder =
  typeof TextDecoder !== "undefined"
    ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true })
    : {
        decode: () => {
          throw Error("TextDecoder not available");
        },
      };

if (typeof TextDecoder !== "undefined") {
  cachedTextDecoder.decode();
}

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
/**
 * @returns {RKG}
 */
export function read_rkg() {
  const ret = wasm.read_rkg();
  return RKG.__wrap(ret);
}

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
}

function isLikeNone(x) {
  return x === undefined || x === null;
}
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48}
 */
export const Character = Object.freeze({
  Mario: 0,
  0: "Mario",
  BabyPeach: 1,
  1: "BabyPeach",
  Waluigi: 2,
  2: "Waluigi",
  Bowser: 3,
  3: "Bowser",
  BabyDaisy: 4,
  4: "BabyDaisy",
  DryBones: 5,
  5: "DryBones",
  BabyMario: 6,
  6: "BabyMario",
  Luigi: 7,
  7: "Luigi",
  Toad: 8,
  8: "Toad",
  DonkeyKong: 9,
  9: "DonkeyKong",
  Yoshi: 10,
  10: "Yoshi",
  Wario: 11,
  11: "Wario",
  BabyLuigi: 12,
  12: "BabyLuigi",
  Toadette: 13,
  13: "Toadette",
  Koopa: 14,
  14: "Koopa",
  Daisy: 15,
  15: "Daisy",
  Peach: 16,
  16: "Peach",
  Birdo: 17,
  17: "Birdo",
  DiddyKong: 18,
  18: "DiddyKong",
  KingBoo: 19,
  19: "KingBoo",
  BowserJr: 20,
  20: "BowserJr",
  DryBowser: 21,
  21: "DryBowser",
  FunkyKong: 22,
  22: "FunkyKong",
  Rosalina: 23,
  23: "Rosalina",
  MiiAMaleSmall: 24,
  24: "MiiAMaleSmall",
  MiiAFemaleSmall: 25,
  25: "MiiAFemaleSmall",
  MiiBMaleSmall: 26,
  26: "MiiBMaleSmall",
  MiiBFemaleSmall: 27,
  27: "MiiBFemaleSmall",
  MiiCMaleSmall: 28,
  28: "MiiCMaleSmall",
  MiiCFemaleSmall: 29,
  29: "MiiCFemaleSmall",
  MiiAMaleMedium: 30,
  30: "MiiAMaleMedium",
  MiiAFemaleMedium: 31,
  31: "MiiAFemaleMedium",
  MiiBMaleMedium: 32,
  32: "MiiBMaleMedium",
  MiiBFemaleMedium: 33,
  33: "MiiBFemaleMedium",
  MiiCMaleMedium: 34,
  34: "MiiCMaleMedium",
  MiiCFemaleMedium: 35,
  35: "MiiCFemaleMedium",
  MiiAMaleHeavy: 36,
  36: "MiiAMaleHeavy",
  MiiAFemaleHeavy: 37,
  37: "MiiAFemaleHeavy",
  MiiBMaleHeavy: 38,
  38: "MiiBMaleHeavy",
  MiiBFemaleHeavy: 39,
  39: "MiiBFemaleHeavy",
  MiiCMaleHeavy: 40,
  40: "MiiCMaleHeavy",
  MiiCFemaleHeavy: 41,
  41: "MiiCFemaleHeavy",
  MediumMii: 42,
  42: "MediumMii",
  SmallMii: 43,
  43: "SmallMii",
  LargeMii: 44,
  44: "LargeMii",
  BikerPeach: 45,
  45: "BikerPeach",
  BikerDaisy: 46,
  46: "BikerDaisy",
  BikerRosalina: 47,
  47: "BikerRosalina",
  Unknown: 48,
  48: "Unknown",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4}
 */
export const Controller = Object.freeze({
  WiiWheel: 0,
  0: "WiiWheel",
  Nunchuck: 1,
  1: "Nunchuck",
  ClassicController: 2,
  2: "ClassicController",
  GameCube: 3,
  3: "GameCube",
  Unknown: 4,
  4: "Unknown",
});
/**
 * @enum {0 | 1 | 2}
 */
export const Miniturbo = Object.freeze({
  Automatic: 0,
  0: "Automatic",
  Manual: 1,
  1: "Manual",
  Unknown: 2,
  2: "Unknown",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31}
 */
export const RegularTrack = Object.freeze({
  LC: 0,
  0: "LC",
  MMM: 1,
  1: "MMM",
  MG: 2,
  2: "MG",
  TF: 3,
  3: "TF",
  MC: 4,
  4: "MC",
  CM: 5,
  5: "CM",
  DKSC: 6,
  6: "DKSC",
  WGM: 7,
  7: "WGM",
  DC: 8,
  8: "DC",
  KC: 9,
  9: "KC",
  MT: 10,
  10: "MT",
  GV: 11,
  11: "GV",
  DDR: 12,
  12: "DDR",
  MH: 13,
  13: "MH",
  BC: 14,
  14: "BC",
  RR: 15,
  15: "RR",
  RPB: 16,
  16: "RPB",
  RYF: 17,
  17: "RYF",
  RGV2: 18,
  18: "RGV2",
  RMR: 19,
  19: "RMR",
  RSL: 20,
  20: "RSL",
  RSGB: 21,
  21: "RSGB",
  RDS: 22,
  22: "RDS",
  RWS: 23,
  23: "RWS",
  RDH: 24,
  24: "RDH",
  RBC3: 25,
  25: "RBC3",
  RDKJP: 26,
  26: "RDKJP",
  RMC: 27,
  27: "RMC",
  RMC3: 28,
  28: "RMC3",
  RPG: 29,
  29: "RPG",
  RDKM: 30,
  30: "RDKM",
  RBC: 31,
  31: "RBC",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36}
 */
export const Vehicle = Object.freeze({
  StandardKartS: 0,
  0: "StandardKartS",
  StandardKartM: 1,
  1: "StandardKartM",
  StandardKartL: 2,
  2: "StandardKartL",
  BoosterSeat: 3,
  3: "BoosterSeat",
  ClassicDragster: 4,
  4: "ClassicDragster",
  Offroader: 5,
  5: "Offroader",
  MiniBeast: 6,
  6: "MiniBeast",
  WildWing: 7,
  7: "WildWing",
  FlameFlyer: 8,
  8: "FlameFlyer",
  CheepCharger: 9,
  9: "CheepCharger",
  SuperBlooper: 10,
  10: "SuperBlooper",
  PiranhaProwler: 11,
  11: "PiranhaProwler",
  TinyTitan: 12,
  12: "TinyTitan",
  Daytripper: 13,
  13: "Daytripper",
  Jetsetter: 14,
  14: "Jetsetter",
  BlueFalcon: 15,
  15: "BlueFalcon",
  Sprinter: 16,
  16: "Sprinter",
  Honeycoupe: 17,
  17: "Honeycoupe",
  StandardBikeS: 18,
  18: "StandardBikeS",
  StandardBikeM: 19,
  19: "StandardBikeM",
  StandardBikeL: 20,
  20: "StandardBikeL",
  BulletBike: 21,
  21: "BulletBike",
  MachBike: 22,
  22: "MachBike",
  FlameRunner: 23,
  23: "FlameRunner",
  BitBike: 24,
  24: "BitBike",
  Sugarscoot: 25,
  25: "Sugarscoot",
  WarioBike: 26,
  26: "WarioBike",
  Quacker: 27,
  27: "Quacker",
  ZipZip: 28,
  28: "ZipZip",
  ShootingStar: 29,
  29: "ShootingStar",
  Magikruiser: 30,
  30: "Magikruiser",
  Sneakster: 31,
  31: "Sneakster",
  Spear: 32,
  32: "Spear",
  JetBubble: 33,
  33: "JetBubble",
  DolphinDasher: 34,
  34: "DolphinDasher",
  Phantom: 35,
  35: "Phantom",
  Unknown: 36,
  36: "Unknown",
});

const ComboFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_combo_free(ptr >>> 0, 1));

export class Combo {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Combo.prototype);
    obj.__wbg_ptr = ptr;
    ComboFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    ComboFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_combo_free(ptr, 0);
  }
  /**
   * @returns {Vehicle}
   */
  get vehicle() {
    const ret = wasm.__wbg_get_combo_vehicle(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {Vehicle} arg0
   */
  set vehicle(arg0) {
    wasm.__wbg_set_combo_vehicle(this.__wbg_ptr, arg0);
  }
  /**
   * @returns {Character}
   */
  get character() {
    const ret = wasm.__wbg_get_combo_character(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {Character} arg0
   */
  set character(arg0) {
    wasm.__wbg_set_combo_character(this.__wbg_ptr, arg0);
  }
}

const RKGFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_rkg_free(ptr >>> 0, 1));

export class RKG {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(RKG.prototype);
    obj.__wbg_ptr = ptr;
    RKGFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    RKGFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_rkg_free(ptr, 0);
  }
  /**
   * @returns {RegularTrack}
   */
  get track() {
    const ret = wasm.__wbg_get_rkg_track(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {RegularTrack} arg0
   */
  set track(arg0) {
    wasm.__wbg_set_rkg_track(this.__wbg_ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get time() {
    const ret = wasm.__wbg_get_rkg_time(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set time(arg0) {
    wasm.__wbg_set_rkg_time(this.__wbg_ptr, arg0);
  }
  /**
   * @returns {Combo}
   */
  get combo() {
    const ret = wasm.__wbg_get_rkg_combo(this.__wbg_ptr);
    return Combo.__wrap(ret);
  }
  /**
   * @param {Combo} arg0
   */
  set combo(arg0) {
    _assertClass(arg0, Combo);
    var ptr0 = arg0.__destroy_into_raw();
    wasm.__wbg_set_rkg_combo(this.__wbg_ptr, ptr0);
  }
  /**
   * @returns {Controller}
   */
  get controller() {
    const ret = wasm.__wbg_get_rkg_controller(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {Controller} arg0
   */
  set controller(arg0) {
    wasm.__wbg_set_rkg_controller(this.__wbg_ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get date() {
    const ret = wasm.__wbg_get_rkg_date(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set date(arg0) {
    wasm.__wbg_set_rkg_date(this.__wbg_ptr, arg0);
  }
  /**
   * @returns {Miniturbo}
   */
  get miniturbo() {
    const ret = wasm.__wbg_get_rkg_miniturbo(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {Miniturbo} arg0
   */
  set miniturbo(arg0) {
    wasm.__wbg_set_rkg_miniturbo(this.__wbg_ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get lap1() {
    const ret = wasm.__wbg_get_rkg_lap1(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set lap1(arg0) {
    wasm.__wbg_set_rkg_lap1(this.__wbg_ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get lap2() {
    const ret = wasm.__wbg_get_rkg_lap2(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set lap2(arg0) {
    wasm.__wbg_set_rkg_lap2(this.__wbg_ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get lap3() {
    const ret = wasm.__wbg_get_rkg_lap3(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set lap3(arg0) {
    wasm.__wbg_set_rkg_lap3(this.__wbg_ptr, arg0);
  }
  /**
   * @returns {Shroomstrat}
   */
  get shrooms() {
    const ret = wasm.__wbg_get_rkg_shrooms(this.__wbg_ptr);
    return Shroomstrat.__wrap(ret);
  }
  /**
   * @param {Shroomstrat} arg0
   */
  set shrooms(arg0) {
    _assertClass(arg0, Shroomstrat);
    var ptr0 = arg0.__destroy_into_raw();
    wasm.__wbg_set_rkg_shrooms(this.__wbg_ptr, ptr0);
  }
}

const ShroomstratFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_shroomstrat_free(ptr >>> 0, 1));

export class Shroomstrat {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Shroomstrat.prototype);
    obj.__wbg_ptr = ptr;
    ShroomstratFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    ShroomstratFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_shroomstrat_free(ptr, 0);
  }
  /**
   * @returns {number | undefined}
   */
  get shroomstrat() {
    const ret = wasm.__wbg_get_shroomstrat_shroomstrat(this.__wbg_ptr);
    return ret === 0xffffff ? undefined : ret;
  }
  /**
   * @param {number | null} [arg0]
   */
  set shroomstrat(arg0) {
    wasm.__wbg_set_shroomstrat_shroomstrat(this.__wbg_ptr, isLikeNone(arg0) ? 0xffffff : arg0);
  }
}

async function __wbg_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn(
            "`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
            e,
          );
        } else {
          throw e;
        }
      }
    }

    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);

    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}

function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbindgen_init_externref_table = function () {
    const table = wasm.__wbindgen_export_0;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
  };
  imports.wbg.__wbindgen_throw = function (arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };

  return imports;
}

function __wbg_init_memory(imports, memory) {}

function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  __wbg_init.__wbindgen_wasm_module = module;
  cachedUint8ArrayMemory0 = null;

  wasm.__wbindgen_start();
  return wasm;
}

function initSync(module) {
  if (wasm !== undefined) return wasm;

  if (typeof module !== "undefined") {
    if (Object.getPrototypeOf(module) === Object.prototype) {
      ({ module } = module);
    } else {
      console.warn("using deprecated parameters for `initSync()`; pass a single object instead");
    }
  }

  const imports = __wbg_get_imports();

  __wbg_init_memory(imports);

  if (!(module instanceof WebAssembly.Module)) {
    module = new WebAssembly.Module(module);
  }

  const instance = new WebAssembly.Instance(module, imports);

  return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
  if (wasm !== undefined) return wasm;

  if (typeof module_or_path !== "undefined") {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({ module_or_path } = module_or_path);
    } else {
      console.warn(
        "using deprecated parameters for the initialization function; pass a single object instead",
      );
    }
  }

  if (typeof module_or_path === "undefined") {
    module_or_path = new URL("mkw_lib_bg.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();

  if (
    typeof module_or_path === "string" ||
    (typeof Request === "function" && module_or_path instanceof Request) ||
    (typeof URL === "function" && module_or_path instanceof URL)
  ) {
    module_or_path = fetch(module_or_path);
  }

  __wbg_init_memory(imports);

  const { instance, module } = await __wbg_load(await module_or_path, imports);

  return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;

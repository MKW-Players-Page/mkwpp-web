use wasm_bindgen::prelude::*;

pub const RKGD_MAGIC_NUMBERS: [u8; 4] = [0x52, 0x4B, 0x47, 0x44];
pub const RKPD_MAGIC_NUMBERS: [u8; 4] = [0x52, 0x4B, 0x50, 0x44];
pub const RKSD_MAGIC_NUMBERS: [u8; 4] = [0x52, 0x4B, 0x53, 0x44];
pub const RKPD_LENGTH: usize = 0x8CC0;
pub const LICENSE_GHOST_DATA_OFFSET: usize = 0x28000;
pub const LICENSE_GHOST_DATA_LENGTH: usize = 0xA5000;
pub const MAX_GHOST_DATA_LENGTH: usize = 0x2800;

#[wasm_bindgen]
pub enum RKGReadErrors {
    IsNotRKG,
    IsNotValidTime,
    IsNotValidDate,
    IsNotValidRKSYS,
    NotCorrectLength,
}

#[wasm_bindgen]
pub fn read_rksys(
    rksys_bytes: js_sys::Uint8Array,
    rkpd_bitmap: u8,
) -> Result<Vec<RKG>, RKGReadErrors> {
    let rksys_bytes = rksys_bytes.to_vec();
    if !rksys_bytes.starts_with(&RKSD_MAGIC_NUMBERS) {
        return Err(RKGReadErrors::IsNotValidRKSYS);
    }
    if rksys_bytes.len() != 2867200 {
        return Err(RKGReadErrors::IsNotValidRKSYS);
    }

    let mut out_vec = std::vec::Vec::new();
    out_vec.reserve_exact(32 * 4); // Reserves exactly as many ghosts as can be saved on file

    for license_number in 0..4 {
        if rkpd_bitmap & (0b0001 << license_number) == 0 {
            continue;
        }
        let rkpd_magic_numbers_idx = RKPD_LENGTH * license_number + 8;
        if !rksys_bytes[rkpd_magic_numbers_idx..rkpd_magic_numbers_idx + 4]
            .starts_with(&RKPD_MAGIC_NUMBERS)
        {
            continue;
        }

        let index = license_number * LICENSE_GHOST_DATA_LENGTH + LICENSE_GHOST_DATA_OFFSET;
        let rkpd_ghost_data = rksys_bytes[index..(index + LICENSE_GHOST_DATA_LENGTH)]
            .try_into()
            .map_err(|_| RKGReadErrors::NotCorrectLength)?;

        match read_rkpd(rkpd_ghost_data) {
            Ok(v) => out_vec.extend(v),
            Err(e) => return Err(e),
        }
    }

    return Ok(out_vec);
}

pub fn read_rkpd(ghost_data: [u8; LICENSE_GHOST_DATA_LENGTH]) -> Result<Vec<RKG>, RKGReadErrors> {
    let mut out_vec = vec![];
    out_vec.reserve_exact(32);

    for track_index in 0..32 {
        let rkg_index = track_index * MAX_GHOST_DATA_LENGTH;

        match read_rkg_internal(&ghost_data[rkg_index..(rkg_index + MAX_GHOST_DATA_LENGTH)]) {
            Err(_) => continue,
            Ok(v) => out_vec.push(v),
        };
    }

    return Ok(out_vec);
}

#[wasm_bindgen]
pub fn read_rkg(rkg_bytes: js_sys::Uint8Array) -> Result<RKG, RKGReadErrors> {
    return read_rkg_internal(&rkg_bytes.to_vec());
}

pub fn read_rkg_internal(rkg_bytes: &[u8]) -> Result<RKG, RKGReadErrors> {
    let mut out_rkg = RKG::default();

    if !rkg_bytes.starts_with(&RKGD_MAGIC_NUMBERS) {
        return Err(RKGReadErrors::IsNotRKG);
    }

    match read_rkg_format_time(
        &rkg_bytes[4..7]
            .try_into()
            .map_err(|_| RKGReadErrors::NotCorrectLength)?,
    ) {
        Ok(v) => out_rkg.time = v,
        Err(e) => return Err(e),
    }

    out_rkg.track = RegularTrack::from(rkg_bytes[7] >> 2);

    match read_rkg_format_date(
        &rkg_bytes[9..12]
            .try_into()
            .map_err(|_| RKGReadErrors::NotCorrectLength)?,
    ) {
        Ok(v) => {
            out_rkg.year = (v[0] as u16) + 2000;
            out_rkg.month = v[1];
            out_rkg.day = v[2];
        }
        Err(e) => return Err(e),
    }

    // All other data is currently not read, so...
    return Ok(out_rkg);
}

pub fn read_rkg_format_time(bytes: &[u8; 3]) -> Result<i32, RKGReadErrors> {
    // 3 Bytes, where M = Minutes, S = Seconds and C = Millis.
    // 1. 0bMMMMMMMS
    // 2. 0bSSSSSSCC
    // 3. 0bCCCCCCCC

    // max M = 5    // 0b0000101
    // max S = 59   // 0b0111011
    // max C = 999  // 0b1111100111
    // 1. 0b00001010
    // 2. 0b11101111
    // 3. 0b11100111
    let minutes = *bytes.first().ok_or(RKGReadErrors::IsNotValidTime)?; // The minutes are doubled here

    let second_byte = *bytes.get(1).ok_or(RKGReadErrors::IsNotValidTime)?;

    // You don't need the first bit, because 59 = 6 bits
    // Go up 8 lines for the breakdown of why
    let seconds = second_byte >> 2;

    let milliseconds: i32 = (((second_byte & 0b00000011) as i32) << 8)
        | (*bytes.get(2).ok_or(RKGReadErrors::IsNotValidTime)? as i32);

    // (Minutes * 60000) + (Seconds * 1000) + Milliseconds =
    // = (2*Minutes * 30000) + (Seconds * 1000) + Milliseconds
    let final_time: i32 = ((minutes as i32) * 30000) + ((seconds as i32) * 1000) + milliseconds;

    return Ok(final_time);
}

pub fn read_rkg_format_date(bytes: &[u8; 3]) -> Result<[u8; 3], RKGReadErrors> {
    // 3 Bytes, where Y = Year, M = Month and D = Days, and X = Unrelated.
    // 1. 0bXXXXYYYY
    // 2. 0bYYYMMMMD
    // 3. 0bDDDDXXXX

    // Y relative to year 2000
    let second_byte = *bytes.get(1).ok_or(RKGReadErrors::IsNotValidDate)?;
    let year = (((*bytes.first().ok_or(RKGReadErrors::IsNotValidDate)?) << 3) | (second_byte >> 5))
        & 0b01111111; // The minutes are doubled here
    let month = (second_byte << 3) >> 4;
    let day = ((second_byte << 4) | (*bytes.get(2).ok_or(RKGReadErrors::IsNotValidDate)? >> 4))
        & 0b00011111;

    return Ok([year, month, day]);
}

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq)]
pub struct RKG {
    // Both Javascript and the Wii use UTF-16.
    mii_name: wasm_bindgen::Clamped<Vec<u16>>,
    pub track: RegularTrack,
    pub time: i32,
    pub combo: Combo,
    pub controller: Controller,
    // date as unix timestamp in seconds
    pub year: u16,
    pub month: u8,
    pub day: u8,
    pub miniturbo: Miniturbo,
    pub lap1: i32,
    pub lap2: i32,
    pub lap3: i32,
    pub shrooms: Shroomstrat,
}

impl Default for RKG {
    fn default() -> Self {
        return RKG {
            mii_name: wasm_bindgen::Clamped(Vec::new()),
            track: RegularTrack::LC,
            time: 360000,
            combo: Combo::default(),
            controller: Controller::Unknown,
            miniturbo: Miniturbo::Unknown,
            year: 2008,
            month: 4,
            day: 1,
            lap1: 120000,
            lap2: 120000,
            lap3: 120000,
            shrooms: Shroomstrat::default(),
        };
    }
}

// impl RKG {
//     pub fn set_splits_from_chadsoft_ckgd(&mut self, ckgd: &Bytes) {
//         self.lap1 = read_rkg_format_time(ckgd.get(0x11..0x14).unwrap()).unwrap_or(120000);
//         self.lap2 = read_rkg_format_time(ckgd.get(0x14..0x17).unwrap()).unwrap_or(120000);
//         self.lap3 = read_rkg_format_time(ckgd.get(0x17..0x1A).unwrap()).unwrap_or(120000);
//     }
// }

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub struct Shroomstrat {
    pub shroomstrat: Option<u16>,
}

impl Default for Shroomstrat {
    fn default() -> Self {
        return Shroomstrat { shroomstrat: None };
    }
}

impl Shroomstrat {
    pub fn new(laps: Vec<u16>) -> Self {
        let mut shroomstrat: u16 = 0;
        for (i, shrooms) in laps.iter().enumerate().take(4) {
            shroomstrat |= shrooms << (14 - (i * 2)); // wtf did this do again???
        }
        return Shroomstrat {
            shroomstrat: Some(shroomstrat),
        };
    }

    pub fn display_shrooms_3lap(self) -> String {
        if self.shroomstrat.is_some() {
            return format!(
                "{}-{}-{}",
                self.shroomstrat.unwrap() >> 14,
                (self.shroomstrat.unwrap() << 2) >> 14,
                (self.shroomstrat.unwrap() << 4) >> 14
            );
        }
        return String::from("?-?-?");
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Eq, Debug, Hash)]
pub struct Combo {
    pub vehicle: Vehicle,
    pub character: Character,
}

impl Default for Combo {
    fn default() -> Self {
        return Combo {
            vehicle: Vehicle::Unknown,
            character: Character::Unknown,
        };
    }
}

impl Combo {
    pub fn is_valid(&self) -> bool {
        let vehicle_weight = self.vehicle.weight_class();
        let character_weight = self.character.weight_class();
        if vehicle_weight == character_weight
            || vehicle_weight == WeightClass::Unknown
            || character_weight == WeightClass::Unknown
        {
            return true;
        }
        return false;
    }

    pub fn weight_class(&self) -> WeightClass {
        if !self.is_valid() {
            return WeightClass::Unknown;
        }

        let vehicle_weight = self.vehicle.weight_class();
        if vehicle_weight == WeightClass::Unknown {
            return self.character.weight_class();
        }
        return vehicle_weight;
    }

    pub fn drift_type(&self) -> Drift {
        return self.vehicle.drift_type();
    }

    pub fn vehicle_type(&self) -> VehicleType {
        return self.vehicle.vehicle_type();
    }
}

#[derive(PartialEq, Debug)]
pub enum Drift {
    Inside,
    Outside,
    Unknown,
}

#[derive(PartialEq, Debug)]
pub enum VehicleType {
    Kart,
    Bike,
    Unknown,
}

#[derive(PartialEq, Debug)]
pub enum WeightClass {
    Small,
    Medium,
    Heavy,
    Unknown,
}

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Eq, Debug, Hash)]
pub enum Vehicle {
    StandardKartS,
    StandardKartM,
    StandardKartL,
    BoosterSeat,
    ClassicDragster,
    Offroader,
    MiniBeast,
    WildWing,
    FlameFlyer,
    CheepCharger,
    SuperBlooper,
    PiranhaProwler,
    TinyTitan,
    Daytripper,
    Jetsetter,
    BlueFalcon,
    Sprinter,
    Honeycoupe,
    StandardBikeS,
    StandardBikeM,
    StandardBikeL,
    BulletBike,
    MachBike,
    FlameRunner,
    BitBike,
    Sugarscoot,
    WarioBike,
    Quacker,
    ZipZip,
    ShootingStar,
    Magikruiser,
    Sneakster,
    Spear,
    JetBubble,
    DolphinDasher,
    Phantom,
    Unknown,
}

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Eq, Debug, Hash)]
pub enum Controller {
    WiiWheel,
    Nunchuck,
    ClassicController,
    GameCube,
    Unknown,
}

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Eq, Debug, Hash)]
pub enum Miniturbo {
    Automatic,
    Manual,
    Unknown,
}

#[wasm_bindgen]
#[derive(PartialEq, Copy, Clone, Debug, Hash, Eq)]
pub enum RegularTrack {
    LC,
    MMM,
    MG,
    TF,
    MC,
    CM,
    DKSC,
    WGM,
    DC,
    KC,
    MT,
    GV,
    DDR,
    MH,
    BC,
    RR,
    RPB,
    RYF,
    RGV2,
    RMR,
    RSL,
    RSGB,
    RDS,
    RWS,
    RDH,
    RBC3,
    RDKJP,
    RMC,
    RMC3,
    RPG,
    RDKM,
    RBC,
}

impl From<usize> for Vehicle {
    fn from(x: usize) -> Self {
        return match x {
            0 => Vehicle::StandardKartS,
            1 => Vehicle::StandardKartM,
            2 => Vehicle::StandardKartL,
            3 => Vehicle::BoosterSeat,
            4 => Vehicle::ClassicDragster,
            5 => Vehicle::Offroader,
            6 => Vehicle::MiniBeast,
            7 => Vehicle::WildWing,
            8 => Vehicle::FlameFlyer,
            9 => Vehicle::CheepCharger,
            10 => Vehicle::SuperBlooper,
            11 => Vehicle::PiranhaProwler,
            12 => Vehicle::TinyTitan,
            13 => Vehicle::Daytripper,
            14 => Vehicle::Jetsetter,
            15 => Vehicle::BlueFalcon,
            16 => Vehicle::Sprinter,
            17 => Vehicle::Honeycoupe,
            18 => Vehicle::StandardBikeS,
            19 => Vehicle::StandardBikeM,
            20 => Vehicle::StandardBikeL,
            21 => Vehicle::BulletBike,
            22 => Vehicle::MachBike,
            23 => Vehicle::FlameRunner,
            24 => Vehicle::BitBike,
            25 => Vehicle::Sugarscoot,
            26 => Vehicle::WarioBike,
            27 => Vehicle::Quacker,
            28 => Vehicle::ZipZip,
            29 => Vehicle::ShootingStar,
            30 => Vehicle::Magikruiser,
            31 => Vehicle::Sneakster,
            32 => Vehicle::Spear,
            33 => Vehicle::JetBubble,
            34 => Vehicle::DolphinDasher,
            35 => Vehicle::Phantom,
            _ => Vehicle::Unknown,
        };
    }
}

impl From<u8> for Vehicle {
    fn from(x: u8) -> Self {
        return match x {
            0 => Vehicle::StandardKartS,
            1 => Vehicle::StandardKartM,
            2 => Vehicle::StandardKartL,
            3 => Vehicle::BoosterSeat,
            4 => Vehicle::ClassicDragster,
            5 => Vehicle::Offroader,
            6 => Vehicle::MiniBeast,
            7 => Vehicle::WildWing,
            8 => Vehicle::FlameFlyer,
            9 => Vehicle::CheepCharger,
            10 => Vehicle::SuperBlooper,
            11 => Vehicle::PiranhaProwler,
            12 => Vehicle::TinyTitan,
            13 => Vehicle::Daytripper,
            14 => Vehicle::Jetsetter,
            15 => Vehicle::BlueFalcon,
            16 => Vehicle::Sprinter,
            17 => Vehicle::Honeycoupe,
            18 => Vehicle::StandardBikeS,
            19 => Vehicle::StandardBikeM,
            20 => Vehicle::StandardBikeL,
            21 => Vehicle::BulletBike,
            22 => Vehicle::MachBike,
            23 => Vehicle::FlameRunner,
            24 => Vehicle::BitBike,
            25 => Vehicle::Sugarscoot,
            26 => Vehicle::WarioBike,
            27 => Vehicle::Quacker,
            28 => Vehicle::ZipZip,
            29 => Vehicle::ShootingStar,
            30 => Vehicle::Magikruiser,
            31 => Vehicle::Sneakster,
            32 => Vehicle::Spear,
            33 => Vehicle::JetBubble,
            34 => Vehicle::DolphinDasher,
            35 => Vehicle::Phantom,
            _ => Vehicle::Unknown,
        };
    }
}

impl Vehicle {
    fn drift_type(&self) -> Drift {
        return match self {
            Vehicle::StandardKartS
            | Vehicle::BoosterSeat
            | Vehicle::MiniBeast
            | Vehicle::CheepCharger
            | Vehicle::TinyTitan
            | Vehicle::BlueFalcon
            | Vehicle::StandardBikeS
            | Vehicle::BitBike
            | Vehicle::StandardKartM
            | Vehicle::ClassicDragster
            | Vehicle::WildWing
            | Vehicle::SuperBlooper
            | Vehicle::Daytripper
            | Vehicle::Sprinter
            | Vehicle::StandardBikeM
            | Vehicle::Sugarscoot
            | Vehicle::ZipZip
            | Vehicle::StandardKartL
            | Vehicle::Offroader
            | Vehicle::FlameFlyer
            | Vehicle::PiranhaProwler
            | Vehicle::Jetsetter
            | Vehicle::Honeycoupe
            | Vehicle::StandardBikeL
            | Vehicle::WarioBike
            | Vehicle::ShootingStar
            | Vehicle::Phantom => Drift::Outside,
            Vehicle::BulletBike
            | Vehicle::Quacker
            | Vehicle::Magikruiser
            | Vehicle::JetBubble
            | Vehicle::MachBike
            | Vehicle::Sneakster
            | Vehicle::DolphinDasher
            | Vehicle::FlameRunner
            | Vehicle::Spear => Drift::Inside,
            Vehicle::Unknown => Drift::Unknown,
        };
    }

    fn vehicle_type(&self) -> VehicleType {
        match self {
            Vehicle::StandardKartS
            | Vehicle::BoosterSeat
            | Vehicle::MiniBeast
            | Vehicle::CheepCharger
            | Vehicle::TinyTitan
            | Vehicle::BlueFalcon
            | Vehicle::StandardKartM
            | Vehicle::ClassicDragster
            | Vehicle::WildWing
            | Vehicle::SuperBlooper
            | Vehicle::Daytripper
            | Vehicle::Sprinter
            | Vehicle::StandardKartL
            | Vehicle::Offroader
            | Vehicle::FlameFlyer
            | Vehicle::PiranhaProwler
            | Vehicle::Jetsetter
            | Vehicle::Honeycoupe => return VehicleType::Kart,
            Vehicle::StandardBikeS
            | Vehicle::BitBike
            | Vehicle::BulletBike
            | Vehicle::Quacker
            | Vehicle::Magikruiser
            | Vehicle::JetBubble
            | Vehicle::StandardBikeM
            | Vehicle::Sugarscoot
            | Vehicle::ZipZip
            | Vehicle::MachBike
            | Vehicle::Sneakster
            | Vehicle::StandardBikeL
            | Vehicle::WarioBike
            | Vehicle::ShootingStar
            | Vehicle::Phantom
            | Vehicle::DolphinDasher
            | Vehicle::FlameRunner
            | Vehicle::Spear => return VehicleType::Bike,
            Vehicle::Unknown => return VehicleType::Unknown,
        }
    }

    fn weight_class(&self) -> WeightClass {
        match self {
            Vehicle::StandardKartS
            | Vehicle::BoosterSeat
            | Vehicle::MiniBeast
            | Vehicle::CheepCharger
            | Vehicle::TinyTitan
            | Vehicle::BlueFalcon
            | Vehicle::StandardBikeS
            | Vehicle::BulletBike
            | Vehicle::BitBike
            | Vehicle::Quacker
            | Vehicle::Magikruiser
            | Vehicle::JetBubble => return WeightClass::Small,
            Vehicle::StandardKartM
            | Vehicle::ClassicDragster
            | Vehicle::WildWing
            | Vehicle::SuperBlooper
            | Vehicle::Daytripper
            | Vehicle::Sprinter
            | Vehicle::StandardBikeM
            | Vehicle::MachBike
            | Vehicle::Sugarscoot
            | Vehicle::ZipZip
            | Vehicle::Sneakster
            | Vehicle::DolphinDasher => return WeightClass::Medium,
            Vehicle::StandardKartL
            | Vehicle::Offroader
            | Vehicle::FlameFlyer
            | Vehicle::PiranhaProwler
            | Vehicle::Jetsetter
            | Vehicle::Honeycoupe
            | Vehicle::StandardBikeL
            | Vehicle::FlameRunner
            | Vehicle::WarioBike
            | Vehicle::ShootingStar
            | Vehicle::Spear
            | Vehicle::Phantom => return WeightClass::Heavy,
            Vehicle::Unknown => return WeightClass::Unknown,
        }
    }

    pub fn fmt(&self) -> String {
        match self {
            Vehicle::StandardKartS => return String::from("sdfk"),
            Vehicle::StandardKartM => return String::from("mdfk"),
            Vehicle::StandardKartL => return String::from("ldfk"),
            Vehicle::BoosterSeat => return String::from("sak"),
            Vehicle::ClassicDragster => return String::from("mak"),
            Vehicle::Offroader => return String::from("lak"),
            Vehicle::MiniBeast => return String::from("sbk"),
            Vehicle::WildWing => return String::from("mbk"),
            Vehicle::FlameFlyer => return String::from("lbk"),
            Vehicle::CheepCharger => return String::from("sck"),
            Vehicle::SuperBlooper => return String::from("mck"),
            Vehicle::PiranhaProwler => return String::from("lck"),
            Vehicle::TinyTitan => return String::from("sdk"),
            Vehicle::Daytripper => return String::from("mdk"),
            Vehicle::Jetsetter => return String::from("ldk"),
            Vehicle::BlueFalcon => return String::from("sek"),
            Vehicle::Sprinter => return String::from("mek"),
            Vehicle::Honeycoupe => return String::from("lek"),
            Vehicle::StandardBikeS => return String::from("sdfb"),
            Vehicle::StandardBikeM => return String::from("mdfb"),
            Vehicle::StandardBikeL => return String::from("ldfb"),
            Vehicle::BulletBike => return String::from("sab"),
            Vehicle::MachBike => return String::from("mab"),
            Vehicle::FlameRunner => return String::from("lab"),
            Vehicle::BitBike => return String::from("sbb"),
            Vehicle::Sugarscoot => return String::from("mbb"),
            Vehicle::WarioBike => return String::from("lbb"),
            Vehicle::Quacker => return String::from("scb"),
            Vehicle::ZipZip => return String::from("mcb"),
            Vehicle::ShootingStar => return String::from("lcb"),
            Vehicle::Magikruiser => return String::from("sdb"),
            Vehicle::Sneakster => return String::from("mdb"),
            Vehicle::Spear => return String::from("ldb"),
            Vehicle::JetBubble => return String::from("seb"),
            Vehicle::DolphinDasher => return String::from("meb"),
            Vehicle::Phantom => return String::from("leb"),
            Vehicle::Unknown => return String::from("unknown"),
        }
    }
}

impl From<usize> for RegularTrack {
    fn from(value: usize) -> Self {
        return match value {
            0x08 => RegularTrack::LC,
            0x01 => RegularTrack::MMM,
            0x02 => RegularTrack::MG,
            0x04 => RegularTrack::TF,
            0x00 => RegularTrack::MC,
            0x05 => RegularTrack::CM,
            0x06 => RegularTrack::DKSC,
            0x07 => RegularTrack::WGM,
            0x09 => RegularTrack::DC,
            0x0F => RegularTrack::KC,
            0x0B => RegularTrack::MT,
            0x03 => RegularTrack::GV,
            0x0E => RegularTrack::DDR,
            0x0A => RegularTrack::MH,
            0x0C => RegularTrack::BC,
            0x0D => RegularTrack::RR,
            0x10 => RegularTrack::RPB,
            0x14 => RegularTrack::RYF,
            0x19 => RegularTrack::RGV2,
            0x1A => RegularTrack::RMR,
            0x1B => RegularTrack::RSL,
            0x1F => RegularTrack::RSGB,
            0x17 => RegularTrack::RDS,
            0x12 => RegularTrack::RWS,
            0x15 => RegularTrack::RDH,
            0x1E => RegularTrack::RBC3,
            0x1D => RegularTrack::RDKJP,
            0x11 => RegularTrack::RMC,
            0x18 => RegularTrack::RMC3,
            0x16 => RegularTrack::RPG,
            0x13 => RegularTrack::RDKM,
            0x1C => RegularTrack::RBC,
            _ => panic!(),
        };
    }
}
impl From<u8> for RegularTrack {
    fn from(value: u8) -> Self {
        return match value {
            0x08 => RegularTrack::LC,
            0x01 => RegularTrack::MMM,
            0x02 => RegularTrack::MG,
            0x04 => RegularTrack::TF,
            0x00 => RegularTrack::MC,
            0x05 => RegularTrack::CM,
            0x06 => RegularTrack::DKSC,
            0x07 => RegularTrack::WGM,
            0x09 => RegularTrack::DC,
            0x0F => RegularTrack::KC,
            0x0B => RegularTrack::MT,
            0x03 => RegularTrack::GV,
            0x0E => RegularTrack::DDR,
            0x0A => RegularTrack::MH,
            0x0C => RegularTrack::BC,
            0x0D => RegularTrack::RR,
            0x10 => RegularTrack::RPB,
            0x14 => RegularTrack::RYF,
            0x19 => RegularTrack::RGV2,
            0x1A => RegularTrack::RMR,
            0x1B => RegularTrack::RSL,
            0x1F => RegularTrack::RSGB,
            0x17 => RegularTrack::RDS,
            0x12 => RegularTrack::RWS,
            0x15 => RegularTrack::RDH,
            0x1E => RegularTrack::RBC3,
            0x1D => RegularTrack::RDKJP,
            0x11 => RegularTrack::RMC,
            0x18 => RegularTrack::RMC3,
            0x16 => RegularTrack::RPG,
            0x13 => RegularTrack::RDKM,
            0x1C => RegularTrack::RBC,
            _ => panic!(),
        };
    }
}

impl From<usize> for Controller {
    fn from(value: usize) -> Self {
        return match value {
            0 => Controller::WiiWheel,
            1 => Controller::Nunchuck,
            2 => Controller::ClassicController,
            3 => Controller::GameCube,
            _ => Controller::Unknown,
        };
    }
}

impl From<u8> for Controller {
    fn from(value: u8) -> Self {
        return match value {
            0 => Controller::WiiWheel,
            1 => Controller::Nunchuck,
            2 => Controller::ClassicController,
            3 => Controller::GameCube,
            _ => Controller::Unknown,
        };
    }
}

impl Controller {
    pub fn fmt(&self) -> String {
        match self {
            Controller::WiiWheel => return String::from("wheel"),
            Controller::Nunchuck => return String::from("chuck"),
            Controller::ClassicController => return String::from("cc"),
            Controller::GameCube => return String::from("gcn"),
            Controller::Unknown => return String::from("unknown"),
        }
    }
}

impl From<Option<bool>> for Miniturbo {
    fn from(value: Option<bool>) -> Self {
        if let Some(value) = value {
            if value {
                return Miniturbo::Automatic;
            }
            return Miniturbo::Manual;
        }
        return Miniturbo::Unknown;
    }
}

impl From<Miniturbo> for Option<bool> {
    fn from(val: Miniturbo) -> Self {
        match &val {
            Miniturbo::Automatic => return Some(true),
            Miniturbo::Manual => return Some(false),
            Miniturbo::Unknown => return None,
        }
    }
}

impl Miniturbo {
    pub fn fmt(&self) -> String {
        match self {
            Miniturbo::Automatic => return String::from("no_"),
            Miniturbo::Manual => return String::new(),
            Miniturbo::Unknown => return String::from("uk_"),
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Eq, Debug, Hash)]
pub enum Character {
    Mario,
    BabyPeach,
    Waluigi,
    Bowser,
    BabyDaisy,
    DryBones,
    BabyMario,
    Luigi,
    Toad,
    DonkeyKong,
    Yoshi,
    Wario,
    BabyLuigi,
    Toadette,
    Koopa,
    Daisy,
    Peach,
    Birdo,
    DiddyKong,
    KingBoo,
    BowserJr,
    DryBowser,
    FunkyKong,
    Rosalina,
    MiiAMaleSmall,
    MiiAFemaleSmall,
    MiiBMaleSmall,
    MiiBFemaleSmall,
    MiiCMaleSmall,
    MiiCFemaleSmall,
    MiiAMaleMedium,
    MiiAFemaleMedium,
    MiiBMaleMedium,
    MiiBFemaleMedium,
    MiiCMaleMedium,
    MiiCFemaleMedium,
    MiiAMaleHeavy,
    MiiAFemaleHeavy,
    MiiBMaleHeavy,
    MiiBFemaleHeavy,
    MiiCMaleHeavy,
    MiiCFemaleHeavy,
    MediumMii,
    SmallMii,
    LargeMii,
    BikerPeach,
    BikerDaisy,
    BikerRosalina,
    Unknown,
}

impl From<usize> for Character {
    fn from(x: usize) -> Self {
        return match x {
            0 => Character::Mario,
            1 => Character::BabyPeach,
            2 => Character::Waluigi,
            3 => Character::Bowser,
            4 => Character::BabyDaisy,
            5 => Character::DryBones,
            6 => Character::BabyMario,
            7 => Character::Luigi,
            8 => Character::Toad,
            9 => Character::DonkeyKong,
            10 => Character::Yoshi,
            11 => Character::Wario,
            12 => Character::BabyLuigi,
            13 => Character::Toadette,
            14 => Character::Koopa,
            15 => Character::Daisy,
            16 => Character::Peach,
            17 => Character::Birdo,
            18 => Character::DiddyKong,
            19 => Character::KingBoo,
            20 => Character::BowserJr,
            21 => Character::DryBowser,
            22 => Character::FunkyKong,
            23 => Character::Rosalina,
            24 => Character::MiiAMaleSmall,
            25 => Character::MiiAFemaleSmall,
            26 => Character::MiiBMaleSmall,
            27 => Character::MiiBFemaleSmall,
            28 => Character::MiiCMaleSmall,
            29 => Character::MiiCFemaleSmall,
            30 => Character::MiiAMaleMedium,
            31 => Character::MiiAFemaleMedium,
            32 => Character::MiiBMaleMedium,
            33 => Character::MiiBFemaleMedium,
            34 => Character::MiiCMaleMedium,
            35 => Character::MiiCFemaleMedium,
            36 => Character::MiiAMaleHeavy,
            37 => Character::MiiAFemaleHeavy,
            38 => Character::MiiBMaleHeavy,
            39 => Character::MiiBFemaleHeavy,
            40 => Character::MiiCMaleHeavy,
            41 => Character::MiiCFemaleHeavy,
            42 => Character::MediumMii,
            43 => Character::SmallMii,
            44 => Character::LargeMii,
            45 => Character::BikerPeach,
            46 => Character::BikerDaisy,
            47 => Character::BikerRosalina,
            _ => Character::Unknown,
        };
    }
}

impl From<u8> for Character {
    fn from(x: u8) -> Self {
        return match x {
            0 => Character::Mario,
            1 => Character::BabyPeach,
            2 => Character::Waluigi,
            3 => Character::Bowser,
            4 => Character::BabyDaisy,
            5 => Character::DryBones,
            6 => Character::BabyMario,
            7 => Character::Luigi,
            8 => Character::Toad,
            9 => Character::DonkeyKong,
            10 => Character::Yoshi,
            11 => Character::Wario,
            12 => Character::BabyLuigi,
            13 => Character::Toadette,
            14 => Character::Koopa,
            15 => Character::Daisy,
            16 => Character::Peach,
            17 => Character::Birdo,
            18 => Character::DiddyKong,
            19 => Character::KingBoo,
            20 => Character::BowserJr,
            21 => Character::DryBowser,
            22 => Character::FunkyKong,
            23 => Character::Rosalina,
            24 => Character::MiiAMaleSmall,
            25 => Character::MiiAFemaleSmall,
            26 => Character::MiiBMaleSmall,
            27 => Character::MiiBFemaleSmall,
            28 => Character::MiiCMaleSmall,
            29 => Character::MiiCFemaleSmall,
            30 => Character::MiiAMaleMedium,
            31 => Character::MiiAFemaleMedium,
            32 => Character::MiiBMaleMedium,
            33 => Character::MiiBFemaleMedium,
            34 => Character::MiiCMaleMedium,
            35 => Character::MiiCFemaleMedium,
            36 => Character::MiiAMaleHeavy,
            37 => Character::MiiAFemaleHeavy,
            38 => Character::MiiBMaleHeavy,
            39 => Character::MiiBFemaleHeavy,
            40 => Character::MiiCMaleHeavy,
            41 => Character::MiiCFemaleHeavy,
            42 => Character::MediumMii,
            43 => Character::SmallMii,
            44 => Character::LargeMii,
            45 => Character::BikerPeach,
            46 => Character::BikerDaisy,
            47 => Character::BikerRosalina,
            _ => Character::Unknown,
        };
    }
}

impl Character {
    fn weight_class(&self) -> WeightClass {
        return match self {
            Character::BabyPeach
            | Character::BabyDaisy
            | Character::DryBones
            | Character::BabyMario
            | Character::Toad
            | Character::BabyLuigi
            | Character::Toadette
            | Character::Koopa
            | Character::MiiAMaleSmall
            | Character::MiiBMaleSmall
            | Character::MiiCMaleSmall
            | Character::MiiAFemaleSmall
            | Character::MiiBFemaleSmall
            | Character::MiiCFemaleSmall
            | Character::SmallMii => WeightClass::Small,
            Character::Mario
            | Character::Luigi
            | Character::Yoshi
            | Character::Daisy
            | Character::Peach
            | Character::Birdo
            | Character::DiddyKong
            | Character::BowserJr
            | Character::MiiAMaleMedium
            | Character::MiiBMaleMedium
            | Character::MiiCMaleMedium
            | Character::MiiAFemaleMedium
            | Character::MiiBFemaleMedium
            | Character::MiiCFemaleMedium
            | Character::MediumMii
            | Character::BikerPeach
            | Character::BikerDaisy => WeightClass::Medium,
            Character::Waluigi
            | Character::Bowser
            | Character::DonkeyKong
            | Character::Wario
            | Character::KingBoo
            | Character::DryBowser
            | Character::FunkyKong
            | Character::Rosalina
            | Character::MiiAMaleHeavy
            | Character::MiiBMaleHeavy
            | Character::MiiCMaleHeavy
            | Character::MiiAFemaleHeavy
            | Character::MiiBFemaleHeavy
            | Character::MiiCFemaleHeavy
            | Character::LargeMii
            | Character::BikerRosalina => WeightClass::Heavy,
            Character::Unknown => WeightClass::Unknown,
        };
    }
}

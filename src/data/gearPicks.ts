import { gearPhotos } from "@/assets/gear-photos";
import { amazonSearch, BOOK_URL, VANTRUE_URL } from "@/config/affiliate";

export const GEAR_CATEGORIES = [
  "All",
  "Safety & Cameras",
  "Navigation & Comms",
  "Cab Comfort",
  "Food & Power",
  "Tools & Equipment",
  "Books",
  "Clothing",
] as const;

export type GearCategory = Exclude<(typeof GEAR_CATEGORIES)[number], "All">;

export type GearPick = {
  name: string;
  category: GearCategory;
  oneLineWhy: string;
  url: string;
  badge?: string;
  /** Swap the photo by changing this one value. */
  image: string;
  imageAlt: string;
};

export const gearPicks: GearPick[] = [
  // Safety & Cameras
  { name: "Vantrue N4 Pro 3-Channel Dash Cam", category: "Safety & Cameras", oneLineWhy: "Front, cab and rear on camera. When it's your word against a four-wheeler, footage wins.", url: VANTRUE_URL, badge: "George Uses", image: gearPhotos.dashCam, imageAlt: "Three-lens dash camera mounted on a semi truck windshield" },
  { name: "Class 2 Hi-Vis Safety Vest", category: "Safety & Cameras", oneLineWhy: "Most shippers and every shoulder at night demand it. Keep one by the door.", url: amazonSearch("class 2 hi vis safety vest"), image: gearPhotos.hiVisVest, imageAlt: "Yellow hi-vis safety vest with reflective stripes" },
  { name: "Rechargeable LED Headlamp", category: "Safety & Cameras", oneLineWhy: "Both hands free for pre-trips, chains and dark docks. No more flashlight in your teeth.", url: amazonSearch("rechargeable led headlamp"), image: gearPhotos.headlamp, imageAlt: "Rechargeable LED headlamp with the beam on" },
  { name: "Dual-Foot Truck Tire Pressure Gauge", category: "Safety & Cameras", oneLineWhy: "Check inside duals without a fight. Low tires cost you fuel and blowouts.", url: amazonSearch("truck tire pressure gauge dual foot"), image: gearPhotos.tireGauge, imageAlt: "Chrome dual-foot truck tire pressure gauge" },

  // Navigation & Comms
  { name: "Garmin dēzl OTR Truck GPS", category: "Navigation & Comms", oneLineWhy: "Routes by your height and weight so you don't end up under a low bridge.", url: amazonSearch("garmin dezl otr truck gps"), image: gearPhotos.truckGps, imageAlt: "Truck GPS navigator on a semi truck dashboard" },
  { name: "Cobra 29 LTD CB Radio", category: "Navigation & Comms", oneLineWhy: "Still the fastest way to hear about the wreck two miles ahead.", url: amazonSearch("cobra 29 ltd cb radio"), image: gearPhotos.cbRadio, imageAlt: "CB radio and handheld mic mounted in a truck cab" },
  { name: "BlueParrott B450-XT Headset", category: "Navigation & Comms", oneLineWhy: "Cuts out engine noise so dispatch and brokers actually hear you.", url: amazonSearch("blueparrott b450-xt"), image: gearPhotos.headset, imageAlt: "Single-ear trucker headset with boom microphone" },

  // Cab Comfort
  { name: "Sleeper Mattress Topper (42x80)", category: "Cab Comfort", oneLineWhy: "Factory sleeper mattresses are rough. Good sleep keeps you safe and legal.", url: amazonSearch("truck sleeper mattress topper 42x80"), image: gearPhotos.mattressTopper, imageAlt: "Memory foam mattress topper on a truck sleeper bed" },
  { name: "Sleeper Blackout Curtain", category: "Cab Comfort", oneLineWhy: "Sleep in a lit truck stop at noon like it's midnight.", url: amazonSearch("semi truck sleeper blackout curtain"), image: gearPhotos.blackoutCurtain, imageAlt: "Blackout curtain closed across a truck sleeper" },
  { name: "Gel Seat Cushion", category: "Cab Comfort", oneLineWhy: "Eleven hours in the seat adds up. Your back and hips will thank you.", url: amazonSearch("truck driver seat cushion gel"), image: gearPhotos.seatCushion, imageAlt: "Gel seat cushion on a truck driver's seat" },
  { name: "Portable Toilet for Truckers", category: "Cab Comfort", oneLineWhy: "For the nights you're parked tight and the building is closed.", url: amazonSearch("portable toilet for truck drivers"), image: gearPhotos.portableToilet, imageAlt: "Compact portable toilet" },

  // Food & Power
  { name: "RoadPro 12V Lunchbox Stove", category: "Food & Power", oneLineWhy: "Hot meal off the lighter socket. Saves money and your waistline.", url: amazonSearch("roadpro 12v lunchbox stove"), image: gearPhotos.lunchboxStove, imageAlt: "12-volt lunchbox stove on a truck dashboard" },
  { name: "12V Portable Fridge Freezer", category: "Food & Power", oneLineWhy: "Keep real food cold all week instead of living on truck stop roller grill.", url: amazonSearch("12v portable fridge freezer truck"), image: gearPhotos.portableFridge, imageAlt: "12-volt portable fridge with cold drinks in a truck cab" },
  { name: "1000 Watt Power Inverter", category: "Food & Power", oneLineWhy: "Run a laptop, microwave or coffee pot without idling all night.", url: amazonSearch("1000 watt power inverter truck"), image: gearPhotos.powerInverter, imageAlt: "12-volt power inverter with two outlets" },
  { name: "NOCO Boost Jump Starter", category: "Food & Power", oneLineWhy: "Dead battery at 3 a.m. doesn't have to mean a road service bill.", url: amazonSearch("noco boost jump starter"), image: gearPhotos.jumpStarter, imageAlt: "Portable jump starter with red and black clamps" },

  // Tools & Equipment
  { name: "Mechanix Wear Work Gloves", category: "Tools & Equipment", oneLineWhy: "Grip for gladhands and straps without tearing up your hands.", url: amazonSearch("mechanix wear work gloves"), image: gearPhotos.workGloves, imageAlt: "Pair of black and gray work gloves" },
  { name: "Fifth Wheel Release Puller", category: "Tools & Equipment", oneLineWhy: "Pull a stuck fifth wheel handle without crawling under the trailer.", url: amazonSearch("fifth wheel release handle puller"), image: gearPhotos.fifthWheelPuller, imageAlt: "Fifth wheel release puller tool with hooked end" },
  { name: "Gladhand Seals Kit", category: "Tools & Equipment", oneLineWhy: "A two-dollar seal saves you from an air leak and a roadside call.", url: amazonSearch("gladhand seals"), image: gearPhotos.gladhandSeals, imageAlt: "Red and blue gladhand seals next to a gladhand" },
  { name: "Tire Thumper", category: "Tools & Equipment", oneLineWhy: "Quick check for flats on every walk-around. Doubles as peace of mind.", url: amazonSearch("tire thumper truck"), image: gearPhotos.tireThumper, imageAlt: "Wooden tire thumper leaning on a semi truck tire" },
  { name: "Heavy Duty 2\" Ratchet Straps", category: "Tools & Equipment", oneLineWhy: "Secure the load or the stuff in your cab. Cheap straps snap.", url: amazonSearch("heavy duty ratchet straps 2 inch"), image: gearPhotos.ratchetStraps, imageAlt: "Two orange 2-inch ratchet straps" },

  // Books
  { name: "The New Authority Survival Guide by George Williams", category: "Books", oneLineWhy: "What I wish somebody told me before I opened my own authority.", url: BOOK_URL, badge: "My Book", image: gearPhotos.bookCoverPlaceholder, imageAlt: "Book cover: The New Authority Survival Guide by George Williams" },

  // Clothing
  { name: "True Trucking Merch", category: "Clothing", oneLineWhy: "Shirts, hoodies and hats for drivers who rep the road.", url: "https://shop.truetruckingtv.com", badge: "Official Merch", image: gearPhotos.merchTshirt, imageAlt: "True Trucking classic t-shirt" },
];

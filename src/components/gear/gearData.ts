import bluetoothHeadsetImage from "@/assets/gear/professional-trucker-bluetooth-headset.png";
import blackoutShadesImage from "@/assets/gear/blackout-window-shades-for-truck.png";
import cbRadioImage from "@/assets/gear/cb-radio-for-truckers.png";
import dashCameraImage from "@/assets/gear/dash-camera-for-trucks.png";
import truckGpsImage from "@/assets/gear/garmin-dezl-truck-gps.png";
import powerInverterImage from "@/assets/gear/heavy-duty-power-inverter.png";
import flashlightImage from "@/assets/gear/heavy-duty-trucker-flashlight.png";
import emergencyKitImage from "@/assets/gear/led-roadside-emergency-kit.png";
import miniFridgeImage from "@/assets/gear/truck-cab-mini-fridge.png";
import phoneMountImage from "@/assets/gear/truck-driver-phone-mount.png";
import type { Category } from "@/components/gear/types";

export const affiliatePlaceholderUrl = "#";

export const categories: Category[] = [
  {
    id: "category-1",
    title: "Communication Gear",
    products: [
      {
        name: "Professional Trucker Bluetooth Headset",
        priceRange: "$79 to $299",
        description: ["Crystal clear calls on the road.", "Noise cancelling mic for truck cab use."],
        image: bluetoothHeadsetImage,
        imageAlt: "Professional trucker Bluetooth headset shown inside a semi-truck cab with red accent lighting.",
      },
      {
        name: "CB Radio for Truckers",
        priceRange: "$89 to $189",
        description: ["Stay connected with other drivers.", "Essential tool for every trucker."],
        image: cbRadioImage,
        imageAlt: "CB radio resting on a truck dashboard with illuminated red controls.",
      },
    ],
  },
  {
    id: "category-2",
    title: "Safety and Lighting",
    products: [
      {
        name: "Heavy Duty Trucker Flashlight",
        priceRange: "$29 to $89",
        description: ["Military grade brightness.", "Rechargeable and waterproof."],
        image: flashlightImage,
        imageAlt: "Heavy-duty flashlight on a textured metal truck floor with dark red lighting.",
      },
      {
        name: "LED Roadside Emergency Kit",
        priceRange: "$39 to $79",
        description: ["DOT approved warning triangles", "and LED flares for roadside safety."],
        image: emergencyKitImage,
        imageAlt: "Roadside emergency kit with warning triangle and LED flares in front of a semi truck at night.",
      },
    ],
  },
  {
    id: "category-3",
    title: "Navigation and Tech",
    products: [
      {
        name: "Garmin dezl Truck GPS",
        priceRange: "$249 to $399",
        description: ["Built specifically for truck drivers.", "Custom truck routing avoids low bridges."],
        image: truckGpsImage,
        imageAlt: "Truck GPS mounted on a dashboard inside a semi-truck cab.",
      },
      {
        name: "Dash Camera for Trucks",
        priceRange: "$89 to $299",
        description: ["Protect yourself on the road.", "Full HD recording front and rear."],
        image: dashCameraImage,
        imageAlt: "Dash camera mounted near a truck windshield above an open highway.",
      },
    ],
  },
  {
    id: "category-4",
    title: "Cab Comfort",
    products: [
      {
        name: "Truck Cab Mini Fridge",
        priceRange: "$49 to $149",
        description: ["Keep food and drinks cold on long hauls.", "Plugs into truck 12V outlet."],
        image: miniFridgeImage,
        imageAlt: "Compact mini fridge installed in a semi-truck sleeper cab compartment.",
      },
      {
        name: "Blackout Window Shades for Truck",
        priceRange: "$29 to $79",
        description: ["Sleep better during rest periods.", "Complete blackout for day sleeping."],
        image: blackoutShadesImage,
        imageAlt: "Truck sleeper cab window fitted with a blackout shade in a dark cabin.",
      },
    ],
  },
  {
    id: "category-5",
    title: "Power and Charging",
    products: [
      {
        name: "Heavy Duty Power Inverter",
        priceRange: "$39 to $129",
        description: ["Power your devices from truck battery.", "Charge laptops phones and more."],
        image: powerInverterImage,
        imageAlt: "Heavy-duty power inverter placed on a truck center console with red accent lighting.",
      },
      {
        name: "Truck Driver Phone Mount",
        priceRange: "$19 to $59",
        description: ["Hands free phone use while driving.", "Heavy duty for truck cab vibration."],
        image: phoneMountImage,
        imageAlt: "Truck phone mount attached to a dashboard vent holding a smartphone silhouette.",
      },
    ],
  },
];
const projects = [
  // =========================================================
  // AGRICULTURE
  // =========================================================

  {
    id: "agri-basic",
    name: "Plant Moisture Alert",
    category: "Agriculture",
    difficulty: "Basic",
    description:
      "A simple plant-care system that detects dry soil and gives an audible alert.",
    keywords: [
      "plant",
      "soil",
      "moisture",
      "agriculture",
      "garden",
      "dry",
      "alert",
    ],
    buildTime: "1–2 hours",
    wasteReduction: 80,
    components: [
      {
        componentId: "arduino-uno",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Main controller",
      },
      {
        componentId: "soil-moisture",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Measure soil moisture",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "Dry-soil alert",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 8,
        unit: "wires",
        purpose: "Circuit connections",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Prototype circuit",
      },
    ],
  },

  {
    id: "agri-intermediate",
    name: "Smart Plant Monitor",
    category: "Agriculture",
    difficulty: "Intermediate",
    description:
      "Monitor soil moisture and temperature with local alerts and a small display.",
    keywords: [
      "smart plant",
      "plant monitor",
      "soil moisture",
      "temperature",
      "agriculture",
      "garden",
      "sensor",
    ],
    buildTime: "3–5 hours",
    wasteReduction: 180,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Wi-Fi enabled controller",
      },
      {
        componentId: "soil-moisture",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Measure soil condition",
      },
      {
        componentId: "dht11",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Measure temperature and humidity",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Show sensor readings",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "Threshold alert",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Prototype circuit",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 20,
        unit: "wires",
        purpose: "Sensor and display wiring",
      },
    ],
  },

  {
    id: "agri-pro",
    name: "IoT Smart Garden System",
    category: "Agriculture",
    difficulty: "Pro",
    description:
      "A connected garden controller that monitors soil and environmental conditions and controls a small water pump.",
    keywords: [
      "smart garden",
      "iot agriculture",
      "irrigation",
      "water pump",
      "soil monitoring",
      "esp32",
      "automation",
    ],
    buildTime: "1–2 days",
    wasteReduction: 350,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "IoT controller",
      },
      {
        componentId: "soil-moisture",
        requiredQuantity: 2,
        unit: "sensors",
        purpose: "Monitor multiple soil zones",
      },
      {
        componentId: "dht11",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Environmental monitoring",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Local status display",
      },
      {
        componentId: "relay-1ch",
        requiredQuantity: 1,
        unit: "module",
        purpose: "Pump switching",
      },
      {
        componentId: "water-pump",
        requiredQuantity: 1,
        unit: "pump",
        purpose: "Automatic irrigation",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "System alert",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Prototype circuit",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 30,
        unit: "wires",
        purpose: "System wiring",
      },
    ],
  },

  // =========================================================
  // SECURITY
  // =========================================================

  {
    id: "security-basic",
    name: "Motion Alarm",
    category: "Security",
    difficulty: "Basic",
    description:
      "Detect nearby movement and trigger a local buzzer alarm.",
    keywords: [
      "security",
      "motion",
      "pir",
      "alarm",
      "intruder",
      "alert",
    ],
    buildTime: "1–2 hours",
    wasteReduction: 70,
    components: [
      {
        componentId: "arduino-uno",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Main controller",
      },
      {
        componentId: "pir",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Detect movement",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "Alarm output",
      },
      {
        componentId: "led",
        requiredQuantity: 1,
        unit: "LED",
        purpose: "Visual alert",
      },
      {
        componentId: "resistor",
        requiredQuantity: 1,
        unit: "resistor",
        purpose: "LED current limiting",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 10,
        unit: "wires",
        purpose: "Circuit connections",
      },
    ],
  },

  {
    id: "security-intermediate",
    name: "Smart Home Security System",
    category: "Security",
    difficulty: "Intermediate",
    description:
      "Combine motion and door sensing with a buzzer and visual status indicators.",
    keywords: [
      "home security",
      "door security",
      "pir",
      "motion",
      "door sensor",
      "alarm",
      "smart security",
    ],
    buildTime: "5–7 hours",
    wasteReduction: 200,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Connected security controller",
      },
      {
        componentId: "pir",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Motion detection",
      },
      {
        componentId: "magnetic-door-sensor",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Door-open detection",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "Alarm output",
      },
      {
        componentId: "led",
        requiredQuantity: 2,
        unit: "LEDs",
        purpose: "Security status indicators",
      },
      {
        componentId: "resistor",
        requiredQuantity: 2,
        unit: "resistors",
        purpose: "LED protection",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Security status",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 22,
        unit: "wires",
        purpose: "System wiring",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Prototype circuit",
      },
    ],
  },

  {
    id: "security-pro",
    name: "IoT Smart Security Hub",
    category: "Security",
    difficulty: "Pro",
    description:
      "A multi-sensor security hub with motion, door and RFID-based access monitoring.",
    keywords: [
      "iot security",
      "security hub",
      "access control",
      "rfid",
      "motion",
      "door",
      "esp32",
      "alarm",
    ],
    buildTime: "1–2 days",
    wasteReduction: 420,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Connected controller",
      },
      {
        componentId: "pir",
        requiredQuantity: 2,
        unit: "sensors",
        purpose: "Multi-zone motion detection",
      },
      {
        componentId: "magnetic-door-sensor",
        requiredQuantity: 2,
        unit: "sensors",
        purpose: "Door/window monitoring",
      },
      {
        componentId: "rfid",
        requiredQuantity: 1,
        unit: "module",
        purpose: "Access identification",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "Security alarm",
      },
      {
        componentId: "relay-1ch",
        requiredQuantity: 1,
        unit: "module",
        purpose: "External alarm control",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Security dashboard",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Prototype circuit",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 35,
        unit: "wires",
        purpose: "System wiring",
      },
    ],
  },

  // =========================================================
  // SMART PARKING
  // =========================================================

  {
    id: "parking-basic",
    name: "Parking Slot Indicator",
    category: "Parking",
    difficulty: "Basic",
    description:
      "Detect whether a parking slot is occupied and show its status using LEDs.",
    keywords: [
      "parking",
      "parking slot",
      "vehicle",
      "car detection",
      "ultrasonic",
      "indicator",
    ],
    buildTime: "2–3 hours",
    wasteReduction: 100,
    components: [
      {
        componentId: "arduino-uno",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Main controller",
      },
      {
        componentId: "hc-sr04",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Vehicle distance detection",
      },
      {
        componentId: "led",
        requiredQuantity: 2,
        unit: "LEDs",
        purpose: "Occupied/free indicators",
      },
      {
        componentId: "resistor",
        requiredQuantity: 2,
        unit: "resistors",
        purpose: "LED current limiting",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 14,
        unit: "wires",
        purpose: "Circuit wiring",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Prototype circuit",
      },
    ],
  },

  {
    id: "parking-intermediate",
    name: "Smart Parking System",
    category: "Parking",
    difficulty: "Intermediate",
    description:
      "Monitor multiple parking slots and display availability through a local interface.",
    keywords: [
      "smart parking",
      "parking system",
      "parking management",
      "vehicle detection",
      "slots",
      "display",
    ],
    buildTime: "4–6 hours",
    wasteReduction: 220,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Controller",
      },
      {
        componentId: "hc-sr04",
        requiredQuantity: 2,
        unit: "sensors",
        purpose: "Monitor multiple slots",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Availability display",
      },
      {
        componentId: "led",
        requiredQuantity: 4,
        unit: "LEDs",
        purpose: "Slot status",
      },
      {
        componentId: "resistor",
        requiredQuantity: 4,
        unit: "resistors",
        purpose: "LED protection",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "Parking event alert",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 24,
        unit: "wires",
        purpose: "System connections",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Prototype circuit",
      },
    ],
  },

  {
    id: "parking-pro",
    name: "IoT Smart Parking Network",
    category: "Parking",
    difficulty: "Pro",
    description:
      "A connected multi-slot parking platform that monitors occupancy and provides local status information.",
    keywords: [
      "iot parking",
      "smart parking network",
      "parking automation",
      "vehicle monitoring",
      "esp32",
      "ultrasonic",
    ],
    buildTime: "1–2 days",
    wasteReduction: 500,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 2,
        unit: "boards",
        purpose: "Connected parking controllers",
      },
      {
        componentId: "hc-sr04",
        requiredQuantity: 4,
        unit: "sensors",
        purpose: "Vehicle detection across slots",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 2,
        unit: "displays",
        purpose: "Local parking information",
      },
      {
        componentId: "led",
        requiredQuantity: 8,
        unit: "LEDs",
        purpose: "Slot availability indicators",
      },
      {
        componentId: "resistor",
        requiredQuantity: 8,
        unit: "resistors",
        purpose: "LED protection",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "Parking alerts",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 2,
        unit: "boards",
        purpose: "Prototype circuits",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 50,
        unit: "wires",
        purpose: "System wiring",
      },
    ],
  },

  // =========================================================
  // HOME AUTOMATION
  // =========================================================

  {
    id: "home-basic",
    name: "Automatic Night Lamp",
    category: "Home Automation",
    difficulty: "Basic",
    description:
      "Automatically turn an LED lamp on when ambient light becomes low.",
    keywords: [
      "home automation",
      "night lamp",
      "automatic light",
      "ldr",
      "light sensor",
      "lamp",
    ],
    buildTime: "1–2 hours",
    wasteReduction: 60,
    components: [
      {
        componentId: "arduino-uno",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Controller",
      },
      {
        componentId: "ldr",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Detect ambient light",
      },
      {
        componentId: "led",
        requiredQuantity: 1,
        unit: "LED",
        purpose: "Night light output",
      },
      {
        componentId: "resistor",
        requiredQuantity: 1,
        unit: "resistor",
        purpose: "LED protection",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 8,
        unit: "wires",
        purpose: "Circuit connections",
      },
    ],
  },

  {
    id: "home-intermediate",
    name: "Smart Home Controller",
    category: "Home Automation",
    difficulty: "Intermediate",
    description:
      "Use sensors and Wi-Fi to control a home appliance relay and display system status.",
    keywords: [
      "smart home",
      "home automation",
      "wifi",
      "relay",
      "motion",
      "light",
      "automation",
    ],
    buildTime: "5–8 hours",
    wasteReduction: 240,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Wi-Fi controller",
      },
      {
        componentId: "pir",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Presence detection",
      },
      {
        componentId: "ldr",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Ambient light detection",
      },
      {
        componentId: "relay-1ch",
        requiredQuantity: 1,
        unit: "module",
        purpose: "Appliance switching",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "System status",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 22,
        unit: "wires",
        purpose: "System wiring",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Prototype circuit",
      },
    ],
  },

  {
    id: "home-pro",
    name: "Complete IoT Home Automation",
    category: "Home Automation",
    difficulty: "Pro",
    description:
      "Build a connected home controller using light, motion, temperature and relay-based automation.",
    keywords: [
      "iot home",
      "home automation",
      "smart house",
      "connected home",
      "relay",
      "sensor automation",
      "esp32",
    ],
    buildTime: "2–3 days",
    wasteReduction: 600,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Main IoT controller",
      },
      {
        componentId: "pir",
        requiredQuantity: 2,
        unit: "sensors",
        purpose: "Room occupancy detection",
      },
      {
        componentId: "ldr",
        requiredQuantity: 2,
        unit: "sensors",
        purpose: "Light-level detection",
      },
      {
        componentId: "dht11",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Temperature and humidity",
      },
      {
        componentId: "relay-1ch",
        requiredQuantity: 2,
        unit: "modules",
        purpose: "Appliance control",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "System dashboard",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "System notification",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Prototype circuit",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 35,
        unit: "wires",
        purpose: "System wiring",
      },
    ],
  },

  // =========================================================
  // ROBOTICS
  // =========================================================

  {
    id: "robotics-basic",
    name: "Obstacle Detection Rover",
    category: "Robotics",
    difficulty: "Basic",
    description:
      "A beginner robotics prototype that detects obstacles with an ultrasonic sensor.",
    keywords: [
      "robot",
      "robotics",
      "rover",
      "obstacle",
      "ultrasonic",
      "motor",
      "arduino",
    ],
    buildTime: "2–4 hours",
    wasteReduction: 130,
    components: [
      {
        componentId: "arduino-uno",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Robot controller",
      },
      {
        componentId: "hc-sr04",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Obstacle detection",
      },
      {
        componentId: "dc-motor",
        requiredQuantity: 2,
        unit: "motors",
        purpose: "Robot movement",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 18,
        unit: "wires",
        purpose: "Robot wiring",
      },
    ],
  },

  {
    id: "robotics-intermediate",
    name: "Ultrasonic Scanning Robot",
    category: "Robotics",
    difficulty: "Intermediate",
    description:
      "A sensor-based robot that scans its surroundings using an ultrasonic sensor mounted on a servo.",
    keywords: [
      "robotics",
      "robot",
      "scanning",
      "ultrasonic",
      "servo",
      "obstacle detection",
    ],
    buildTime: "5–8 hours",
    wasteReduction: 240,
    components: [
      {
        componentId: "arduino-uno",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Robot controller",
      },
      {
        componentId: "hc-sr04",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Distance measurement",
      },
      {
        componentId: "servo",
        requiredQuantity: 1,
        unit: "servo",
        purpose: "Sensor scanning",
      },
      {
        componentId: "dc-motor",
        requiredQuantity: 2,
        unit: "motors",
        purpose: "Robot movement",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Distance display",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 25,
        unit: "wires",
        purpose: "Robot wiring",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Prototype circuit",
      },
    ],
  },

  {
    id: "robotics-pro",
    name: "Smart Autonomous Rover",
    category: "Robotics",
    difficulty: "Pro",
    description:
      "A multi-sensor rover that combines obstacle detection, environmental sensing and autonomous movement.",
    keywords: [
      "autonomous rover",
      "robotics",
      "smart robot",
      "robot",
      "esp32",
      "ultrasonic",
      "servo",
      "environment",
    ],
    buildTime: "1–2 days",
    wasteReduction: 430,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Robot controller",
      },
      {
        componentId: "hc-sr04",
        requiredQuantity: 2,
        unit: "sensors",
        purpose: "Front and side obstacle detection",
      },
      {
        componentId: "servo",
        requiredQuantity: 1,
        unit: "servo",
        purpose: "Scanning mechanism",
      },
      {
        componentId: "dc-motor",
        requiredQuantity: 2,
        unit: "motors",
        purpose: "Vehicle movement",
      },
      {
        componentId: "dht11",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Environmental sensing",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Robot status",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "Warning indicator",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 35,
        unit: "wires",
        purpose: "Robot wiring",
      },
    ],
  },

  // =========================================================
  // IoT
  // =========================================================

  {
    id: "iot-basic",
    name: "Connected Temperature Monitor",
    category: "IoT",
    difficulty: "Basic",
    description:
      "Measure temperature and humidity and display the readings locally.",
    keywords: [
      "iot",
      "temperature",
      "humidity",
      "monitor",
      "sensor",
      "dht11",
    ],
    buildTime: "1–2 hours",
    wasteReduction: 70,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Connected controller",
      },
      {
        componentId: "dht11",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Temperature and humidity",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Local readings",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 10,
        unit: "wires",
        purpose: "Connections",
      },
    ],
  },

  {
    id: "iot-intermediate",
    name: "Multi-Sensor IoT Monitor",
    category: "IoT",
    difficulty: "Intermediate",
    description:
      "Combine environmental and light sensors into one connected monitoring device.",
    keywords: [
      "iot",
      "multi sensor",
      "temperature",
      "humidity",
      "light",
      "monitoring",
      "esp32",
    ],
    buildTime: "4–6 hours",
    wasteReduction: 190,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "IoT controller",
      },
      {
        componentId: "dht11",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Temperature and humidity",
      },
      {
        componentId: "ldr",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Light measurement",
      },
      {
        componentId: "soil-moisture",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Moisture measurement",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Sensor dashboard",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Prototype circuit",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 22,
        unit: "wires",
        purpose: "Sensor wiring",
      },
    ],
  },

  {
    id: "iot-pro",
    name: "IoT Remote Monitoring Hub",
    category: "IoT",
    difficulty: "Pro",
    description:
      "A reusable IoT hub that combines environmental, security and actuator modules.",
    keywords: [
      "iot hub",
      "remote monitoring",
      "smart monitoring",
      "esp32",
      "sensors",
      "relay",
      "security",
    ],
    buildTime: "1–2 days",
    wasteReduction: 400,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "IoT controller",
      },
      {
        componentId: "dht22",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Accurate environmental sensing",
      },
      {
        componentId: "ldr",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Light monitoring",
      },
      {
        componentId: "pir",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Presence monitoring",
      },
      {
        componentId: "relay-1ch",
        requiredQuantity: 1,
        unit: "module",
        purpose: "Remote actuator control",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Local dashboard",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "Alert output",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 30,
        unit: "wires",
        purpose: "System wiring",
      },
    ],
  },

  // =========================================================
  // ENVIRONMENT
  // =========================================================

  {
    id: "environment-basic",
    name: "Room Climate Indicator",
    category: "Environment",
    difficulty: "Basic",
    description:
      "Monitor room temperature and humidity and show a basic warning when conditions change.",
    keywords: [
      "environment",
      "temperature",
      "humidity",
      "climate",
      "room monitoring",
    ],
    buildTime: "1–2 hours",
    wasteReduction: 80,
    components: [
      {
        componentId: "arduino-uno",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Controller",
      },
      {
        componentId: "dht11",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Environmental sensing",
      },
      {
        componentId: "led",
        requiredQuantity: 1,
        unit: "LED",
        purpose: "Status indicator",
      },
      {
        componentId: "resistor",
        requiredQuantity: 1,
        unit: "resistor",
        purpose: "LED protection",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 9,
        unit: "wires",
        purpose: "Circuit wiring",
      },
    ],
  },

  {
    id: "environment-intermediate",
    name: "Environmental Monitoring Station",
    category: "Environment",
    difficulty: "Intermediate",
    description:
      "Create a compact station for temperature, humidity and light-level monitoring.",
    keywords: [
      "environment monitoring",
      "weather station",
      "temperature",
      "humidity",
      "light",
      "monitoring station",
    ],
    buildTime: "4–6 hours",
    wasteReduction: 190,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Monitoring controller",
      },
      {
        componentId: "dht22",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Temperature and humidity",
      },
      {
        componentId: "ldr",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Ambient light measurement",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Environmental dashboard",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "Threshold alerts",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Prototype circuit",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 20,
        unit: "wires",
        purpose: "Sensor wiring",
      },
    ],
  },

  {
    id: "environment-pro",
    name: "Smart Environmental Watch Station",
    category: "Environment",
    difficulty: "Pro",
    description:
      "A connected environmental station combining multiple sensors, display and alerts for continuous monitoring.",
    keywords: [
      "smart environment",
      "environment station",
      "iot monitoring",
      "climate monitoring",
      "sensors",
      "esp32",
    ],
    buildTime: "1–2 days",
    wasteReduction: 380,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "IoT controller",
      },
      {
        componentId: "dht22",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Temperature and humidity",
      },
      {
        componentId: "ldr",
        requiredQuantity: 2,
        unit: "sensors",
        purpose: "Light monitoring",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Environmental dashboard",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "Environmental alert",
      },
      {
        componentId: "relay-1ch",
        requiredQuantity: 1,
        unit: "module",
        purpose: "External equipment control",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Prototype circuit",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 30,
        unit: "wires",
        purpose: "System wiring",
      },
    ],
  },

  // =========================================================
  // EDUCATION
  // =========================================================

  {
    id: "education-basic",
    name: "LED Learning Board",
    category: "Education",
    difficulty: "Basic",
    description:
      "A simple hands-on electronics project for learning LEDs, resistors and digital outputs.",
    keywords: [
      "education",
      "electronics",
      "learning",
      "led",
      "arduino",
      "beginner",
    ],
    buildTime: "30–60 minutes",
    wasteReduction: 50,
    components: [
      {
        componentId: "arduino-uno",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Learning controller",
      },
      {
        componentId: "led",
        requiredQuantity: 4,
        unit: "LEDs",
        purpose: "Output devices",
      },
      {
        componentId: "resistor",
        requiredQuantity: 4,
        unit: "resistors",
        purpose: "LED protection",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Learning circuit",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 12,
        unit: "wires",
        purpose: "Connections",
      },
    ],
  },

  {
    id: "education-intermediate",
    name: "Mini Electronics Trainer",
    category: "Education",
    difficulty: "Intermediate",
    description:
      "A reusable learning platform covering LEDs, sensors, buzzer and display concepts.",
    keywords: [
      "electronics trainer",
      "education",
      "learning platform",
      "arduino",
      "sensors",
      "display",
      "buzzer",
    ],
    buildTime: "3–5 hours",
    wasteReduction: 170,
    components: [
      {
        componentId: "arduino-uno",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Training controller",
      },
      {
        componentId: "ldr",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Analog sensor experiment",
      },
      {
        componentId: "dht11",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Digital sensor experiment",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Display experiment",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "Audio experiment",
      },
      {
        componentId: "led",
        requiredQuantity: 3,
        unit: "LEDs",
        purpose: "Output experiments",
      },
      {
        componentId: "resistor",
        requiredQuantity: 3,
        unit: "resistors",
        purpose: "LED protection",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Training platform",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 20,
        unit: "wires",
        purpose: "Experiment wiring",
      },
    ],
  },

  {
    id: "education-pro",
    name: "Reusable IoT Electronics Lab",
    category: "Education",
    difficulty: "Pro",
    description:
      "A modular electronics learning platform covering IoT, sensors, actuation and human interaction.",
    keywords: [
      "iot lab",
      "electronics lab",
      "education",
      "embedded systems",
      "sensors",
      "actuators",
      "robotics",
    ],
    buildTime: "1–2 days",
    wasteReduction: 360,
    components: [
      {
        componentId: "esp32",
        requiredQuantity: 1,
        unit: "board",
        purpose: "IoT learning controller",
      },
      {
        componentId: "dht11",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Environmental experiment",
      },
      {
        componentId: "hc-sr04",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Distance experiment",
      },
      {
        componentId: "pir",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Motion experiment",
      },
      {
        componentId: "ldr",
        requiredQuantity: 1,
        unit: "sensor",
        purpose: "Light experiment",
      },
      {
        componentId: "servo",
        requiredQuantity: 1,
        unit: "servo",
        purpose: "Actuator experiment",
      },
      {
        componentId: "buzzer",
        requiredQuantity: 1,
        unit: "piece",
        purpose: "Audio output",
      },
      {
        componentId: "oled-096",
        requiredQuantity: 1,
        unit: "display",
        purpose: "Learning dashboard",
      },
      {
        componentId: "breadboard",
        requiredQuantity: 1,
        unit: "board",
        purpose: "Modular experiments",
      },
      {
        componentId: "jumper-wires",
        requiredQuantity: 35,
        unit: "wires",
        purpose: "Experiment wiring",
      },
    ],
  },
];

export default projects;
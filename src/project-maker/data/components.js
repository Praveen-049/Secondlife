const components = [
  // =====================================================
  // MICROCONTROLLERS
  // =====================================================

  {
    id: "arduino-uno",
    name: "Arduino UNO",
    category: "Microcontroller",
    description:
      "Beginner-friendly microcontroller board for electronics and automation projects.",
    aliases: [
      "arduino",
      "arduino uno",
      "uno",
      "uno r3",
      "arduino uno r3",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  {
    id: "esp32",
    name: "ESP32",
    category: "Microcontroller",
    description:
      "Wi-Fi and Bluetooth enabled microcontroller for connected projects.",
    aliases: [
      "esp32",
      "esp32 devkit",
      "esp32 dev board",
      "esp wroom 32",
      "wroom 32",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  // =====================================================
  // SENSORS
  // =====================================================

  {
    id: "dht11",
    name: "DHT11",
    category: "Sensor",
    description:
      "Temperature and humidity sensor for basic environmental monitoring.",
    aliases: [
      "dht11",
      "dht 11",
      "temperature sensor",
      "humidity sensor",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  {
    id: "dht22",
    name: "DHT22",
    category: "Sensor",
    description:
      "Higher-accuracy temperature and humidity sensor.",
    aliases: [
      "dht22",
      "dht 22",
      "am2302",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  {
    id: "soil-moisture",
    name: "Soil Moisture Sensor",
    category: "Sensor",
    description:
      "Measures the moisture level of soil.",
    aliases: [
      "soil moisture",
      "soil moisture sensor",
      "soil sensor",
      "soil moisture module",
      "soil hygrometer",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  {
    id: "hc-sr04",
    name: "HC-SR04 Ultrasonic Sensor",
    category: "Sensor",
    description:
      "Measures distance using ultrasonic waves.",
    aliases: [
      "hc-sr04",
      "hc sr04",
      "ultrasonic sensor",
      "ultrasonic",
      "distance sensor",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  {
    id: "pir",
    name: "PIR Motion Sensor",
    category: "Sensor",
    description:
      "Detects movement of people or animals using infrared radiation.",
    aliases: [
      "pir",
      "pir sensor",
      "motion sensor",
      "pir motion sensor",
      "movement sensor",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  {
    id: "ldr",
    name: "LDR",
    category: "Sensor",
    description:
      "Light-dependent resistor used to detect changes in light intensity.",
    aliases: [
      "ldr",
      "light sensor",
      "light dependent resistor",
      "photoresistor",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  {
    id: "magnetic-door-sensor",
    name: "Magnetic Door Sensor",
    category: "Sensor",
    description:
      "Detects whether a door or window is open or closed.",
    aliases: [
      "magnetic door sensor",
      "door sensor",
      "reed switch",
      "magnetic switch",
      "reed sensor",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  // =====================================================
  // DISPLAYS
  // =====================================================

  {
    id: "oled-096",
    name: "0.96-inch OLED Display",
    category: "Display",
    description:
      "Compact 128×64 I2C OLED display for sensor and status information.",
    aliases: [
      "oled",
      "oled display",
      "0.96 oled",
      "0.96 inch oled",
      "ssd1306",
      "ssd1306 oled",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  {
    id: "lcd-16x2",
    name: "16×2 LCD Display",
    category: "Display",
    description:
      "Character display commonly used in Arduino-based projects.",
    aliases: [
      "lcd",
      "16x2 lcd",
      "16x2 display",
      "lcd display",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  // =====================================================
  // OUTPUT / INDICATORS
  // =====================================================

  {
    id: "buzzer",
    name: "Buzzer",
    category: "Output",
    description:
      "Produces an audible signal for alarms and notifications.",
    aliases: [
      "buzzer",
      "beeper",
      "piezo buzzer",
      "alarm buzzer",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  {
    id: "led",
    name: "LED",
    category: "Output",
    description:
      "Light-emitting diode used as a visual indicator.",
    aliases: [
      "led",
      "light emitting diode",
      "indicator led",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  // =====================================================
  // PASSIVE COMPONENTS
  // =====================================================

  {
    id: "resistor",
    name: "Resistor",
    category: "Passive",
    description:
      "Passive component used to limit current and set circuit values.",
    aliases: [
      "resistor",
      "resistance",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  {
    id: "capacitor",
    name: "Capacitor",
    category: "Passive",
    description:
      "Stores electrical charge and is commonly used for filtering and smoothing.",
    aliases: [
      "capacitor",
      "cap",
      "electrolytic capacitor",
      "ceramic capacitor",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  // =====================================================
  // CONTROL
  // =====================================================

  {
    id: "relay-1ch",
    name: "5V 1-Channel Relay Module",
    category: "Control",
    description:
      "Allows a microcontroller to switch an external electrical load.",
    aliases: [
      "relay",
      "relay module",
      "5v relay",
      "1 channel relay",
      "single channel relay",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  // =====================================================
  // ACTUATORS
  // =====================================================

  {
    id: "servo",
    name: "SG90 Servo Motor",
    category: "Actuator",
    description:
      "Small positional servo motor used for movement and automation.",
    aliases: [
      "servo",
      "servo motor",
      "sg90",
      "micro servo",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  {
    id: "dc-motor",
    name: "DC Motor",
    category: "Actuator",
    description:
      "Small DC motor for motion-based electronics and robotics projects.",
    aliases: [
      "dc motor",
      "motor",
      "small motor",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  {
    id: "water-pump",
    name: "Mini DC Water Pump",
    category: "Actuator",
    description:
      "Small DC pump for automatic plant watering and liquid transfer projects.",
    aliases: [
      "water pump",
      "mini water pump",
      "dc water pump",
      "mini dc pump",
      "pump",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  // =====================================================
  // COMMUNICATION
  // =====================================================

  {
    id: "rfid",
    name: "RFID RC522 Module",
    category: "Communication",
    description:
      "RFID reader module for contactless identification and access projects.",
    aliases: [
      "rfid",
      "rfid module",
      "rc522",
      "rfid rc522",
      "rfid reader",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  // =====================================================
  // PROTOTYPING / CONNECTION
  // =====================================================

  {
    id: "breadboard",
    name: "Solderless Breadboard",
    category: "Prototype",
    description:
      "Reusable board for temporary circuit assembly without soldering.",
    aliases: [
      "breadboard",
      "solderless breadboard",
      "prototype board",
    ],
    defaultUnit: "piece",
    purchaseUnit: "piece",
  },

  {
    id: "jumper-wires",
    name: "Jumper Wires",
    category: "Connection",
    description:
      "Reusable wires for connecting modules and components.",
    aliases: [
      "jumper wires",
      "jumper wire",
      "dupont wires",
      "dupont cable",
      "male male jumper",
      "male female jumper",
      "female female jumper",
    ],
    defaultUnit: "wire",
    purchaseUnit: "pack",
  },
];

export default components;
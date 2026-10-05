const products = [

  // =====================================================
  // ARDUINO UNO
  // =====================================================

  {
    id: "arduino-online-01",
    componentId: "arduino-uno",
    productName: "UNO R3 CH340 Compatible Board",
    seller: "Online Electronics Store",
    price: 297,
    stock: true,
    rating: 4.4,
    deliveryDays: 2,
    deliveryText: "2–3 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  {
    id: "arduino-local-01",
    componentId: "arduino-uno",
    productName: "UNO R3 Compatible Board",
    seller: "Kasturi Electrosales",
    price: 320,
    stock: true,
    rating: 4.2,
    deliveryDays: 0,
    deliveryText: "Same-day pickup",
    sellerType: "Local",
    latitude: 12.9916,
    longitude: 80.2206,
    packSize: 1,
    packUnit: "piece",
    sourceType: "demo",
  },

  // =====================================================
  // ESP32
  // =====================================================

  {
    id: "esp32-online-01",
    componentId: "esp32",
    productName: "ESP32 WROOM 32 Development Board",
    seller: "Online Electronics Store",
    price: 439,
    stock: true,
    rating: 4.5,
    deliveryDays: 2,
    deliveryText: "2–3 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  {
    id: "esp32-local-01",
    componentId: "esp32",
    productName: "ESP32 Development Board",
    seller: "Kasturi Electrosales",
    price: 465,
    stock: true,
    rating: 4.1,
    deliveryDays: 0,
    deliveryText: "Same-day pickup",
    sellerType: "Local",
    latitude: 12.9916,
    longitude: 80.2206,
    packSize: 1,
    packUnit: "piece",
    sourceType: "demo",
  },

  // =====================================================
  // DHT11
  // =====================================================

  {
    id: "dht11-online-01",
    componentId: "dht11",
    productName: "DHT11 Temperature & Humidity Sensor",
    seller: "Online Electronics Store",
    price: 45,
    stock: true,
    rating: 4.4,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  {
    id: "dht11-local-01",
    componentId: "dht11",
    productName: "DHT11 Sensor Module",
    seller: "Kasturi Electrosales",
    price: 55,
    stock: true,
    rating: 4.2,
    deliveryDays: 0,
    deliveryText: "Same-day pickup",
    sellerType: "Local",
    latitude: 12.9916,
    longitude: 80.2206,
    packSize: 1,
    packUnit: "piece",
    sourceType: "demo",
  },

  // =====================================================
  // SOIL MOISTURE SENSOR
  // =====================================================

  {
    id: "soil-online-01",
    componentId: "soil-moisture",
    productName: "Soil Moisture Sensor Module",
    seller: "Online Electronics Store",
    price: 39,
    stock: true,
    rating: 4.3,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  {
    id: "soil-local-01",
    componentId: "soil-moisture",
    productName: "Soil Moisture Sensor Module",
    seller: "Kasturi Electrosales",
    price: 55,
    stock: true,
    rating: 4.2,
    deliveryDays: 0,
    deliveryText: "Same-day pickup",
    sellerType: "Local",
    latitude: 12.9916,
    longitude: 80.2206,
    packSize: 1,
    packUnit: "piece",
    sourceType: "demo",
  },

  // =====================================================
  // HC-SR04
  // =====================================================

  {
    id: "ultrasonic-online-01",
    componentId: "hc-sr04",
    productName: "HC-SR04 Ultrasonic Sensor",
    seller: "Online Electronics Store",
    price: 75,
    stock: true,
    rating: 3.8,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  {
    id: "ultrasonic-local-01",
    componentId: "hc-sr04",
    productName: "HC-SR04 Ultrasonic Module",
    seller: "Kasturi Electrosales",
    price: 90,
    stock: true,
    rating: 4.1,
    deliveryDays: 0,
    deliveryText: "Same-day pickup",
    sellerType: "Local",
    latitude: 12.9916,
    longitude: 80.2206,
    packSize: 1,
    packUnit: "piece",
    sourceType: "demo",
  },

  // =====================================================
  // PIR
  // =====================================================

  {
    id: "pir-online-01",
    componentId: "pir",
    productName: "PIR Motion Sensor Module",
    seller: "Online Electronics Store",
    price: 65,
    stock: true,
    rating: 4.3,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  {
    id: "pir-local-01",
    componentId: "pir",
    productName: "PIR Motion Sensor",
    seller: "Kasturi Electrosales",
    price: 80,
    stock: true,
    rating: 4.1,
    deliveryDays: 0,
    deliveryText: "Same-day pickup",
    sellerType: "Local",
    latitude: 12.9916,
    longitude: 80.2206,
    packSize: 1,
    packUnit: "piece",
    sourceType: "demo",
  },

  // =====================================================
  // OLED
  // =====================================================

  {
    id: "oled-online-01",
    componentId: "oled-096",
    productName: "0.96-inch I2C OLED Display",
    seller: "Online Electronics Store",
    price: 162,
    stock: true,
    rating: 4.5,
    deliveryDays: 2,
    deliveryText: "2–3 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  {
    id: "oled-local-01",
    componentId: "oled-096",
    productName: "0.96-inch OLED Display",
    seller: "Kasturi Electrosales",
    price: 185,
    stock: true,
    rating: 4.2,
    deliveryDays: 0,
    deliveryText: "Same-day pickup",
    sellerType: "Local",
    latitude: 12.9916,
    longitude: 80.2206,
    packSize: 1,
    packUnit: "piece",
    sourceType: "demo",
  },

  // =====================================================
  // LCD
  // =====================================================

  {
    id: "lcd-online-01",
    componentId: "lcd-16x2",
    productName: "16×2 LCD Display",
    seller: "Online Electronics Store",
    price: 99,
    stock: true,
    rating: 4.2,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  // =====================================================
  // RELAY
  // =====================================================

  {
    id: "relay-online-01",
    componentId: "relay-1ch",
    productName: "5V 1-Channel Relay Module",
    seller: "Online Electronics Store",
    price: 49,
    stock: true,
    rating: 4.3,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  {
    id: "relay-local-01",
    componentId: "relay-1ch",
    productName: "5V Single Channel Relay Module",
    seller: "Kasturi Electrosales",
    price: 60,
    stock: true,
    rating: 4.1,
    deliveryDays: 0,
    deliveryText: "Same-day pickup",
    sellerType: "Local",
    latitude: 12.9916,
    longitude: 80.2206,
    packSize: 1,
    packUnit: "piece",
    sourceType: "demo",
  },

  // =====================================================
  // SERVO
  // =====================================================

  {
    id: "servo-online-01",
    componentId: "servo",
    productName: "SG90 Micro Servo Motor",
    seller: "Online Electronics Store",
    price: 110,
    stock: true,
    rating: 4.3,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  // =====================================================
  // DC MOTOR
  // =====================================================

  {
    id: "dc-motor-online-01",
    componentId: "dc-motor",
    productName: "Small DC Gear Motor",
    seller: "Online Electronics Store",
    price: 85,
    stock: true,
    rating: 4.1,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  // =====================================================
  // WATER PUMP
  // =====================================================

  {
    id: "pump-online-01",
    componentId: "water-pump",
    productName: "Mini DC Water Pump",
    seller: "Online Electronics Store",
    price: 150,
    stock: true,
    rating: 4.0,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  {
    id: "pump-local-01",
    componentId: "water-pump",
    productName: "Mini Water Pump",
    seller: "Kasturi Electrosales",
    price: 175,
    stock: true,
    rating: 4.0,
    deliveryDays: 0,
    deliveryText: "Same-day pickup",
    sellerType: "Local",
    latitude: 12.9916,
    longitude: 80.2206,
    packSize: 1,
    packUnit: "piece",
    sourceType: "demo",
  },

  // =====================================================
  // RFID
  // =====================================================

  {
    id: "rfid-online-01",
    componentId: "rfid",
    productName: "RC522 RFID Reader Module",
    seller: "Online Electronics Store",
    price: 99,
    stock: true,
    rating: 4.2,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  // =====================================================
  // MAGNETIC DOOR SENSOR
  // =====================================================

  {
    id: "door-sensor-online-01",
    componentId: "magnetic-door-sensor",
    productName: "Magnetic Door Reed Sensor",
    seller: "Online Electronics Store",
    price: 45,
    stock: true,
    rating: 4.1,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  // =====================================================
  // BUZZER
  // =====================================================

  {
    id: "buzzer-online-01",
    componentId: "buzzer",
    productName: "5V Active Buzzer",
    seller: "Online Electronics Store",
    price: 15,
    stock: true,
    rating: 4.2,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  // =====================================================
  // LED
  // =====================================================

  {
    id: "led-online-01",
    componentId: "led",
    productName: "5mm LED Assorted Pack",
    seller: "Online Electronics Store",
    price: 25,
    stock: true,
    rating: 4.2,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 10,
    packUnit: "pieces",
    sourceType: "prototype-reference",
  },

  // =====================================================
  // RESISTOR
  // =====================================================

  {
    id: "resistor-online-01",
    componentId: "resistor",
    productName: "220Ω Resistor Pack",
    seller: "Online Electronics Store",
    price: 20,
    stock: true,
    rating: 4.4,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 10,
    packUnit: "pieces",
    sourceType: "prototype-reference",
  },

  // =====================================================
  // JUMPER WIRES
  // =====================================================

  {
    id: "jumper-online-01",
    componentId: "jumper-wires",
    productName: "Male-to-Male Jumper Wires — 40 pcs",
    seller: "Online Electronics Store",
    price: 85,
    stock: true,
    rating: 4.2,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 40,
    packUnit: "wires",
    sourceType: "prototype-reference",
  },

  {
    id: "jumper-local-01",
    componentId: "jumper-wires",
    productName: "Jumper Wire Pack — 40 pcs",
    seller: "Kasturi Electrosales",
    price: 60,
    stock: true,
    rating: 4.1,
    deliveryDays: 0,
    deliveryText: "Same-day pickup",
    sellerType: "Local",
    latitude: 12.9916,
    longitude: 80.2206,
    packSize: 40,
    packUnit: "wires",
    sourceType: "demo",
  },

  // =====================================================
  // BREADBOARD
  // =====================================================

  {
    id: "breadboard-online-01",
    componentId: "breadboard",
    productName: "830 Point Solderless Breadboard",
    seller: "Online Electronics Store",
    price: 95,
    stock: true,
    rating: 4.3,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  // =====================================================
  // DHT22
  // =====================================================

  {
    id: "dht22-online-01",
    componentId: "dht22",
    productName: "DHT22 Temperature & Humidity Sensor",
    seller: "Online Electronics Store",
    price: 180,
    stock: true,
    rating: 4.3,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 1,
    packUnit: "piece",
    sourceType: "prototype-reference",
  },

  // =====================================================
  // CAPACITOR
  // =====================================================

  {
    id: "capacitor-online-01",
    componentId: "capacitor",
    productName: "Electrolytic Capacitor Assorted Pack",
    seller: "Online Electronics Store",
    price: 60,
    stock: true,
    rating: 4.1,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 10,
    packUnit: "pieces",
    sourceType: "prototype-reference",
  },

  // =====================================================
  // LDR
  // =====================================================

  {
    id: "ldr-online-01",
    componentId: "ldr",
    productName: "LDR Light Sensor Pack",
    seller: "Online Electronics Store",
    price: 30,
    stock: true,
    rating: 4.2,
    deliveryDays: 3,
    deliveryText: "3–4 days",
    sellerType: "Online",
    latitude: null,
    longitude: null,
    packSize: 5,
    packUnit: "pieces",
    sourceType: "prototype-reference",
  },

];

export default products;
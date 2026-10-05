import components from "../data/components";
import projects from "../data/projects";

/*
  =========================================================
  SECOND LIFE
  AI PROJECT UNDERSTANDING SERVICE
  =========================================================

  This is the local prototype AI layer.

  It converts a natural-language project abstract into
  structured information:

  - project intent
  - category
  - detected features
  - likely components
  - confidence
  - reasons

  IMPORTANT:

  This is a local rule/semantic engine for the prototype.
  It is NOT a remote LLM API.

  The architecture is intentionally designed so that a real
  AI/LLM can replace this service later without changing
  the rest of the Project Builder.
*/


// =========================================================
// TEXT NORMALIZATION
// =========================================================

function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


// =========================================================
// TOKENIZATION
// =========================================================

function tokenize(text = "") {
  return normalizeText(text)
    .split(" ")
    .filter(Boolean);
}


// =========================================================
// WORD / PHRASE MATCH
// =========================================================

function containsAny(
  text,
  phrases
) {
  return phrases.some(
    (phrase) =>
      text.includes(
        normalizeText(phrase)
      )
  );
}


// =========================================================
// CATEGORY INTENT DEFINITIONS
// =========================================================

const categoryIntents = [
  {
    category: "Agriculture",

    keywords: [
      "plant",
      "plants",
      "garden",
      "gardening",
      "farm",
      "farming",
      "agriculture",
      "crop",
      "crops",
      "irrigation",
      "watering",
      "water plant",
      "soil",
      "greenhouse",
      "smart farming",
    ],
  },

  {
    category: "Security",

    keywords: [
      "security",
      "alarm",
      "intruder",
      "intrusion",
      "burglar",
      "burglary",
      "door",
      "window",
      "access control",
      "rfid",
      "unauthorized",
      "motion detection",
      "surveillance",
    ],
  },

  {
    category: "Parking",

    keywords: [
      "parking",
      "parked",
      "vehicle",
      "vehicles",
      "car",
      "cars",
      "parking slot",
      "parking space",
      "slot detection",
      "vehicle detection",
    ],
  },

  {
    category: "Home Automation",

    keywords: [
      "home automation",
      "smart home",
      "home",
      "house",
      "room",
      "appliance",
      "appliances",
      "automatic light",
      "smart light",
      "lights",
      "fan control",
      "home control",
      "automation",
    ],
  },

  {
    category: "Robotics",

    keywords: [
      "robot",
      "robotics",
      "rover",
      "robot car",
      "autonomous",
      "obstacle avoidance",
      "obstacle detection",
      "moving robot",
      "mobile robot",
    ],
  },

  {
    category: "IoT",

    keywords: [
      "iot",
      "internet of things",
      "connected device",
      "connected system",
      "remote monitoring",
      "remote control",
      "wifi",
      "wi-fi",
      "cloud",
      "wireless monitoring",
    ],
  },

  {
    category: "Environment",

    keywords: [
      "environment",
      "environmental",
      "climate",
      "weather",
      "temperature monitoring",
      "humidity monitoring",
      "air monitoring",
      "environment monitoring",
    ],
  },

  {
    category: "Education",

    keywords: [
      "education",
      "learning",
      "learn",
      "teaching",
      "trainer",
      "electronics lab",
      "electronics learning",
      "student project",
      "demo",
      "experiment",
    ],
  },
];


// =========================================================
// FEATURE DEFINITIONS
// =========================================================

const featureIntents = [
  {
    id: "temperature",
    label: "Temperature sensing",

    keywords: [
      "temperature",
      "heat",
      "hot",
      "cold",
      "thermal",
    ],
  },

  {
    id: "humidity",
    label: "Humidity sensing",

    keywords: [
      "humidity",
      "humid",
      "moisture in air",
    ],
  },

  {
    id: "soil-moisture",
    label: "Soil moisture sensing",

    keywords: [
      "soil moisture",
      "soil moisture sensor",
      "dry soil",
      "wet soil",
      "soil condition",
      "soil humidity",
    ],
  },

  {
    id: "motion",
    label: "Motion detection",

    keywords: [
      "motion",
      "movement",
      "moving person",
      "presence",
      "intruder",
    ],
  },

  {
    id: "distance",
    label: "Distance / obstacle detection",

    keywords: [
      "distance",
      "obstacle",
      "obstacles",
      "ultrasonic",
      "range",
      "detect object",
    ],
  },

  {
    id: "light",
    label: "Light sensing",

    keywords: [
      "light sensor",
      "ambient light",
      "dark",
      "brightness",
      "light level",
      "day night",
    ],
  },

  {
    id: "display",
    label: "Visual display",

    keywords: [
      "display",
      "screen",
      "oled",
      "show readings",
      "show data",
      "visual output",
    ],
  },

  {
    id: "alarm",
    label: "Audio alert",

    keywords: [
      "alarm",
      "alert",
      "beep",
      "buzzer",
      "warning sound",
      "sound alert",
    ],
  },

  {
    id: "door",
    label: "Door / window monitoring",

    keywords: [
      "door",
      "window",
      "door open",
      "door closed",
      "entry",
      "entrance",
    ],
  },

  {
    id: "rfid",
    label: "RFID identification",

    keywords: [
      "rfid",
      "card reader",
      "access card",
      "tag",
    ],
  },

  {
    id: "relay",
    label: "Appliance / actuator switching",

    keywords: [
      "relay",
      "switch appliance",
      "switch motor",
      "turn on pump",
      "turn off pump",
      "control appliance",
      "switching",
    ],
  },

  {
    id: "pump",
    label: "Water pumping",

    keywords: [
      "water pump",
      "pump water",
      "irrigation pump",
      "automatic watering",
      "watering system",
    ],
  },

  {
    id: "servo",
    label: "Servo actuation",

    keywords: [
      "servo",
      "servo motor",
      "rotate sensor",
      "servo control",
    ],
  },

  {
    id: "motor",
    label: "Motor movement",

    keywords: [
      "motor",
      "motors",
      "wheel",
      "wheels",
      "move",
      "moving vehicle",
      "drive",
      "robot car",
    ],
  },

  {
    id: "wifi",
    label: "Wi-Fi connectivity",

    keywords: [
      "wifi",
      "wi-fi",
      "wireless",
      "internet",
      "online",
      "remote",
      "connected",
      "iot",
    ],
  },
];


// =========================================================
// COMPONENT INTELLIGENCE
// =========================================================

/*
  Each feature maps to one or more components.

  The component itself comes from components.js so we don't
  create component IDs that don't exist in the database.
*/

const featureComponentMap = {
  temperature: [
    "dht11",
  ],

  humidity: [
    "dht11",
  ],

  "soil-moisture": [
    "soil-moisture",
  ],

  motion: [
    "pir",
  ],

  distance: [
    "hc-sr04",
  ],

  light: [
    "ldr",
  ],

  display: [
    "oled-096",
  ],

  alarm: [
    "buzzer",
  ],

  door: [
    "magnetic-door-sensor",
  ],

  rfid: [
    "rfid",
  ],

  relay: [
    "relay-1ch",
  ],

  pump: [
    "water-pump",
  ],

  servo: [
    "servo",
  ],

  motor: [
    "dc-motor",
  ],

  wifi: [
    "esp32",
  ],
};


// =========================================================
// CONTROLLER INTELLIGENCE
// =========================================================

function inferController(
  text,
  category,
  features
) {
  /*
    Connected / Wi-Fi projects should use ESP32.
  */

  if (
    features.includes("wifi") ||
    containsAny(
      text,
      [
        "iot",
        "remote monitoring",
        "wireless",
        "wifi",
        "wi-fi",
        "connected",
      ]
    )
  ) {
    return "esp32";
  }


  /*
    Robotics and sensor projects in the current
    prototype generally use Arduino UNO unless
    Wi-Fi is explicitly needed.
  */

  if (
    category === "Robotics" ||
    category === "Education" ||
    category === "Parking" ||
    category === "Security" ||
    category === "Agriculture" ||
    category === "Home Automation" ||
    category === "Environment"
  ) {
    return "arduino-uno";
  }


  return "arduino-uno";
}


// =========================================================
// FIND COMPONENT
// =========================================================

function getComponent(
  componentId
) {
  return components.find(
    (component) =>
      component.id ===
      componentId
  );
}


// =========================================================
// COMPONENT CONFIDENCE
// =========================================================

function calculateComponentConfidence(
  featureScore,
  explicitMatch,
  categoryMatch
) {
  let score = 0;

  score +=
    featureScore * 55;

  if (explicitMatch) {
    score += 25;
  }

  if (categoryMatch) {
    score += 20;
  }

  return Math.min(
    99,
    Math.max(
      40,
      Math.round(score)
    )
  );
}


// =========================================================
// DETECT CATEGORY
// =========================================================

function detectCategory(
  text
) {
  const scoredCategories =
    categoryIntents.map(
      (intent) => {

        let score = 0;

        intent.keywords.forEach(
          (keyword) => {
            if (
              text.includes(
                normalizeText(
                  keyword
                )
              )
            ) {
              /*
                Longer phrases carry slightly
                more weight than single words.
              */

              score +=
                keyword.includes(
                  " "
                )
                  ? 3
                  : 1;
            }
          }
        );

        return {
          category:
            intent.category,
          score,
        };
      }
    );

  scoredCategories.sort(
    (a, b) =>
      b.score -
      a.score
  );

  const best =
    scoredCategories[0];

  if (
    !best ||
    best.score === 0
  ) {
    return {
      category: "IoT",
      confidence: 35,
      alternatives: [],
    };
  }


  const alternatives =
    scoredCategories
      .filter(
        (item) =>
          item.score > 0 &&
          item.category !==
            best.category
      )
      .slice(0, 2);


  const confidence =
    Math.min(
      98,
      45 +
        best.score * 9
    );


  return {
    category:
      best.category,

    confidence,

    alternatives:
      alternatives.map(
        (item) =>
          item.category
      ),
  };
}


// =========================================================
// DETECT FEATURES
// =========================================================

function detectFeatures(
  text
) {
  return featureIntents
    .map(
      (feature) => {

        let matches = 0;

        const matchedKeywords = [];

        feature.keywords.forEach(
          (keyword) => {

            if (
              text.includes(
                normalizeText(
                  keyword
                )
              )
            ) {
              matches += 1;

              matchedKeywords.push(
                keyword
              );
            }

          }
        );


        if (!matches) {
          return null;
        }


        const confidence =
          Math.min(
            99,
            50 +
              matches * 15
          );


        return {
          id:
            feature.id,

          label:
            feature.label,

          confidence,

          matchedKeywords,
        };
      }
    )
    .filter(Boolean);
}


// =========================================================
// EXPLICIT COMPONENT DETECTION
// =========================================================

function detectExplicitComponents(
  text
) {
  const detected = [];

  components.forEach(
    (component) => {

      const searchTerms = [
        component.name,

        component.id,

        ...(component.aliases || []),
      ];


      const matchingTerms =
        searchTerms.filter(
          (term) =>
            text.includes(
              normalizeText(
                term
              )
            )
        );


      if (
        matchingTerms.length
      ) {
        detected.push({
          componentId:
            component.id,

          confidence:
            Math.min(
              99,
              75 +
                matchingTerms.length *
                  7
            ),

          reason:
            `Explicitly mentioned: ${matchingTerms.join(
              ", "
            )}`,
        });
      }

    }
  );


  return detected;
}


// =========================================================
// ADD / MERGE COMPONENT
// =========================================================

function mergeComponent(
  map,
  componentId,
  confidence,
  reason
) {
  const component =
    getComponent(
      componentId
    );

  if (!component) {
    return;
  }


  if (
    !map.has(
      componentId
    )
  ) {
    map.set(
      componentId,
      {
        componentId,

        name:
          component.name,

        requiredQuantity: 1,

        unit:
          component.defaultUnit ||
          "unit",

        confidence,

        reason,
      }
    );

    return;
  }


  const existing =
    map.get(
      componentId
    );


  existing.confidence =
    Math.max(
      existing.confidence,
      confidence
    );


  existing.reason =
    `${existing.reason} ${reason}`;
}


// =========================================================
// INFER QUANTITY
// =========================================================

function inferQuantity(
  componentId,
  text
) {
  /*
    Basic natural-language quantity
    handling.

    Examples:

      "two sensors"
      "4 LEDs"
      "two motors"
  */

  const quantityWords = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
  };


  const component =
    getComponent(
      componentId
    );


  if (!component) {
    return 1;
  }


  const names = [
    component.name,
    component.id,
    ...(component.aliases || []),
  ];


  for (
    const name of names
  ) {
    const escaped =
      normalizeText(
        name
      ).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );


    const numericPattern =
      new RegExp(
        `(\\d+)\\s+(?:${escaped})`,
        "i"
      );


    const numericMatch =
      text.match(
        numericPattern
      );


    if (
      numericMatch
    ) {
      return Math.max(
        1,
        Number(
          numericMatch[1]
        )
      );
    }


    for (
      const [
        word,
        value,
      ] of Object.entries(
        quantityWords
      )
    ) {
      const wordPattern =
        new RegExp(
          `${word}\\s+(?:${escaped})`,
          "i"
        );


      if (
        wordPattern.test(
          text
        )
      ) {
        return value;
      }
    }
  }


  /*
    Project-specific quantity inference.
  */

  if (
    componentId ===
    "dc-motor"
  ) {
    return 2;
  }


  if (
    componentId ===
    "soil-moisture" &&
    text.includes(
      "multiple"
    )
  ) {
    return 2;
  }


  if (
    componentId ===
    "ldr" &&
    text.includes(
      "multiple"
    )
  ) {
    return 2;
  }


  return 1;
}


// =========================================================
// INFER COMPONENTS
// =========================================================

function inferComponents(
  text,
  category,
  features,
  explicitComponents
) {
  const componentMap =
    new Map();


  /*
    --------------------------------------------------------
    1. Explicitly mentioned components
    --------------------------------------------------------
  */

  explicitComponents.forEach(
    (component) => {

      mergeComponent(
        componentMap,
        component.componentId,
        component.confidence,
        component.reason
      );

    }
  );


  /*
    --------------------------------------------------------
    2. Feature-based components
    --------------------------------------------------------
  */

  features.forEach(
    (feature) => {

      const componentIds =
        featureComponentMap[
          feature.id
        ] || [];


      componentIds.forEach(
        (componentId) => {

          const confidence =
            Math.round(
              feature.confidence *
                0.82
            );


          mergeComponent(
            componentMap,
            componentId,
            confidence,
            `Inferred from ${feature.label.toLowerCase()}.`
          );

        }
      );

    }
  );


  /*
    --------------------------------------------------------
    3. Controller
    --------------------------------------------------------
  */

  const hasController =
    componentMap.has(
      "arduino-uno"
    ) ||
    componentMap.has(
      "esp32"
    );


  if (!hasController) {
    const controller =
      inferController(
        text,
        category,
        features.map(
          (feature) =>
            feature.id
        )
      );


    mergeComponent(
      componentMap,
      controller,
      82,
      `Suggested as the main controller for a ${category.toLowerCase()} project.`
    );
  }


  /*
    --------------------------------------------------------
    4. Breadboard / jumper wires
    --------------------------------------------------------
  */

  if (
    componentMap.size >= 2
  ) {
    mergeComponent(
      componentMap,
      "breadboard",
      78,
      "Suggested as a reusable prototype platform."
    );


    mergeComponent(
      componentMap,
      "jumper-wires",
      78,
      "Suggested for prototype circuit connections."
    );
  }


  /*
    --------------------------------------------------------
    5. Quantity refinement
    --------------------------------------------------------
  */

  const result =
    [...componentMap.values()]
      .map(
        (item) => {

          const requiredQuantity =
            inferQuantity(
              item.componentId,
              text
            );


          return {
            ...item,

            requiredQuantity,

            confidence:
              Math.min(
                99,
                item.confidence
              ),
          };
        }
      );


  /*
    Highest confidence first.
  */

  result.sort(
    (a, b) =>
      b.confidence -
      a.confidence
  );


  return result;
}


// =========================================================
// FIND RELATED PROJECTS
// =========================================================

function findRelatedProjects(
  text,
  category
) {
  const scored =
    projects.map(
      (project) => {

        const searchableText =
          normalizeText(
            [
              project.name,
              project.description,
              project.category,
              ...(project.keywords ||
                []),
            ].join(" ")
          );


        let score = 0;


        /*
          Category match.
        */

        if (
          project.category ===
          category
        ) {
          score += 35;
        }


        /*
          Keyword matching.
        */

        const tokens =
          tokenize(text);


        tokens.forEach(
          (token) => {

            if (
              token.length < 3
            ) {
              return;
            }

            if (
              searchableText.includes(
                token
              )
            ) {
              score += 3;
            }

          }
        );


        return {
          project,
          score,
        };
      }
    );


  return scored
    .filter(
      (item) =>
        item.score > 0
    )
    .sort(
      (a, b) =>
        b.score -
        a.score
    )
    .slice(0, 6);
}


// =========================================================
// BUILD FEATURE SUMMARY
// =========================================================

function buildFeatureSummary(
  features
) {
  return features.map(
    (feature) =>
      feature.label
  );
}


// =========================================================
// MAIN AI ANALYSIS
// =========================================================

export function analyzeProjectAbstract(
  abstract
) {
  const text =
    normalizeText(
      abstract
    );


  if (!text) {
    return {
      success: false,

      message:
        "Please describe the project you want to build.",

      category: null,

      categoryConfidence: 0,

      features: [],

      extractedComponents: [],

      relatedProjects: [],
    };
  }


  const categoryResult =
    detectCategory(
      text
    );


  const features =
    detectFeatures(
      text
    );


  const explicitComponents =
    detectExplicitComponents(
      text
    );


  const extractedComponents =
    inferComponents(
      text,
      categoryResult.category,
      features,
      explicitComponents
    );


  const relatedProjects =
    findRelatedProjects(
      text,
      categoryResult.category
    );


  return {
    success: true,

    originalAbstract:
      abstract,

    normalizedAbstract:
      text,

    category:
      categoryResult.category,

    categoryConfidence:
      categoryResult.confidence,

    alternativeCategories:
      categoryResult.alternatives,

    features:
      buildFeatureSummary(
        features
      ),

    featureDetails:
      features,

    extractedComponents,

    componentCount:
      extractedComponents.length,

    relatedProjects,

    analysisMessage:
      buildAnalysisMessage(
        categoryResult,
        features,
        extractedComponents
      ),
  };
}


// =========================================================
// ANALYSIS MESSAGE
// =========================================================

function buildAnalysisMessage(
  categoryResult,
  features,
  extractedComponents
) {
  const categoryText =
    categoryResult.category;


  const featureText =
    features.length
      ? features
          .slice(0, 4)
          .map(
            (feature) =>
              feature.label.toLowerCase()
          )
          .join(", ")
      : "the overall project intent";


  const componentText =
    extractedComponents.length
      ? extractedComponents
          .slice(0, 5)
          .map(
            (component) =>
              component.name
          )
          .join(", ")
      : "suitable electronic components";


  return `I understood this as a ${categoryText.toLowerCase()} project focused on ${featureText}. Likely requirements include ${componentText}.`;
}


// =========================================================
// CONVERT AI COMPONENTS TO PROJECT-LIKE REQUIREMENTS
// =========================================================

/*
  This lets the extracted AI requirements use the same
  structure as project.components.

  This is useful when we later display:
  
  AI detected requirements
  → owned
  → missing
  → purchase recommendations
*/

export function convertExtractedComponentsToRequirements(
  extractedComponents
) {
  return extractedComponents.map(
    (component) => ({

      componentId:
        component.componentId,

      requiredQuantity:
        component.requiredQuantity,

      unit:
        component.unit,

      purpose:
        component.reason,
    })
  );
}


// =========================================================
// GET COMPONENT CONFIDENCE LABEL
// =========================================================

export function getConfidenceLabel(
  confidence
) {
  if (
    confidence >= 90
  ) {
    return "HIGH";
  }

  if (
    confidence >= 75
  ) {
    return "GOOD";
  }

  if (
    confidence >= 60
  ) {
    return "MEDIUM";
  }

  return "LOW";
}


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default {
  analyzeProjectAbstract,

  convertExtractedComponentsToRequirements,

  getConfidenceLabel,
};
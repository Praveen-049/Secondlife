import projects from "../data/projects";

/*
  =========================================================
  SECOND LIFE
  PROJECT MATCHING ENGINE
  =========================================================

  This engine matches projects using three signals:

  1. Natural-language relevance
  2. AI-detected category/features
  3. AI-detected component requirements

  Inventory matching is handled separately.

  The result is still compatible with the existing App.jsx:
  
      getDifficultyRecommendations(abstract)

      getInventoryRecommendations(inventory)
*/


// =========================================================
// NORMALIZATION
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
    .filter(
      (token) => token.length >= 3
    );
}


// =========================================================
// UNIQUE ARRAY
// =========================================================

function unique(values) {
  return [
    ...new Set(
      values.filter(Boolean)
    ),
  ];
}


// =========================================================
// BASIC TEXT RELEVANCE
// =========================================================

function calculateTextRelevance(
  abstract,
  project
) {
  const text =
    normalizeText(
      abstract
    );

  if (!text) {
    return 0;
  }


  const projectText =
    normalizeText(
      [
        project.name,
        project.description,
        project.category,
        ...(project.keywords || []),
      ].join(" ")
    );


  const abstractTokens =
    tokenize(text);


  if (!abstractTokens.length) {
    return 0;
  }


  let matchedTokens = 0;

  for (
    const token of abstractTokens
  ) {
    if (
      projectText.includes(
        token
      )
    ) {
      matchedTokens += 1;
    }
  }


  const tokenScore =
    (
      matchedTokens /
      abstractTokens.length
    ) * 40;


  return Math.min(
    40,
    tokenScore
  );
}


// =========================================================
// CATEGORY SCORE
// =========================================================

function calculateCategoryScore(
  aiAnalysis,
  project
) {
  if (!aiAnalysis?.category) {
    return 0;
  }


  if (
    aiAnalysis.category ===
    project.category
  ) {
    /*
      AI category confidence can increase
      the category contribution.
    */

    const confidence =
      Number(
        aiAnalysis.categoryConfidence
      ) || 0;


    return (
      20 +
      Math.min(
        10,
        confidence / 10
      )
    );
  }


  /*
    Alternative categories get a small
    contribution.
  */

  if (
    aiAnalysis.alternativeCategories?.includes(
      project.category
    )
  ) {
    return 6;
  }


  return 0;
}


// =========================================================
// COMPONENT MATCH SCORE
// =========================================================

function calculateComponentScore(
  aiAnalysis,
  project
) {
  if (
    !aiAnalysis?.extractedComponents
      ?.length
  ) {
    return 0;
  }


  const detectedIds =
    aiAnalysis.extractedComponents.map(
      (item) =>
        item.componentId
    );


  const projectIds =
    project.components.map(
      (item) =>
        item.componentId
    );


  const intersection =
    detectedIds.filter(
      (id) =>
        projectIds.includes(
          id
        )
    );


  if (!intersection.length) {
    return 0;
  }


  const coverage =
    intersection.length /
    detectedIds.length;


  /*
    Component similarity is deliberately
    stronger than plain word matching.
  */

  return Math.min(
    25,
    coverage * 25
  );
}


// =========================================================
// FEATURE MATCH SCORE
// =========================================================

function getProjectComponentSet(
  project
) {
  return new Set(
    project.components.map(
      (item) =>
        item.componentId
    )
  );
}


function calculateFeatureScore(
  aiAnalysis,
  project
) {
  if (
    !aiAnalysis?.featureDetails
      ?.length
  ) {
    return 0;
  }


  const projectComponents =
    getProjectComponentSet(
      project
    );


  let matchedFeatures = 0;


  /*
    Map detected AI features to component IDs.
    This mirrors the AI service's feature map
    without creating a circular dependency.
  */

  const featureComponents = {
    temperature: [
      "dht11",
      "dht22",
    ],

    humidity: [
      "dht11",
      "dht22",
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


  aiAnalysis.featureDetails.forEach(
    (feature) => {

      const requiredComponents =
        featureComponents[
          feature.id
        ] || [];


      const matched =
        requiredComponents.some(
          (componentId) =>
            projectComponents.has(
              componentId
            )
        );


      if (matched) {
        matchedFeatures += 1;
      }
    }
  );


  if (
    matchedFeatures === 0
  ) {
    return 0;
  }


  const score =
    (
      matchedFeatures /
      aiAnalysis.featureDetails.length
    ) * 15;


  return Math.min(
    15,
    score
  );
}


// =========================================================
// RELEVANCE BREAKDOWN
// =========================================================

function scoreProject(
  abstract,
  project,
  aiAnalysis = null
) {
  const textScore =
    calculateTextRelevance(
      abstract,
      project
    );


  const categoryScore =
    calculateCategoryScore(
      aiAnalysis,
      project
    );


  const componentScore =
    calculateComponentScore(
      aiAnalysis,
      project
    );


  const featureScore =
    calculateFeatureScore(
      aiAnalysis,
      project
    );


  const totalScore =
    textScore +
    categoryScore +
    componentScore +
    featureScore;


  return {
    project,

    totalScore:
      Math.round(
        totalScore * 10
      ) / 10,

    textScore:
      Math.round(
        textScore * 10
      ) / 10,

    categoryScore:
      Math.round(
        categoryScore * 10
      ) / 10,

    componentScore:
      Math.round(
        componentScore * 10
      ) / 10,

    featureScore:
      Math.round(
        featureScore * 10
      ) / 10,
  };
}


// =========================================================
// SORT PROJECTS
// =========================================================

function sortScoredProjects(
  scoredProjects
) {
  return [...scoredProjects].sort(
    (a, b) => {

      /*
        Primary:
        overall AI/text relevance.
      */

      if (
        b.totalScore !==
        a.totalScore
      ) {
        return (
          b.totalScore -
          a.totalScore
        );
      }


      /*
        Category match.
      */

      if (
        b.categoryScore !==
        a.categoryScore
      ) {
        return (
          b.categoryScore -
          a.categoryScore
        );
      }


      /*
        Component match.
      */

      if (
        b.componentScore !==
        a.componentScore
      ) {
        return (
          b.componentScore -
          a.componentScore
        );
      }


      /*
        Intermediate is the default
        practical level when everything
        else is equal.
      */

      const difficultyOrder = {
        Basic: 1,
        Intermediate: 2,
        Pro: 3,
      };


      return (
        (
          difficultyOrder[
            a.project.difficulty
          ] || 99
        ) -
        (
          difficultyOrder[
            b.project.difficulty
          ] || 99
        )
      );
    }
  );
}


// =========================================================
// FIND PROJECTS FROM ABSTRACT
// =========================================================

export function findProjectsFromAbstract(
  abstract,
  aiAnalysis = null
) {
  if (
    !abstract?.trim() &&
    !aiAnalysis
  ) {
    return [];
  }


  const scored =
    projects.map(
      (project) =>
        scoreProject(
          abstract,
          project,
          aiAnalysis
        )
    );


  return sortScoredProjects(
    scored
  );
}


// =========================================================
// GET ONE PROJECT PER DIFFICULTY
// =========================================================

export function getDifficultyRecommendations(
  abstract,
  aiAnalysis = null
) {
  const scoredProjects =
    findProjectsFromAbstract(
      abstract,
      aiAnalysis
    );


  const levels = [
    "Basic",
    "Intermediate",
    "Pro",
  ];


  return levels.map(
    (difficulty) => {

      const match =
        scoredProjects.find(
          (item) =>
            item.project
              .difficulty ===
            difficulty
        );


      return (
        match?.project ||
        null
      );
    }
  );
}


// =========================================================
// INVENTORY NORMALIZATION
// =========================================================

function normalizeInventory(
  inventory
) {
  return inventory.map(
    (item) => ({
      componentId:
        item.componentId,

      quantity:
        Math.max(
          0,
          Number(
            item.quantity
          ) || 0
        ),
    })
  );
}


// =========================================================
// PROJECT INVENTORY SCORE
// =========================================================

function calculateInventoryScore(
  project,
  inventory
) {
  const normalizedInventory =
    normalizeInventory(
      inventory
    );


  const inventoryMap =
    new Map(
      normalizedInventory.map(
        (item) => [
          item.componentId,
          item.quantity,
        ]
      )
    );


  let requiredUnits = 0;

  let availableUnits = 0;

  let availableTypes = 0;


  project.components.forEach(
    (requirement) => {

      const required =
        Math.max(
          0,
          Number(
            requirement.requiredQuantity
          ) || 0
        );


      const owned =
        Math.max(
          0,
          inventoryMap.get(
            requirement.componentId
          ) || 0
        );


      requiredUnits +=
        required;


      availableUnits +=
        Math.min(
          owned,
          required
        );


      if (
        owned >= required
      ) {
        availableTypes += 1;
      }

    }
  );


  const totalTypes =
    project.components.length;


  const unitCoverage =
    requiredUnits === 0
      ? 0
      : (
          availableUnits /
          requiredUnits
        ) * 100;


  const typeCoverage =
    totalTypes === 0
      ? 0
      : (
          availableTypes /
          totalTypes
        ) * 100;


  /*
    Unit coverage matters more because
    quantity is important.

    70% units
    30% types
  */

  const reuseScore =
    (
      unitCoverage * 0.7
    ) +
    (
      typeCoverage * 0.3
    );


  return {
    project,

    requiredUnits,

    availableUnits,

    availableTypes,

    totalTypes,

    unitCoverage:
      Math.round(
        unitCoverage
      ),

    typeCoverage:
      Math.round(
        typeCoverage
      ),

    reuseScore:
      Math.round(
        reuseScore
      ),
  };
}


// =========================================================
// INVENTORY PROJECT MATCHING
// =========================================================

export function findProjectsFromInventory(
  inventory
) {
  if (
    !Array.isArray(
      inventory
    ) ||
    inventory.length === 0
  ) {
    return [];
  }


  const scored =
    projects.map(
      (project) =>
        calculateInventoryScore(
          project,
          inventory
        )
    );


  /*
    Strong reuse first.

    Higher feasibility/reuse score wins.
  */

  scored.sort(
    (a, b) => {

      if (
        b.reuseScore !==
        a.reuseScore
      ) {
        return (
          b.reuseScore -
          a.reuseScore
        );
      }


      /*
        When reuse is similar,
        prefer the project requiring
        fewer total units.

        This makes beginner builds
        more practical.
      */

      if (
        a.requiredUnits !==
        b.requiredUnits
      ) {
        return (
          a.requiredUnits -
          b.requiredUnits
        );
      }


      /*
        Final tie-breaker:
        Basic → Intermediate → Pro
      */

      const order = {
        Basic: 1,
        Intermediate: 2,
        Pro: 3,
      };


      return (
        (
          order[
            a.project.difficulty
          ] || 99
        ) -
        (
          order[
            b.project.difficulty
          ] || 99
        )
      );
    }
  );


  return scored;
}


// =========================================================
// ONE INVENTORY PROJECT PER LEVEL
// =========================================================

export function getInventoryRecommendations(
  inventory
) {
  const scoredProjects =
    findProjectsFromInventory(
      inventory
    );


  const levels = [
    "Basic",
    "Intermediate",
    "Pro",
  ];


  return levels.map(
    (difficulty) => {

      const match =
        scoredProjects.find(
          (item) =>
            item.project
              .difficulty ===
            difficulty
        );


      return (
        match?.project ||
        null
      );
    }
  );
}


// =========================================================
// GET TOP MATCHES
// =========================================================

export function getTopProjectMatches(
  abstract,
  aiAnalysis = null,
  limit = 6
) {
  return findProjectsFromAbstract(
    abstract,
    aiAnalysis
  )
    .slice(0, limit)
    .map(
      (item) => ({
        ...item.project,

        matchScore:
          Math.round(
            item.totalScore
          ),

        matchBreakdown: {
          text:
            item.textScore,

          category:
            item.categoryScore,

          components:
            item.componentScore,

          features:
            item.featureScore,
        },
      })
    );
}


// =========================================================
// GET INVENTORY MATCH DETAILS
// =========================================================

export function getInventoryMatchDetails(
  project,
  inventory
) {
  if (
    !project
  ) {
    return null;
  }


  const result =
    calculateInventoryScore(
      project,
      inventory
    );


  return {
    project:
      result.project,

    requiredUnits:
      result.requiredUnits,

    availableUnits:
      result.availableUnits,

    availableTypes:
      result.availableTypes,

    totalTypes:
      result.totalTypes,

    unitCoverage:
      result.unitCoverage,

    typeCoverage:
      result.typeCoverage,

    reuseScore:
      result.reuseScore,
  };
}


// =========================================================
// EXPORT
// =========================================================

export default {
  findProjectsFromAbstract,

  getDifficultyRecommendations,

  findProjectsFromInventory,

  getInventoryRecommendations,

  getTopProjectMatches,

  getInventoryMatchDetails,
};
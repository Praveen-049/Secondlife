import components from "../data/components";

/*
  =========================================================
  SECOND LIFE
  AI → INVENTORY MATCH ENGINE
  =========================================================

  Purpose:

  AI detects:
      ESP32 × 1
      Soil Moisture Sensor × 1
      Water Pump × 1

  User owns:
      ESP32 × 1
      Soil Moisture Sensor × 2

  Engine returns:

      ESP32
      → AVAILABLE

      Soil Moisture Sensor
      → AVAILABLE
      → 2 owned / 1 required

      Water Pump
      → MISSING

  This creates the actual "reuse first" intelligence.
*/


// =========================================================
// SAFE NUMBER
// =========================================================

function safeNumber(
  value,
  fallback = 0
) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}


// =========================================================
// COMPONENT LOOKUP
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
// INVENTORY MAP
// =========================================================

function createInventoryMap(
  inventory = []
) {
  return new Map(
    inventory.map(
      (item) => [
        item.componentId,
        Math.max(
          0,
          safeNumber(
            item.quantity
          )
        ),
      ]
    )
  );
}


// =========================================================
// MATCH ONE REQUIREMENT
// =========================================================

export function matchRequirementToInventory(
  requirement,
  inventory = []
) {
  const inventoryMap =
    createInventoryMap(
      inventory
    );


  const ownedQuantity =
    inventoryMap.get(
      requirement.componentId
    ) || 0;


  const requiredQuantity =
    Math.max(
      0,
      safeNumber(
        requirement.requiredQuantity,
        1
      )
    );


  const reusableQuantity =
    Math.min(
      ownedQuantity,
      requiredQuantity
    );


  const missingQuantity =
    Math.max(
      0,
      requiredQuantity -
        reusableQuantity
    );


  let status =
    "missing";

  if (
    missingQuantity === 0
  ) {
    status =
      "available";
  } else if (
    reusableQuantity > 0
  ) {
    status =
      "partial";
  }


  const component =
    getComponent(
      requirement.componentId
    );


  return {
    ...requirement,

    name:
      component?.name ||
      requirement.componentId,

    category:
      component?.category ||
      "Unknown",

    ownedQuantity,

    reusableQuantity,

    missingQuantity,

    status,

    reusePercentage:
      requiredQuantity === 0
        ? 100
        : Math.round(
            (
              reusableQuantity /
              requiredQuantity
            ) *
              100
          ),
  };
}


// =========================================================
// MATCH ALL AI REQUIREMENTS
// =========================================================

export function matchAIRequirementsToInventory(
  extractedComponents = [],
  inventory = []
) {
  if (
    !Array.isArray(
      extractedComponents
    )
  ) {
    return [];
  }


  return extractedComponents.map(
    (requirement) =>
      matchRequirementToInventory(
        requirement,
        inventory
      )
  );
}


// =========================================================
// SUMMARY
// =========================================================

export function getAIInventorySummary(
  extractedComponents = [],
  inventory = []
) {
  const matches =
    matchAIRequirementsToInventory(
      extractedComponents,
      inventory
    );


  let requiredUnits = 0;

  let reusableUnits = 0;

  let missingUnits = 0;

  let availableTypes = 0;

  let partialTypes = 0;

  let missingTypes = 0;


  matches.forEach(
    (item) => {

      requiredUnits +=
        item.requiredQuantity;

      reusableUnits +=
        item.reusableQuantity;

      missingUnits +=
        item.missingQuantity;


      if (
        item.status ===
        "available"
      ) {
        availableTypes += 1;
      }

      if (
        item.status ===
        "partial"
      ) {
        partialTypes += 1;
      }

      if (
        item.status ===
        "missing"
      ) {
        missingTypes += 1;
      }

    }
  );


  const reusePercentage =
    requiredUnits === 0
      ? 0
      : Math.round(
          (
            reusableUnits /
            requiredUnits
          ) *
            100
        );


  return {
    matches,

    requiredUnits,

    reusableUnits,

    missingUnits,

    availableTypes,

    partialTypes,

    missingTypes,

    totalTypes:
      matches.length,

    reusePercentage,
  };
}


// =========================================================
// FIND ONLY MISSING AI REQUIREMENTS
// =========================================================

export function getMissingAIRequirements(
  extractedComponents = [],
  inventory = []
) {
  const matches =
    matchAIRequirementsToInventory(
      extractedComponents,
      inventory
    );


  return matches.filter(
    (item) =>
      item.missingQuantity > 0
  );
}


// =========================================================
// FIND FULLY REUSABLE COMPONENTS
// =========================================================

export function getReusableAIRequirements(
  extractedComponents = [],
  inventory = []
) {
  const matches =
    matchAIRequirementsToInventory(
      extractedComponents,
      inventory
    );


  return matches.filter(
    (item) =>
      item.status ===
      "available"
  );
}


// =========================================================
// FIND PARTIAL COMPONENTS
// =========================================================

export function getPartialAIRequirements(
  extractedComponents = [],
  inventory = []
) {
  const matches =
    matchAIRequirementsToInventory(
      extractedComponents,
      inventory
    );


  return matches.filter(
    (item) =>
      item.status ===
      "partial"
  );
}


// =========================================================
// REUSE PRIORITY SCORE
// =========================================================

/*
  This score can later be used by the project
  ranking engine.

  More reusable components = higher score.
*/

export function calculateAIReuseScore(
  extractedComponents = [],
  inventory = []
) {
  const summary =
    getAIInventorySummary(
      extractedComponents,
      inventory
    );


  if (
    summary.totalTypes === 0
  ) {
    return 0;
  }


  const unitScore =
    summary.reusePercentage *
    0.7;


  const typeScore =
    (
      summary.availableTypes /
      summary.totalTypes
    ) *
    100 *
    0.3;


  return Math.round(
    unitScore +
    typeScore
  );
}


// =========================================================
// BUILD PURCHASE PLAN
// =========================================================

/*
  This does NOT calculate prices.

  The budget engine handles prices.

  This function only determines:

      What can be reused?
      What still needs to be sourced?
*/

export function buildAIPurchasePlan(
  extractedComponents = [],
  inventory = []
) {
  const missing =
    getMissingAIRequirements(
      extractedComponents,
      inventory
    );


  return missing.map(
    (item) => ({
      componentId:
        item.componentId,

      componentName:
        item.name,

      requiredQuantity:
        item.requiredQuantity,

      ownedQuantity:
        item.ownedQuantity,

      reusableQuantity:
        item.reusableQuantity,

      missingQuantity:
        item.missingQuantity,

      unit:
        item.unit,

      purpose:
        item.reason,
    })
  );
}


// =========================================================
// BUILD REUSE REPORT
// =========================================================

export function buildAIReuseReport(
  extractedComponents = [],
  inventory = []
) {
  const summary =
    getAIInventorySummary(
      extractedComponents,
      inventory
    );


  let message;


  if (
    summary.totalTypes === 0
  ) {
    message =
      "No component requirements were detected yet.";
  } else if (
    summary.missingUnits === 0
  ) {
    message =
      "Excellent. Your inventory already covers every detected requirement.";
  } else if (
    summary.reusableUnits > 0
  ) {
    message =
      `You can reuse ${summary.reusableUnits} of ${summary.requiredUnits} required units and only source ${summary.missingUnits} more.`;
  } else {
    message =
      "Your current inventory does not cover the detected requirements, so the required components will need to be sourced.";
  }


  return {
    ...summary,

    reuseScore:
      calculateAIReuseScore(
        extractedComponents,
        inventory
      ),

    message,

    purchasePlan:
      buildAIPurchasePlan(
        extractedComponents,
        inventory
      ),
  };
}


// =========================================================
// EXPORT
// =========================================================

export default {
  matchRequirementToInventory,

  matchAIRequirementsToInventory,

  getAIInventorySummary,

  getMissingAIRequirements,

  getReusableAIRequirements,

  getPartialAIRequirements,

  calculateAIReuseScore,

  buildAIPurchasePlan,

  buildAIReuseReport,
};
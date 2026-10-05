import products from "../data/products";
import components from "../data/components";

/*
  =========================================================
  SECOND LIFE
  BUDGET + REUSE ENGINE
  =========================================================

  Core principle:

  REQUIRED QUANTITY
        ↓
  USER OWNED QUANTITY
        ↓
  REUSABLE QUANTITY
        ↓
  MISSING QUANTITY
        ↓
  PURCHASE PACKS
        ↓
  ADDITIONAL COST
        ↓
  MONEY SAVED BY REUSE
*/


// =========================================================
// HELPERS
// =========================================================

function safeNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}


// =========================================================
// COMPONENT LOOKUP
// =========================================================

function getComponent(componentId) {
  return components.find(
    (component) =>
      component.id === componentId
  );
}


// =========================================================
// PRODUCT LOOKUP
// =========================================================

function getProductsForComponent(componentId) {
  return products.filter(
    (product) =>
      product.componentId === componentId &&
      product.stock === true
  );
}


// =========================================================
// SELECT DEFAULT PRODUCT
// =========================================================

function selectBestProduct(componentProducts) {
  if (!componentProducts.length) {
    return null;
  }

  return [...componentProducts].sort(
    (a, b) => {

      const aLocal =
        a.latitude !== null &&
        a.latitude !== undefined &&
        a.longitude !== null &&
        a.longitude !== undefined;

      const bLocal =
        b.latitude !== null &&
        b.latitude !== undefined &&
        b.longitude !== null &&
        b.longitude !== undefined;


      // Local availability first
      if (aLocal !== bLocal) {
        return bLocal ? 1 : -1;
      }


      // Faster delivery
      const aDelivery =
        safeNumber(
          a.deliveryDays,
          999
        );

      const bDelivery =
        safeNumber(
          b.deliveryDays,
          999
        );

      if (aDelivery !== bDelivery) {
        return (
          aDelivery -
          bDelivery
        );
      }


      // Better rating
      const aRating =
        safeNumber(a.rating);

      const bRating =
        safeNumber(b.rating);

      if (aRating !== bRating) {
        return (
          bRating -
          aRating
        );
      }


      // Lower price
      return (
        safeNumber(a.price) -
        safeNumber(b.price)
      );
    }
  )[0];
}


// =========================================================
// PURCHASE CALCULATOR
// =========================================================

/*
  Example:

  Need 12 wires
  Product pack = 40 wires
  Price = ₹85

  Result:

  packs = 1
  quantity purchased = 40
  cost = ₹85

  NOT:

  12 / 40 × ₹85
*/

function calculatePurchase(
  product,
  requiredQuantity
) {
  const required =
    Math.max(
      0,
      safeNumber(
        requiredQuantity
      )
    );


  if (!product || required === 0) {
    return {
      packs: 0,
      quantityPurchased: 0,
      excessQuantity: 0,
      cost: 0,
      unitEffectiveCost: 0,
    };
  }


  const packSize =
    Math.max(
      1,
      safeNumber(
        product.packSize,
        1
      )
    );


  const packs =
    Math.ceil(
      required /
      packSize
    );


  const quantityPurchased =
    packs *
    packSize;


  const excessQuantity =
    Math.max(
      0,
      quantityPurchased -
        required
    );


  const price =
    Math.max(
      0,
      safeNumber(
        product.price
      )
    );


  const cost =
    packs * price;


  const unitEffectiveCost =
    quantityPurchased === 0
      ? 0
      : cost /
        quantityPurchased;


  return {
    packs,

    quantityPurchased,

    excessQuantity,

    cost:
      Math.round(
        cost * 100
      ) / 100,

    unitEffectiveCost:
      Math.round(
        unitEffectiveCost *
          100
      ) / 100,
  };
}


// =========================================================
// OWNED QUANTITY
// =========================================================

function getOwnedQuantity(
  inventory,
  componentId
) {
  const item =
    inventory.find(
      (inventoryItem) =>
        inventoryItem.componentId ===
        componentId
    );


  if (!item) {
    return 0;
  }


  return Math.max(
    0,
    safeNumber(
      item.quantity
    )
  );
}


// =========================================================
// CALCULATE PROJECT BUDGET
// =========================================================

export function calculateProjectBudget(
  project,
  inventory = []
) {
  if (
    !project ||
    !Array.isArray(
      project.components
    )
  ) {
    return {
      totalNewBuildCost: 0,
      additionalCost: 0,

      savingsAmount: 0,
      savingsPercentage: 0,

      requiredUnits: 0,
      availableUnits: 0,
      missingUnits: 0,

      feasibility: 0,

      availableTypes: 0,
      totalTypes: 0,

      details: [],
    };
  }


  let totalNewBuildCost = 0;

  let additionalCost = 0;

  let requiredUnits = 0;

  let availableUnits = 0;

  let missingUnits = 0;

  let availableTypes = 0;


  const details =
    project.components.map(
      (requirement) => {

        // ---------------------------------------------------
        // REQUIREMENT
        // ---------------------------------------------------

        const requiredQuantity =
          Math.max(
            0,
            safeNumber(
              requirement.requiredQuantity
            )
          );


        requiredUnits +=
          requiredQuantity;


        // ---------------------------------------------------
        // INVENTORY
        // ---------------------------------------------------

        const ownedQuantity =
          getOwnedQuantity(
            inventory,
            requirement.componentId
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


        availableUnits +=
          reusableQuantity;


        missingUnits +=
          missingQuantity;


        // ---------------------------------------------------
        // TYPE STATUS
        // ---------------------------------------------------

        if (
          reusableQuantity >=
          requiredQuantity
        ) {
          availableTypes += 1;
        }


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


        // ---------------------------------------------------
        // COMPONENT
        // ---------------------------------------------------

        const component =
          getComponent(
            requirement.componentId
          );


        // ---------------------------------------------------
        // PRODUCT
        // ---------------------------------------------------

        const productsForComponent =
          getProductsForComponent(
            requirement.componentId
          );


        const bestProduct =
          selectBestProduct(
            productsForComponent
          );


        // ---------------------------------------------------
        // FULL NEW-BUILD PURCHASE
        // ---------------------------------------------------

        const newBuildPurchase =
          calculatePurchase(
            bestProduct,
            requiredQuantity
          );


        // ---------------------------------------------------
        // ADDITIONAL PURCHASE
        // ---------------------------------------------------

        const additionalPurchase =
          calculatePurchase(
            bestProduct,
            missingQuantity
          );


        totalNewBuildCost +=
          newBuildPurchase.cost;


        additionalCost +=
          additionalPurchase.cost;


        // ---------------------------------------------------
        // PACK INFO
        // ---------------------------------------------------

        const packSize =
          bestProduct
            ? Math.max(
                1,
                safeNumber(
                  bestProduct.packSize,
                  1
                )
              )
            : 1;


        const packUnit =
          bestProduct?.packUnit ||
          component?.purchaseUnit ||
          requirement.unit;


        // ---------------------------------------------------
        // COMPONENT SAVINGS
        // ---------------------------------------------------

        /*
          This is the cost avoided because
          the user already owns the reusable
          quantity.

          We don't pretend the user can buy
          fractional packs.

          We calculate the proportional
          reference value of the reused
          quantity.
        */

        const effectiveReferencePrice =
          bestProduct
            ? safeNumber(
                bestProduct.price
              ) /
              packSize
            : 0;


        const reuseValue =
          reusableQuantity *
          effectiveReferencePrice;


        return {
          // -----------------------------------------------
          // ID
          // -----------------------------------------------

          componentId:
            requirement.componentId,

          name:
            component?.name ||
            requirement.componentId,

          purpose:
            requirement.purpose ||
            "",


          // -----------------------------------------------
          // REQUIREMENT
          // -----------------------------------------------

          requiredQuantity,

          unit:
            requirement.unit ||
            component?.defaultUnit ||
            "unit",


          // -----------------------------------------------
          // INVENTORY
          // -----------------------------------------------

          ownedQuantity,

          reusableQuantity,

          missingQuantity,


          // -----------------------------------------------
          // STATUS
          // -----------------------------------------------

          status,


          // -----------------------------------------------
          // PRODUCT
          // -----------------------------------------------

          product:
            bestProduct,

          productName:
            bestProduct?.productName ||
            null,

          seller:
            bestProduct?.seller ||
            null,

          productPrice:
            bestProduct
              ? safeNumber(
                  bestProduct.price
                )
              : 0,

          packSize,

          packUnit,


          // -----------------------------------------------
          // NEW BUILD
          // -----------------------------------------------

          newBuildPacks:
            newBuildPurchase.packs,

          newBuildPurchasedQuantity:
            newBuildPurchase.quantityPurchased,

          newBuildExcessQuantity:
            newBuildPurchase.excessQuantity,

          newBuildPurchaseCost:
            newBuildPurchase.cost,


          // -----------------------------------------------
          // ADDITIONAL
          // -----------------------------------------------

          additionalPacks:
            additionalPurchase.packs,

          additionalPurchasedQuantity:
            additionalPurchase.quantityPurchased,

          additionalExcessQuantity:
            additionalPurchase.excessQuantity,

          additionalPurchaseCost:
            additionalPurchase.cost,


          // -----------------------------------------------
          // REUSE VALUE
          // -----------------------------------------------

          estimatedReuseValue:
            Math.round(
              reuseValue *
                100
            ) / 100,
        };
      }
    );


  // =========================================================
  // FEASIBILITY
  // =========================================================

  const feasibility =
    requiredUnits === 0
      ? 0
      : Math.round(
          (
            availableUnits /
            requiredUnits
          ) *
            100
        );


  // =========================================================
  // SAVINGS
  // =========================================================

  const savingsAmount =
    Math.max(
      0,
      totalNewBuildCost -
        additionalCost
    );


  const savingsPercentage =
    totalNewBuildCost === 0
      ? 0
      : Math.round(
          (
            savingsAmount /
            totalNewBuildCost
          ) *
            100
        );


  // =========================================================
  // ROUND TOTALS
  // =========================================================

  const roundedNewBuildCost =
    Math.round(
      totalNewBuildCost
    );


  const roundedAdditionalCost =
    Math.round(
      additionalCost
    );


  const roundedSavings =
    Math.max(
      0,
      roundedNewBuildCost -
        roundedAdditionalCost
    );


  // =========================================================
  // RETURN
  // =========================================================

  return {
    totalNewBuildCost:
      roundedNewBuildCost,

    additionalCost:
      roundedAdditionalCost,


    // NEW
    savingsAmount:
      roundedSavings,

    savingsPercentage:


      roundedNewBuildCost ===
      0
        ? 0
        : Math.round(
            (
              roundedSavings /
              roundedNewBuildCost
            ) *
              100
          ),


    requiredUnits,

    availableUnits,

    missingUnits,

    feasibility:
      Math.min(
        100,
        feasibility
      ),

    availableTypes,

    totalTypes:
      project.components.length,

    details,
  };
}


// =========================================================
// PURCHASE SUMMARY
// =========================================================

export function getProjectPurchaseSummary(
  project,
  inventory = []
) {
  const budget =
    calculateProjectBudget(
      project,
      inventory
    );


  const purchaseItems =
    budget.details
      .filter(
        (item) =>
          item.missingQuantity >
          0
      )
      .map(
        (item) => ({

          componentId:
            item.componentId,

          componentName:
            item.name,

          requiredQuantity:
            item.requiredQuantity,

          ownedQuantity:
            item.ownedQuantity,

          missingQuantity:
            item.missingQuantity,

          unit:
            item.unit,

          productName:
            item.productName,

          seller:
            item.seller,

          productPrice:
            item.productPrice,

          packSize:
            item.packSize,

          packUnit:
            item.packUnit,

          packsToBuy:
            item.additionalPacks,

          totalQuantityPurchased:
            item.additionalPurchasedQuantity,

          excessQuantity:
            item.additionalExcessQuantity,

          cost:
            item.additionalPurchaseCost,
        })
      );


  return {
    purchaseItems,

    totalAdditionalCost:
      budget.additionalCost,

    totalNewBuildCost:
      budget.totalNewBuildCost,

    savingsAmount:
      budget.savingsAmount,

    savingsPercentage:
      budget.savingsPercentage,

    itemCount:
      purchaseItems.length,
  };
}


// =========================================================
// FORMAT MONEY
// =========================================================

export function formatBudget(
  amount
) {
  const value =
    safeNumber(
      amount
    );

  return `₹${value.toLocaleString(
    "en-IN"
  )}`;
}


// =========================================================
// FORMAT PURCHASE TEXT
// =========================================================

export function formatPurchaseDescription(
  detail
) {
  if (
    !detail ||
    detail.missingQuantity <= 0
  ) {
    return "Already covered by your inventory.";
  }


  if (
    !detail.product
  ) {
    return `Need ${detail.missingQuantity} ${detail.unit}.`;
  }


  return [
    `Need ${detail.missingQuantity} ${detail.unit}.`,
    `Buy ${detail.additionalPacks} ${detail.packUnit}.`,
    `Purchase quantity: ${detail.additionalPurchasedQuantity} ${detail.unit}.`,
    `Cost: ₹${detail.additionalPurchaseCost}.`,
  ].join(" ");
}


// =========================================================
// EXPORT
// =========================================================

export default {
  calculateProjectBudget,

  getProjectPurchaseSummary,

  formatBudget,

  formatPurchaseDescription,
};
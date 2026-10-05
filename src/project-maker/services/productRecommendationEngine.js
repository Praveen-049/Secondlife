import products from "../data/products";
import {
  calculateDistance,
  formatDistance,
} from "./locationService";

/*
  =========================================================
  SECOND LIFE
  PRODUCT RECOMMENDATION ENGINE
  =========================================================

  Ranking priority:

  1. In-stock
  2. Nearby local availability
  3. Fast delivery
  4. Good rating
  5. Reasonable price

  Important:
  Products are prototype/mock reference data.
  They are NOT live marketplace results.
*/


/* =========================================================
   DISTANCE SCORE
========================================================= */

function getDistanceScore(distance) {
  if (distance === null) {
    return 4;
  }

  if (distance <= 1) {
    return 35;
  }

  if (distance <= 3) {
    return 31;
  }

  if (distance <= 5) {
    return 27;
  }

  if (distance <= 10) {
    return 21;
  }

  if (distance <= 20) {
    return 14;
  }

  if (distance <= 40) {
    return 7;
  }

  return 2;
}


/* =========================================================
   DELIVERY SCORE
========================================================= */

function getDeliveryScore(deliveryDays) {
  if (
    deliveryDays === null ||
    deliveryDays === undefined
  ) {
    return 2;
  }

  if (deliveryDays <= 0) {
    return 30;
  }

  if (deliveryDays <= 1) {
    return 27;
  }

  if (deliveryDays <= 2) {
    return 22;
  }

  if (deliveryDays <= 3) {
    return 17;
  }

  if (deliveryDays <= 5) {
    return 11;
  }

  if (deliveryDays <= 7) {
    return 6;
  }

  return 2;
}


/* =========================================================
   RATING SCORE
========================================================= */

function getRatingScore(rating) {
  const safeRating =
    Number(rating) || 0;

  return Math.min(
    20,
    Math.max(
      0,
      safeRating * 4
    )
  );
}


/* =========================================================
   PRICE SCORE
========================================================= */

function getPriceScore(price, allPrices) {
  const numericPrice =
    Number(price) || 0;

  if (
    numericPrice <= 0 ||
    !allPrices.length
  ) {
    return 0;
  }

  const minPrice =
    Math.min(...allPrices);

  const maxPrice =
    Math.max(...allPrices);

  if (maxPrice === minPrice) {
    return 5;
  }

  /*
    Price has deliberately lower weight
    than distance and delivery.
  */

  const normalized =
    1 -
    (numericPrice - minPrice) /
      (maxPrice - minPrice);

  return Math.max(
    0,
    normalized * 10
  );
}


/* =========================================================
   RECOMMENDATION LABEL
========================================================= */

function getRecommendationLabel({
  distance,
  deliveryDays,
  rating,
  isLocal,
}) {
  if (
    isLocal &&
    distance !== null &&
    distance <= 5 &&
    deliveryDays <= 1
  ) {
    return "BEST NEARBY";
  }

  if (
    isLocal &&
    distance !== null &&
    distance <= 10
  ) {
    return "NEARBY OPTION";
  }

  if (
    deliveryDays !== null &&
    deliveryDays <= 1
  ) {
    return "FAST DELIVERY";
  }

  if (
    Number(rating) >= 4.5
  ) {
    return "TOP RATED";
  }

  return "GOOD OPTION";
}


/* =========================================================
   FORMAT DELIVERY TEXT
========================================================= */

function buildDeliveryText(product) {
  if (
    product.deliveryText
  ) {
    return product.deliveryText;
  }

  const days =
    Number(product.deliveryDays);

  if (!Number.isFinite(days)) {
    return "Delivery details unavailable";
  }

  if (days <= 0) {
    return "Same-day";
  }

  if (days === 1) {
    return "1 day";
  }

  return `${days} days`;
}


/* =========================================================
   FORMAT DISTANCE TEXT
========================================================= */

function buildDistanceText(
  product,
  userLocation
) {
  /*
    Online products do not have
    a physical nearby distance.
  */

  if (
    product.latitude === null ||
    product.latitude === undefined ||
    product.longitude === null ||
    product.longitude === undefined
  ) {
    return "Online";
  }

  if (!userLocation) {
    return "Location unavailable";
  }

  const distance =
    calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      product.latitude,
      product.longitude
    );

  return formatDistance(
    distance
  );
}


/* =========================================================
   GET PRODUCTS
========================================================= */

export function getRecommendedProducts(
  componentId,
  userLocation
) {
  /*
    Only products for the exact
    required component are considered.

    This guarantees compatibility.
  */

  const matchingProducts =
    products.filter(
      (product) =>
        product.componentId ===
          componentId &&
        product.stock === true
    );

  if (
    !matchingProducts.length
  ) {
    return [];
  }


  const prices =
    matchingProducts
      .map(
        (product) =>
          Number(product.price) || 0
      )
      .filter(
        (price) => price > 0
      );


  const scoredProducts =
    matchingProducts.map(
      (product) => {
        let distance = null;

        const hasLocation =
          product.latitude !==
            null &&
          product.latitude !==
            undefined &&
          product.longitude !==
            null &&
          product.longitude !==
            undefined;

        if (
          hasLocation &&
          userLocation
        ) {
          distance =
            calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              product.latitude,
              product.longitude
            );
        }


        const isLocal =
          hasLocation;


        const distanceScore =
          getDistanceScore(
            distance
          );


        const deliveryScore =
          getDeliveryScore(
            product.deliveryDays
          );


        const ratingScore =
          getRatingScore(
            product.rating
          );


        const priceScore =
          getPriceScore(
            product.price,
            prices
          );


        /*
          Stock gets a strong fixed priority.
        */

        const stockScore =
          product.stock
            ? 15
            : 0;


        /*
          Total ranking score.

          Nearby + delivery dominate price.
        */

        const totalScore =
          stockScore +
          distanceScore +
          deliveryScore +
          ratingScore +
          priceScore;


        return {
          ...product,

          isLocal,

          distance,

          distanceText:
            buildDistanceText(
              product,
              userLocation
            ),

          deliveryText:
            buildDeliveryText(
              product
            ),

          recommendationScore:
            Math.round(
              totalScore * 10
            ) / 10,

          recommendationLabel:
            getRecommendationLabel({
              distance,
              deliveryDays:
                product.deliveryDays,
              rating:
                product.rating,
              isLocal,
            }),
        };
      }
    );


  /*
    Highest recommendation score first.
  */

  scoredProducts.sort(
    (a, b) => {
      /*
        Primary:
        recommendation score
      */

      if (
        b.recommendationScore !==
        a.recommendationScore
      ) {
        return (
          b.recommendationScore -
          a.recommendationScore
        );
      }


      /*
        Tie-breaker:
        local product wins.
      */

      if (
        b.isLocal !==
        a.isLocal
      ) {
        return b.isLocal ? 1 : -1;
      }


      /*
        Tie-breaker:
        faster delivery.
      */

      const aDelivery =
        Number(
          a.deliveryDays
        );

      const bDelivery =
        Number(
          b.deliveryDays
        );

      if (
        Number.isFinite(
          aDelivery
        ) &&
        Number.isFinite(
          bDelivery
        ) &&
        aDelivery !==
          bDelivery
      ) {
        return (
          aDelivery -
          bDelivery
        );
      }


      /*
        Final tie-breaker:
        rating.
      */

      return (
        (Number(b.rating) || 0) -
        (Number(a.rating) || 0)
      );
    }
  );


  return scoredProducts;
}


/* =========================================================
   GET BEST PRODUCT
========================================================= */

export function getBestProduct(
  componentId,
  userLocation
) {
  const results =
    getRecommendedProducts(
      componentId,
      userLocation
    );

  return (
    results[0] || null
  );
}


/* =========================================================
   GET PRODUCT SUMMARY
========================================================= */

export function getProductRecommendationSummary(
  componentId,
  userLocation
) {
  const results =
    getRecommendedProducts(
      componentId,
      userLocation
    );

  if (!results.length) {
    return {
      available: false,
      count: 0,
      bestProduct: null,
      nearbyCount: 0,
    };
  }


  const nearbyCount =
    results.filter(
      (product) =>
        product.isLocal &&
        product.distance !==
          null &&
        product.distance <= 20
    ).length;


  return {
    available: true,

    count:
      results.length,

    nearbyCount,

    bestProduct:
      results[0],
  };
}
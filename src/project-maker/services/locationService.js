/*
  =========================================================
  LOCATION SERVICE
  =========================================================

  Uses the browser's Geolocation API.

  We do NOT need a third-party location API for the
  prototype.

  The browser asks the user for permission.

  If permission is denied or unavailable, we use a
  fallback state and the rest of the application still
  works.
*/

/*
  Default demo location.

  This is only used when the browser location is not
  available.

  The product database contains prototype local sellers
  around this area.
*/

export const DEFAULT_LOCATION = {
  latitude: 12.9916,
  longitude: 80.2206,
  label: "Chennai, India",
  isFallback: true,
};

/*
  Request the current browser location.
*/

export function getCurrentLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        ...DEFAULT_LOCATION,
        status: "fallback",
        message:
          "Location is not supported by this browser.",
      });

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,

          label: "Current location",

          isFallback: false,

          status: "success",

          message:
            "Location detected successfully.",
        });
      },

      (error) => {
        let message =
          "Unable to detect your location.";

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          message =
            "Location permission was denied.";
        }

        if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          message =
            "Your location is currently unavailable.";
        }

        if (
          error.code ===
          error.TIMEOUT
        ) {
          message =
            "Location detection timed out.";
        }

        resolve({
          ...DEFAULT_LOCATION,
          status: "fallback",
          message,
        });
      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 300000,
      }
    );
  });
}

/*
  Convert degrees to radians.
*/

function toRadians(value) {
  return (
    value * (Math.PI / 180)
  );
}

/*
  Calculate distance between two coordinates
  using the Haversine formula.

  Result is returned in kilometers.
*/

export function calculateDistance(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const earthRadius = 6371;

  const dLatitude = toRadians(
    latitude2 - latitude1
  );

  const dLongitude = toRadians(
    longitude2 - longitude1
  );

  const a =
    Math.sin(dLatitude / 2) ** 2 +
    Math.cos(toRadians(latitude1)) *
      Math.cos(toRadians(latitude2)) *
      Math.sin(dLongitude / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}

/*
  Format distance for display.
*/

export function formatDistance(
  distance
) {
  if (distance < 1) {
    return `${Math.round(
      distance * 1000
    )} m`;
  }

  return `${distance.toFixed(1)} km`;
}
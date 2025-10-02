import { GOV_APIS, BASE_URL } from "./constants";

/**
 * A helper function to fetch data from a specific API with detailed logging.
 * @param {string} apiKey The key of the API in the GOV_APIS object.
 * @param {object | null} queryParams The parameters for the query.
 * @returns {Promise<{key: string, data: Array}>}
 */

type GovApiKey = keyof typeof GOV_APIS;
const fetchApiData = async (apiKey:GovApiKey,   queryParams: Record<string, unknown> | null = null) => {
  // Log and exit if the necessary parameters for a query are missing.
  if (!queryParams) {
    // console.log(
    //   `[INFO] Skipping API call for "${apiKey}" due to missing parameters.`
    // );
    return { key: apiKey, data: [] };
  }

  // Log the API and parameters being fetched.
  // console.log(
  //   `[FETCHING] API: "${apiKey}", Parameters: ${JSON.stringify(queryParams)}`
  // );

  const resourceId = GOV_APIS[apiKey]?.id;
  const url = `${BASE_URL}${resourceId}&q=${JSON.stringify(queryParams)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      // Log errors related to the API response (e.g., 404, 500).
      // console.error(
      //   `[FAILURE] API call for "${apiKey}" failed with status: ${res.status}`
      // );
      return { key: apiKey, data: [] };
    }

    const data = await res.json();
    const records = data.result.records || [];

    // Log a successful fetch and the number of records found.
    // console.log(
    //   `[SUCCESS] API call for "${apiKey}" returned ${records.length} records.`
    // );

    return {
      key: apiKey,
      data: records,
    };
  } catch (error) {
    // Log network or other unexpected errors.
    
    // console.error(`[ERROR] Network error for "${apiKey}":`, error);
    return { key: apiKey, data: [] };
  }
};

/**
 * Fetches and combines data from all vehicle APIs based on a car number,
 * handling dependencies and conditional logic.
 * @param {string} carNumber The license plate number of the vehicle.
 * @returns {Promise<Object>} A promise that resolves to an object containing all fetched data.
 */
export const getAllVehicleData = async (carNumber : string|number) => {
  // console.log(`--- Starting data fetch for car number: ${carNumber} ---`);
 const finalResults: Record<string, unknown[]> = {};
  let baseVehicleInfo = null;

  // --- PHASE 1: Get Base Vehicle Data ---
  // console.log("--- PHASE 1: Fetching Base Vehicle Data ---");

  // Group 1: Private and Commercial Vehicles
 const privateAndCommercialApiKeys: (keyof typeof GOV_APIS)[] = [
  "LICENSE_PLATE_NUMBERS_OF_PRIVATE_AND_COMMERCIAL_VEHICLES",
  "LICENSE_PLATE_NUMBERS_OF_PRIVATE_AND_COMMERCIAL_VEHICLES_CONTINUED",
];
  for (const key of privateAndCommercialApiKeys) {
    const result = await fetchApiData(key, { mispar_rechev: carNumber });
    finalResults[key] = result.data;
    if (result.data.length > 0 && !baseVehicleInfo) {
      baseVehicleInfo = result.data[0];
      // console.log(`[INFO] Base vehicle info found in "${key}".`);
      break; 
    }
  }

  // Group 2: Personal Imported Vehicles (if not found in the first group)
  if (!baseVehicleInfo) {
    const importedApiKey = "PERSONAL_IMPORTED_VEHICLES";
    const result = await fetchApiData(importedApiKey, {
      mispar_rechev: carNumber,
    });
    finalResults[importedApiKey] = result.data;
    if (result.data.length > 0) {
      baseVehicleInfo = result.data[0];
      // console.log(`[INFO] Base vehicle info found in "${importedApiKey}".`);
    }
  }

  // Group 3: Two-Wheeled Vehicles (if not found in previous groups)
  if (!baseVehicleInfo) {
    const twoWheeledApiKey = "LICENSE_PLATE_NUMBERS_OF_TWO_WHEELED_VEHICLES";
    const result = await fetchApiData(twoWheeledApiKey, {
      mispar_rechev: carNumber,
    });
    finalResults[twoWheeledApiKey] = result.data;
    if (result.data.length > 0) {
      baseVehicleInfo = result.data[0];
      // console.log(`[INFO] Base vehicle info found in "${twoWheeledApiKey}".`);
    }
  }

  // Group 4: Off-the-Road Vehicles (if still not found)
  if (!baseVehicleInfo) {
    // console.log(
    //   "[INFO] No data found in primary APIs. Checking 'off the road' databases..."
    // );
  const offRoadApiKeys: (keyof typeof GOV_APIS)[] = [
  "VEHICLES_TAKEN_OFF_THE_ROAD_WITH_FINAL_CANCELLATION_STATUS_LATEST",
  "VEHICLES_TAKEN_OFF_THE_ROAD_WITH_FINAL_CANCELLATION_STATUS_2010_TO_2016_INCLUSIVE",
  "VEHICLES_TAKEN_OFF_THE_ROAD_WITH_FINAL_CANCELLATION_STATUS_2000_TO_2009_INCLUSIVE",
];
    for (const key of offRoadApiKeys) {
      const result = await fetchApiData(key, { mispar_rechev: carNumber });
      finalResults[key] = result.data;
      if (result.data.length > 0) {
        baseVehicleInfo = result.data[0];
        // console.log(`[INFO] Base vehicle info found in "${key}".`);
        break;
      }
    }
  }

  if (!baseVehicleInfo) {
    // console.warn(
    //   "[WARN] Could not find any base information for this car number. Process will stop here."
    // );
    return finalResults;
  }

  // --- PHASE 2: Get Additional & Dependent Data ---
  // console.log("--- PHASE 2: Fetching Additional and Dependent Data ---");

  const { degem_nm, shnat_yitzur, degem_cd, kinuy_mishari } = baseVehicleInfo;
  const normalizedDegemNm = degem_nm?.trim();
  const normalizedShnatYitzur = shnat_yitzur
    ? String(shnat_yitzur).trim()
    : null;
  const normalizedDegemCd = degem_cd ? String(degem_cd).trim() : null;
  const normalizedKinuyMishari = kinuy_mishari?.trim();
  const secondaryApiPromises = [
    // APIs that always get fetched with the car number
    fetchApiData("HISTORY_OF_PRIVATE_VEHICLES_1", {
      mispar_rechev: carNumber,
    }),
    fetchApiData("HISTORY_OF_PRIVATE_VEHICLES_2", {
      mispar_rechev: carNumber,
    }),
    fetchApiData("VEICHALES_ELEGIBLE_FOR_DISCOUNT", {
      mispar_rechev: carNumber,
    }),
    fetchApiData("VEHICLES_WITH_A_DISABLED_PARKING_PERMIT", {
      "MISPAR RECHEV": carNumber,
    }),

    // Dependent APIs - queryParams are conditionally set
    fetchApiData(
      "VEHICLE_QUANTITIES_DATABASE_BY_MANUFACTURER_MODEL_AND_YEAR_OF_MANUFACTURE",
      normalizedDegemNm && normalizedShnatYitzur && normalizedDegemCd
        ? {
            degem_nm: normalizedDegemNm,
            shnat_yitzur: normalizedShnatYitzur,
            degem_cd: normalizedDegemCd,
          }
        : null
    ),
    fetchApiData(
      "VEHICLE_MANUFACTURERS_AND_MODELS_WLTP",
      normalizedDegemNm && normalizedShnatYitzur && normalizedDegemCd
        ? {
            degem_nm: normalizedDegemNm,
            shnat_yitzur: normalizedShnatYitzur,
            degem_cd: normalizedDegemCd,
          }
        : null
    ),
    fetchApiData(
      "VEHICLE_MANUFACTURER_NOTIFICATIONS_RECALL",
      normalizedKinuyMishari ? { DEGEM: normalizedKinuyMishari } : null
    ),
  ];

  const secondaryResults = await Promise.all(secondaryApiPromises);

  for (const result of secondaryResults) {
    finalResults[result.key] = result.data;
  }

  // console.log("--- All data fetching complete. ---");
  return finalResults;
};
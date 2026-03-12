interface OfferData {
  departureAirport: string;
  arrivalAirport: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: Date;
  availableWeight: number;
  sizeCategory: string;
  pricePerKg: number | null;
  flatPrice: number | null;
  pickupCity: string | null;
  dropoffCity: string | null;
  offersOriginPickup: boolean;
  offersDestinationDelivery: boolean;
}

interface RequestData {
  departureAirport: string | null;
  arrivalAirport: string | null;
  departureCity: string;
  arrivalCity: string;
  earliestDate: Date;
  latestDate: Date;
  neededWeight: number;
  sizeCategory: string;
  maxBudget: number | null;
  senderCity: string | null;
  recipientCity: string | null;
  needsFirstMile: boolean;
  needsLastMile: boolean;
  pickupPreference: string;
  dropoffPreference: string;
}

const SIZE_ORDER: Record<string, number> = { S: 1, M: 2, L: 3, XL: 4 };

export function calculateMatchScore(offer: OfferData, request: RequestData): number {
  let score = 0;

  // Route match (most important - 35 points)
  const routeMatch = checkRouteMatch(offer, request);
  if (routeMatch === 0) return 0;
  score += routeMatch * 35;

  // Date match (25 points)
  const dateMatch = checkDateMatch(offer.departureDate, request.earliestDate, request.latestDate);
  if (dateMatch === 0) return 0;
  score += dateMatch * 25;

  // Weight match (15 points)
  if (offer.availableWeight >= request.neededWeight) {
    score += 15;
  } else if (offer.availableWeight >= request.neededWeight * 0.8) {
    score += 10;
  } else {
    return 0;
  }

  // Size match (10 points)
  const offerSize = SIZE_ORDER[offer.sizeCategory] ?? 2;
  const requestSize = SIZE_ORDER[request.sizeCategory] ?? 2;
  if (offerSize >= requestSize) {
    score += 10;
  } else if (offerSize === requestSize - 1) {
    score += 5;
  }

  // Logistics compatibility (10 points)
  score += checkLogisticsMatch(offer, request);

  // Price match (5 points)
  if (request.maxBudget && request.maxBudget > 0) {
    const offerPrice = offer.flatPrice ?? (offer.pricePerKg ? offer.pricePerKg * request.neededWeight : 0);
    if (offerPrice <= request.maxBudget) {
      score += 5;
    } else if (offerPrice <= request.maxBudget * 1.2) {
      score += 2;
    }
  } else {
    score += 3;
  }

  return Math.round(score);
}

function checkRouteMatch(offer: OfferData, request: RequestData): number {
  // Exact airport match
  if (request.departureAirport && request.arrivalAirport) {
    if (
      offer.departureAirport === request.departureAirport &&
      offer.arrivalAirport === request.arrivalAirport
    ) {
      return 1;
    }
    return 0;
  }

  // City-based matching
  const depMatch =
    !request.departureAirport ||
    offer.departureAirport === request.departureAirport;
  const arrMatch =
    !request.arrivalAirport ||
    offer.arrivalAirport === request.arrivalAirport;

  if (depMatch && arrMatch) return 0.9;
  return 0;
}

function checkDateMatch(flightDate: Date, earliest: Date, latest: Date): number {
  const flight = new Date(flightDate).getTime();
  const start = new Date(earliest).getTime();
  const end = new Date(latest).getTime();

  if (flight >= start && flight <= end) {
    const range = end - start;
    if (range === 0) return 1;
    const mid = start + range / 2;
    const distFromMid = Math.abs(flight - mid);
    return 1 - (distFromMid / range) * 0.3;
  }

  // Within 1 day buffer
  const oneDay = 86400000;
  if (flight >= start - oneDay && flight <= end + oneDay) {
    return 0.5;
  }

  return 0;
}

function checkLogisticsMatch(offer: OfferData, request: RequestData): number {
  let logisticsScore = 0;

  // Origin logistics (5 points)
  if (request.needsFirstMile) {
    // Sender needs first-mile: bonus if traveler offers pickup from sender
    if (offer.offersOriginPickup) {
      logisticsScore += 5;
    } else if (offer.pickupCity && request.senderCity &&
      offer.pickupCity.toLowerCase() === request.senderCity.toLowerCase()) {
      logisticsScore += 3; // Same city makes first-mile easier
    } else {
      logisticsScore += 1; // First-mile is possible via local carrier
    }
  } else {
    // Sender handles origin logistics themselves
    if (request.pickupPreference === "flexible" || request.pickupPreference === "address") {
      logisticsScore += 4;
    } else {
      logisticsScore += 3;
    }
  }

  // Destination logistics (5 points)
  if (request.needsLastMile) {
    // Recipient needs last-mile: bonus if traveler offers delivery
    if (offer.offersDestinationDelivery) {
      logisticsScore += 5;
    } else if (offer.dropoffCity && request.recipientCity &&
      offer.dropoffCity.toLowerCase() === request.recipientCity.toLowerCase()) {
      logisticsScore += 3; // Same city makes last-mile easier
    } else {
      logisticsScore += 1; // Last-mile is possible via local carrier
    }
  } else {
    if (request.dropoffPreference === "flexible" || request.dropoffPreference === "address") {
      logisticsScore += 4;
    } else {
      logisticsScore += 3;
    }
  }

  return logisticsScore;
}

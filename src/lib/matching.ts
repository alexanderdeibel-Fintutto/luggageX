interface OfferData {
  departureAirport: string;
  arrivalAirport: string;
  departureDate: Date;
  availableWeight: number;
  sizeCategory: string;
  pricePerKg: number | null;
  flatPrice: number | null;
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
}

const SIZE_ORDER: Record<string, number> = { S: 1, M: 2, L: 3, XL: 4 };

export function calculateMatchScore(offer: OfferData, request: RequestData): number {
  let score = 0;

  // Route match (most important - 40 points)
  const routeMatch = checkRouteMatch(offer, request);
  if (routeMatch === 0) return 0; // No route match = no match
  score += routeMatch * 40;

  // Date match (30 points)
  const dateMatch = checkDateMatch(offer.departureDate, request.earliestDate, request.latestDate);
  if (dateMatch === 0) return 0; // Out of date range = no match
  score += dateMatch * 30;

  // Weight match (15 points)
  if (offer.availableWeight >= request.neededWeight) {
    score += 15;
  } else if (offer.availableWeight >= request.neededWeight * 0.8) {
    score += 10; // Close enough, might negotiate
  } else {
    return 0; // Not enough capacity
  }

  // Size match (10 points)
  const offerSize = SIZE_ORDER[offer.sizeCategory] ?? 2;
  const requestSize = SIZE_ORDER[request.sizeCategory] ?? 2;
  if (offerSize >= requestSize) {
    score += 10;
  } else if (offerSize === requestSize - 1) {
    score += 5; // One size smaller, might work
  }

  // Price match (5 points)
  if (request.maxBudget && request.maxBudget > 0) {
    const offerPrice = offer.flatPrice ?? (offer.pricePerKg ? offer.pricePerKg * request.neededWeight : 0);
    if (offerPrice <= request.maxBudget) {
      score += 5;
    } else if (offerPrice <= request.maxBudget * 1.2) {
      score += 2; // Slightly over budget
    }
  } else {
    score += 3; // No budget limit
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
    // Same city different airport
    return 0;
  }

  // City-based matching (partial)
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
    // Perfect match - closer to middle of range is better
    const range = end - start;
    if (range === 0) return 1;
    const mid = start + range / 2;
    const distFromMid = Math.abs(flight - mid);
    return 1 - (distFromMid / range) * 0.3; // 0.7-1.0 range
  }

  // Within 1 day buffer
  const oneDay = 86400000;
  if (flight >= start - oneDay && flight <= end + oneDay) {
    return 0.5;
  }

  return 0;
}

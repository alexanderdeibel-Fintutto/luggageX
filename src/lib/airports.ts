export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export const AIRPORTS: Airport[] = [
  // Germany
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "DE" },
  { code: "MUC", name: "Munich Airport", city: "München", country: "DE" },
  { code: "BER", name: "Berlin Brandenburg", city: "Berlin", country: "DE" },
  { code: "DUS", name: "Düsseldorf Airport", city: "Düsseldorf", country: "DE" },
  { code: "HAM", name: "Hamburg Airport", city: "Hamburg", country: "DE" },
  { code: "STR", name: "Stuttgart Airport", city: "Stuttgart", country: "DE" },
  { code: "CGN", name: "Cologne Bonn Airport", city: "Köln", country: "DE" },
  { code: "HAJ", name: "Hannover Airport", city: "Hannover", country: "DE" },
  { code: "NUE", name: "Nuremberg Airport", city: "Nürnberg", country: "DE" },
  { code: "LEJ", name: "Leipzig/Halle Airport", city: "Leipzig", country: "DE" },
  { code: "DTM", name: "Dortmund Airport", city: "Dortmund", country: "DE" },
  // Austria
  { code: "VIE", name: "Vienna International", city: "Wien", country: "AT" },
  { code: "SZG", name: "Salzburg Airport", city: "Salzburg", country: "AT" },
  { code: "INN", name: "Innsbruck Airport", city: "Innsbruck", country: "AT" },
  { code: "GRZ", name: "Graz Airport", city: "Graz", country: "AT" },
  // Switzerland
  { code: "ZRH", name: "Zürich Airport", city: "Zürich", country: "CH" },
  { code: "GVA", name: "Geneva Airport", city: "Genf", country: "CH" },
  { code: "BSL", name: "EuroAirport Basel", city: "Basel", country: "CH" },
  // UK
  { code: "LHR", name: "London Heathrow", city: "London", country: "GB" },
  { code: "LGW", name: "London Gatwick", city: "London", country: "GB" },
  { code: "STN", name: "London Stansted", city: "London", country: "GB" },
  { code: "MAN", name: "Manchester Airport", city: "Manchester", country: "GB" },
  { code: "EDI", name: "Edinburgh Airport", city: "Edinburgh", country: "GB" },
  // France
  { code: "CDG", name: "Paris Charles de Gaulle", city: "Paris", country: "FR" },
  { code: "ORY", name: "Paris Orly", city: "Paris", country: "FR" },
  { code: "NCE", name: "Nice Côte d'Azur", city: "Nizza", country: "FR" },
  { code: "LYS", name: "Lyon-Saint Exupéry", city: "Lyon", country: "FR" },
  { code: "MRS", name: "Marseille Provence", city: "Marseille", country: "FR" },
  // Spain
  { code: "MAD", name: "Madrid Barajas", city: "Madrid", country: "ES" },
  { code: "BCN", name: "Barcelona El Prat", city: "Barcelona", country: "ES" },
  { code: "PMI", name: "Palma de Mallorca", city: "Palma", country: "ES" },
  { code: "AGP", name: "Málaga Airport", city: "Málaga", country: "ES" },
  { code: "ALC", name: "Alicante Airport", city: "Alicante", country: "ES" },
  // Italy
  { code: "FCO", name: "Rome Fiumicino", city: "Rom", country: "IT" },
  { code: "MXP", name: "Milan Malpensa", city: "Mailand", country: "IT" },
  { code: "VCE", name: "Venice Marco Polo", city: "Venedig", country: "IT" },
  { code: "NAP", name: "Naples Airport", city: "Neapel", country: "IT" },
  // Netherlands
  { code: "AMS", name: "Amsterdam Schiphol", city: "Amsterdam", country: "NL" },
  // Belgium
  { code: "BRU", name: "Brussels Airport", city: "Brüssel", country: "BE" },
  // Portugal
  { code: "LIS", name: "Lisbon Airport", city: "Lissabon", country: "PT" },
  { code: "OPO", name: "Porto Airport", city: "Porto", country: "PT" },
  { code: "FAO", name: "Faro Airport", city: "Faro", country: "PT" },
  // Greece
  { code: "ATH", name: "Athens International", city: "Athen", country: "GR" },
  { code: "SKG", name: "Thessaloniki Airport", city: "Thessaloniki", country: "GR" },
  { code: "HER", name: "Heraklion Airport", city: "Heraklion", country: "GR" },
  // Turkey
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "TR" },
  { code: "SAW", name: "Istanbul Sabiha Gökçen", city: "Istanbul", country: "TR" },
  { code: "AYT", name: "Antalya Airport", city: "Antalya", country: "TR" },
  // Scandinavia
  { code: "CPH", name: "Copenhagen Airport", city: "Kopenhagen", country: "DK" },
  { code: "OSL", name: "Oslo Gardermoen", city: "Oslo", country: "NO" },
  { code: "ARN", name: "Stockholm Arlanda", city: "Stockholm", country: "SE" },
  { code: "HEL", name: "Helsinki-Vantaa", city: "Helsinki", country: "FI" },
  // Eastern Europe
  { code: "WAW", name: "Warsaw Chopin", city: "Warschau", country: "PL" },
  { code: "PRG", name: "Prague Václav Havel", city: "Prag", country: "CZ" },
  { code: "BUD", name: "Budapest Ferenc Liszt", city: "Budapest", country: "HU" },
  { code: "OTP", name: "Bucharest Otopeni", city: "Bukarest", country: "RO" },
  // Middle East
  { code: "DXB", name: "Dubai International", city: "Dubai", country: "AE" },
  { code: "AUH", name: "Abu Dhabi International", city: "Abu Dhabi", country: "AE" },
  { code: "DOH", name: "Hamad International", city: "Doha", country: "QA" },
  { code: "TLV", name: "Ben Gurion Airport", city: "Tel Aviv", country: "IL" },
  // Asia
  { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "TH" },
  { code: "SIN", name: "Singapore Changi", city: "Singapur", country: "SG" },
  { code: "HKG", name: "Hong Kong International", city: "Hong Kong", country: "HK" },
  { code: "NRT", name: "Narita Airport", city: "Tokio", country: "JP" },
  { code: "ICN", name: "Incheon International", city: "Seoul", country: "KR" },
  { code: "PEK", name: "Beijing Capital", city: "Peking", country: "CN" },
  { code: "DEL", name: "Indira Gandhi International", city: "Neu-Delhi", country: "IN" },
  { code: "BOM", name: "Chhatrapati Shivaji", city: "Mumbai", country: "IN" },
  // Africa
  { code: "CAI", name: "Cairo International", city: "Kairo", country: "EG" },
  { code: "JNB", name: "O.R. Tambo International", city: "Johannesburg", country: "ZA" },
  { code: "CPT", name: "Cape Town International", city: "Kapstadt", country: "ZA" },
  { code: "CMN", name: "Mohammed V International", city: "Casablanca", country: "MA" },
  { code: "NBO", name: "Jomo Kenyatta International", city: "Nairobi", country: "KE" },
  // Americas
  { code: "JFK", name: "John F. Kennedy", city: "New York", country: "US" },
  { code: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "US" },
  { code: "ORD", name: "Chicago O'Hare", city: "Chicago", country: "US" },
  { code: "MIA", name: "Miami International", city: "Miami", country: "US" },
  { code: "SFO", name: "San Francisco International", city: "San Francisco", country: "US" },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta", city: "Atlanta", country: "US" },
  { code: "EWR", name: "Newark Liberty", city: "Newark", country: "US" },
  { code: "YYZ", name: "Toronto Pearson", city: "Toronto", country: "CA" },
  { code: "GRU", name: "São Paulo-Guarulhos", city: "São Paulo", country: "BR" },
  { code: "EZE", name: "Buenos Aires Ezeiza", city: "Buenos Aires", country: "AR" },
  { code: "MEX", name: "Mexico City International", city: "Mexiko-Stadt", country: "MX" },
  { code: "BOG", name: "El Dorado International", city: "Bogotá", country: "CO" },
  { code: "SCL", name: "Santiago International", city: "Santiago", country: "CL" },
  // Oceania
  { code: "SYD", name: "Sydney Kingsford Smith", city: "Sydney", country: "AU" },
  { code: "MEL", name: "Melbourne Tullamarine", city: "Melbourne", country: "AU" },
  { code: "AKL", name: "Auckland Airport", city: "Auckland", country: "NZ" },
];

export function searchAirports(query: string): Airport[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return AIRPORTS.filter(
    (a) =>
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  ).slice(0, 10);
}

export function getAirport(code: string): Airport | undefined {
  return AIRPORTS.find((a) => a.code === code.toUpperCase());
}

export const AIRLINES: Record<string, string> = {
  LH: "Lufthansa",
  EW: "Eurowings",
  DE: "Condor",
  X3: "TUIfly",
  OS: "Austrian Airlines",
  LX: "Swiss",
  BA: "British Airways",
  AF: "Air France",
  KL: "KLM",
  IB: "Iberia",
  AZ: "ITA Airways",
  SK: "SAS",
  TK: "Turkish Airlines",
  EK: "Emirates",
  QR: "Qatar Airways",
  EY: "Etihad Airways",
  SQ: "Singapore Airlines",
  CX: "Cathay Pacific",
  NH: "ANA",
  JL: "Japan Airlines",
  UA: "United Airlines",
  AA: "American Airlines",
  DL: "Delta Air Lines",
  FR: "Ryanair",
  U2: "easyJet",
  W6: "Wizz Air",
  VY: "Vueling",
  PC: "Pegasus Airlines",
  SU: "Aeroflot",
  TP: "TAP Portugal",
  AY: "Finnair",
  LO: "LOT Polish Airlines",
  OK: "Czech Airlines",
};

export function getAirlineByFlightNumber(flightNumber: string): string | undefined {
  const code = flightNumber.replace(/[0-9]/g, "").toUpperCase();
  return AIRLINES[code];
}

export const SIZE_CATEGORIES = [
  { value: "S", label: "S - Handgepäck", description: "max. 55x40x20 cm", maxDimension: "55x40x20" },
  { value: "M", label: "M - Kabinentrolley", description: "max. 56x45x25 cm", maxDimension: "56x45x25" },
  { value: "L", label: "L - Koffer", description: "max. 69x46x29 cm", maxDimension: "69x46x29" },
  { value: "XL", label: "XL - Großer Koffer", description: "max. 80x52x34 cm", maxDimension: "80x52x34" },
] as const;

export const ITEM_CATEGORIES = [
  { value: "general", label: "Allgemein" },
  { value: "documents", label: "Dokumente" },
  { value: "electronics", label: "Elektronik" },
  { value: "clothing", label: "Kleidung" },
  { value: "food", label: "Lebensmittel" },
  { value: "fragile", label: "Zerbrechlich" },
  { value: "other", label: "Sonstiges" },
] as const;

export const PROHIBITED_ITEMS = [
  "Waffen und Munition",
  "Explosivstoffe und Feuerwerkskörper",
  "Drogen und illegale Substanzen",
  "Giftige oder radioaktive Materialien",
  "Lebende Tiere (ohne Genehmigung)",
  "Gefälschte Waren",
  "Unverzollte Waren über Freigrenzen",
];

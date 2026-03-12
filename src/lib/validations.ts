import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen haben"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(1, "Passwort ist erforderlich"),
});

export const luggageOfferSchema = z.object({
  flightNumber: z.string().min(3, "Flugnummer eingeben (z.B. LH1234)"),
  departureAirport: z.string().min(3, "Abflughafen wählen"),
  arrivalAirport: z.string().min(3, "Zielflughafen wählen"),
  departureDate: z.string().min(1, "Abflugdatum wählen"),
  arrivalDate: z.string().min(1, "Ankunftsdatum wählen"),
  luggageType: z.enum(["space_in_own", "extra_suitcase", "both"]).default("extra_suitcase"),
  extraSuitcaseCount: z.coerce.number().min(1).max(5).default(1),
  availableWeight: z.coerce.number().min(0.5, "Mindestens 0.5 kg"),
  maxSingleItem: z.coerce.number().optional(),
  sizeCategory: z.enum(["S", "M", "L", "XL"]),
  description: z.string().optional(),
  pricePerKg: z.coerce.number().min(0).optional(),
  flatPrice: z.coerce.number().min(0).optional(),
  negotiable: z.boolean().default(true),
  // Origin: where traveler receives packages before the flight
  pickupType: z.enum(["airport", "address", "meetingPoint"]),
  pickupAddress: z.string().optional(),
  pickupCity: z.string().optional(),
  offersOriginPickup: z.boolean().default(false),
  // Destination: where traveler delivers packages after the flight
  dropoffType: z.enum(["airport", "address", "meetingPoint"]),
  dropoffAddress: z.string().optional(),
  dropoffCity: z.string().optional(),
  offersDestinationDelivery: z.boolean().default(false),
});

export const luggageRequestSchema = z.object({
  departureCity: z.string().min(2, "Abgangsort eingeben"),
  arrivalCity: z.string().min(2, "Zielort eingeben"),
  departureAirport: z.string().optional(),
  arrivalAirport: z.string().optional(),
  earliestDate: z.string().min(1, "Frühestes Datum wählen"),
  latestDate: z.string().min(1, "Spätestes Datum wählen"),
  neededWeight: z.coerce.number().min(0.1, "Gewicht angeben"),
  sizeCategory: z.enum(["S", "M", "L", "XL"]),
  itemDescription: z.string().min(5, "Beschreibung eingeben (mind. 5 Zeichen)"),
  itemCategory: z.string().default("general"),
  maxBudget: z.coerce.number().min(0).optional(),
  requestType: z.enum(["shipment", "extra_luggage"]),
  flightNumber: z.string().optional(),
  // Sender's address in origin country
  senderAddress: z.string().optional(),
  senderCity: z.string().optional(),
  // Recipient's address in destination country
  recipientAddress: z.string().optional(),
  recipientCity: z.string().optional(),
  // Local shipping needs
  needsFirstMile: z.boolean().default(false),
  needsLastMile: z.boolean().default(false),
  pickupPreference: z.enum(["airport", "address", "flexible"]),
  dropoffPreference: z.enum(["airport", "address", "flexible"]),
});

export const messageSchema = z.object({
  content: z.string().min(1, "Nachricht eingeben").max(1000),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LuggageOfferInput = z.infer<typeof luggageOfferSchema>;
export type LuggageRequestInput = z.infer<typeof luggageRequestSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean up existing data
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.match.deleteMany();
  await prisma.luggageRequest.deleteMany();
  await prisma.luggageOffer.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const passwordHash = await hash("test1234", 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Anna Müller",
        email: "anna@example.com",
        passwordHash,
        phone: "+49 170 1234567",
        bio: "Vielflieger zwischen Frankfurt und London. Biete regelmäßig freies Gepäck an.",
        verified: true,
        verifiedAt: new Date(),
        rating: 4.8,
        totalDeals: 23,
      },
    }),
    prisma.user.create({
      data: {
        name: "Max Weber",
        email: "max@example.com",
        passwordHash,
        phone: "+49 171 2345678",
        bio: "Geschäftsreisender, fliege wöchentlich München-Wien.",
        verified: true,
        verifiedAt: new Date(),
        rating: 4.5,
        totalDeals: 12,
      },
    }),
    prisma.user.create({
      data: {
        name: "Sofia Rossi",
        email: "sofia@example.com",
        passwordHash,
        phone: "+39 333 4567890",
        bio: "Studentin, pendelt zwischen Berlin und Rom.",
        verified: true,
        verifiedAt: new Date(),
        rating: 4.9,
        totalDeals: 8,
      },
    }),
    prisma.user.create({
      data: {
        name: "Thomas Fischer",
        email: "thomas@example.com",
        passwordHash,
        bio: "Suche regelmäßig günstigen Versand für Elektronik.",
        verified: false,
        rating: 4.2,
        totalDeals: 3,
      },
    }),
    prisma.user.create({
      data: {
        name: "Leila Yilmaz",
        email: "leila@example.com",
        passwordHash,
        phone: "+49 172 3456789",
        bio: "Fliege oft Düsseldorf-Istanbul. Nehme gerne Pakete mit!",
        verified: true,
        verifiedAt: new Date(),
        rating: 5.0,
        totalDeals: 31,
      },
    }),
    prisma.user.create({
      data: {
        name: "Demo User",
        email: "demo@example.com",
        passwordHash,
        bio: "Testkonto zum Ausprobieren der App.",
        verified: true,
        verifiedAt: new Date(),
        rating: 0,
        totalDeals: 0,
      },
    }),
  ]);

  const [anna, max, sofia, thomas, leila, demo] = users;

  // Create offers (future dates)
  const now = new Date();
  const inDays = (d: number) => new Date(now.getTime() + d * 86400000);

  const offers = await Promise.all([
    prisma.luggageOffer.create({
      data: {
        userId: anna.id,
        flightNumber: "LH902",
        airline: "Lufthansa",
        departureAirport: "FRA",
        arrivalAirport: "LHR",
        departureCity: "Frankfurt",
        arrivalCity: "London",
        departureDate: inDays(3),
        arrivalDate: inDays(3),
        availableWeight: 15,
        maxSingleItem: 10,
        sizeCategory: "L",
        description: "Habe noch viel Platz im Koffer. Kein Problem mit Kleidung, Dokumenten oder kleiner Elektronik.",
        pricePerKg: 3,
        flatPrice: null,
        negotiable: true,
        pickupType: "airport",
        dropoffType: "airport",
        status: "active",
      },
    }),
    prisma.luggageOffer.create({
      data: {
        userId: max.id,
        flightNumber: "OS201",
        airline: "Austrian Airlines",
        departureAirport: "MUC",
        arrivalAirport: "VIE",
        departureCity: "München",
        arrivalCity: "Wien",
        departureDate: inDays(5),
        arrivalDate: inDays(5),
        availableWeight: 8,
        sizeCategory: "M",
        description: "Reise nur mit Handgepäck. Ganzer aufgegebener Koffer frei!",
        pricePerKg: null,
        flatPrice: 25,
        negotiable: false,
        pickupType: "address",
        pickupAddress: "München Hauptbahnhof",
        dropoffType: "airport",
        status: "active",
      },
    }),
    prisma.luggageOffer.create({
      data: {
        userId: sofia.id,
        flightNumber: "FR1234",
        airline: "Ryanair",
        departureAirport: "BER",
        arrivalAirport: "FCO",
        departureCity: "Berlin",
        arrivalCity: "Rom",
        departureDate: inDays(7),
        arrivalDate: inDays(7),
        availableWeight: 10,
        sizeCategory: "L",
        description: "Fliege nach Hause zu Weihnachten. Kann gerne was mitnehmen.",
        pricePerKg: 4,
        negotiable: true,
        pickupType: "meetingPoint",
        pickupAddress: "Berlin Alexanderplatz",
        dropoffType: "airport",
        status: "active",
      },
    }),
    prisma.luggageOffer.create({
      data: {
        userId: leila.id,
        flightNumber: "TK1724",
        airline: "Turkish Airlines",
        departureAirport: "DUS",
        arrivalAirport: "IST",
        departureCity: "Düsseldorf",
        arrivalCity: "Istanbul",
        departureDate: inDays(4),
        arrivalDate: inDays(4),
        availableWeight: 20,
        maxSingleItem: 15,
        sizeCategory: "XL",
        description: "Regelmäßiger Flug. 20kg frei. Ideal für Geschenke oder Waren nach Istanbul!",
        pricePerKg: 2.5,
        flatPrice: null,
        negotiable: true,
        pickupType: "address",
        pickupAddress: "Düsseldorf, Altstadt",
        dropoffType: "address",
        dropoffAddress: "Istanbul, Kadıköy",
        status: "active",
      },
    }),
    prisma.luggageOffer.create({
      data: {
        userId: anna.id,
        flightNumber: "LH1800",
        airline: "Lufthansa",
        departureAirport: "FRA",
        arrivalAirport: "BCN",
        departureCity: "Frankfurt",
        arrivalCity: "Barcelona",
        departureDate: inDays(10),
        arrivalDate: inDays(10),
        availableWeight: 12,
        sizeCategory: "M",
        description: "Geschäftsreise. Kann Dokumente oder kleine Pakete mitnehmen.",
        pricePerKg: 5,
        negotiable: true,
        pickupType: "airport",
        dropoffType: "airport",
        status: "active",
      },
    }),
    prisma.luggageOffer.create({
      data: {
        userId: leila.id,
        flightNumber: "EK55",
        airline: "Emirates",
        departureAirport: "DUS",
        arrivalAirport: "DXB",
        departureCity: "Düsseldorf",
        arrivalCity: "Dubai",
        departureDate: inDays(14),
        arrivalDate: inDays(14),
        availableWeight: 25,
        maxSingleItem: 20,
        sizeCategory: "XL",
        description: "Emirates Flug mit 30kg Freigepäck. 25kg davon verfügbar. Perfekt für größere Sendungen!",
        pricePerKg: 3,
        negotiable: true,
        pickupType: "airport",
        dropoffType: "airport",
        status: "active",
      },
    }),
    prisma.luggageOffer.create({
      data: {
        userId: max.id,
        flightNumber: "LX1071",
        airline: "Swiss",
        departureAirport: "MUC",
        arrivalAirport: "ZRH",
        departureCity: "München",
        arrivalCity: "Zürich",
        departureDate: inDays(2),
        arrivalDate: inDays(2),
        availableWeight: 5,
        sizeCategory: "S",
        description: "Kurzer Geschäftsflug. Kann Dokumente oder kleine Pakete mitnehmen.",
        flatPrice: 15,
        negotiable: false,
        pickupType: "airport",
        dropoffType: "airport",
        status: "active",
      },
    }),
    prisma.luggageOffer.create({
      data: {
        userId: sofia.id,
        flightNumber: "U28392",
        airline: "easyJet",
        departureAirport: "BER",
        arrivalAirport: "CDG",
        departureCity: "Berlin",
        arrivalCity: "Paris",
        departureDate: inDays(6),
        arrivalDate: inDays(6),
        availableWeight: 7,
        sizeCategory: "M",
        description: "Wochenendtrip. Kann was mitnehmen, kein Sperrgut.",
        pricePerKg: 4,
        negotiable: true,
        pickupType: "meetingPoint",
        pickupAddress: "Berlin Friedrichstraße",
        dropoffType: "airport",
        status: "active",
      },
    }),
  ]);

  // Create requests
  const requests = await Promise.all([
    prisma.luggageRequest.create({
      data: {
        userId: thomas.id,
        departureCity: "Frankfurt",
        arrivalCity: "London",
        departureAirport: "FRA",
        arrivalAirport: "LHR",
        earliestDate: inDays(1),
        latestDate: inDays(7),
        neededWeight: 5,
        sizeCategory: "M",
        itemDescription: "Laptop-Zubehör und Kabel für einen Freund in London. Gut verpackt, ca. 3kg.",
        itemCategory: "electronics",
        maxBudget: 20,
        requestType: "shipment",
        pickupPreference: "flexible",
        dropoffPreference: "airport",
        status: "active",
      },
    }),
    prisma.luggageRequest.create({
      data: {
        userId: demo.id,
        departureCity: "München",
        arrivalCity: "Wien",
        earliestDate: inDays(3),
        latestDate: inDays(10),
        neededWeight: 3,
        sizeCategory: "S",
        itemDescription: "Geburtstagsgeschenk für meine Schwester in Wien. Bücher und Schokolade.",
        itemCategory: "general",
        maxBudget: 15,
        requestType: "shipment",
        pickupPreference: "flexible",
        dropoffPreference: "address",
        status: "active",
      },
    }),
    prisma.luggageRequest.create({
      data: {
        userId: thomas.id,
        departureCity: "Berlin",
        arrivalCity: "Rom",
        departureAirport: "BER",
        arrivalAirport: "FCO",
        earliestDate: inDays(5),
        latestDate: inDays(14),
        neededWeight: 8,
        sizeCategory: "L",
        itemDescription: "Winterkleidung für meinen Umzug nach Rom. Jacken, Pullover, Schuhe.",
        itemCategory: "clothing",
        maxBudget: 40,
        requestType: "shipment",
        pickupPreference: "address",
        dropoffPreference: "flexible",
        status: "active",
      },
    }),
    prisma.luggageRequest.create({
      data: {
        userId: demo.id,
        departureCity: "Düsseldorf",
        arrivalCity: "Istanbul",
        departureAirport: "DUS",
        arrivalAirport: "IST",
        earliestDate: inDays(2),
        latestDate: inDays(8),
        neededWeight: 10,
        sizeCategory: "L",
        itemDescription: "Deutsche Spezialitäten als Geschenk: Stollen, Lebkuchen, Kaffee. Alles originalverpackt.",
        itemCategory: "food",
        maxBudget: 30,
        requestType: "shipment",
        pickupPreference: "flexible",
        dropoffPreference: "flexible",
        status: "active",
      },
    }),
    prisma.luggageRequest.create({
      data: {
        userId: thomas.id,
        departureCity: "Frankfurt",
        arrivalCity: "Barcelona",
        earliestDate: inDays(8),
        latestDate: inDays(14),
        neededWeight: 2,
        sizeCategory: "S",
        itemDescription: "Wichtige Dokumente und Verträge. Müssen sicher und trocken transportiert werden.",
        itemCategory: "documents",
        maxBudget: 25,
        requestType: "shipment",
        pickupPreference: "airport",
        dropoffPreference: "airport",
        status: "active",
      },
    }),
  ]);

  // Create matches (some active, some completed)
  const match1 = await prisma.match.create({
    data: {
      offerId: offers[0].id,       // Anna FRA→LHR
      requestId: requests[0].id,   // Thomas FRA→LHR electronics
      score: 92,
      agreedPrice: 15,
      handoverCode: "LX8A3F2K",
      status: "accepted",
    },
  });

  const match2 = await prisma.match.create({
    data: {
      offerId: offers[3].id,       // Leila DUS→IST
      requestId: requests[3].id,   // Demo DUS→IST food
      score: 88,
      agreedPrice: 25,
      handoverCode: "GT7P9D4M",
      status: "proposed",
    },
  });

  // Add messages for match1
  await prisma.message.createMany({
    data: [
      {
        matchId: match1.id,
        senderId: thomas.id,
        receiverId: anna.id,
        content: "Hallo Anna! Ich habe gesehen, dass du nach London fliegst. Könntest du ein kleines Paket mit Laptop-Zubehör mitnehmen? Ca. 3kg, alles gut verpackt.",
        createdAt: new Date(now.getTime() - 3600000 * 5),
      },
      {
        matchId: match1.id,
        senderId: anna.id,
        receiverId: thomas.id,
        content: "Hi Thomas! Ja klar, das passt gut. Kannst du mir das Paket am Flughafen übergeben? Ich bin ca. 2h vor Abflug da.",
        createdAt: new Date(now.getTime() - 3600000 * 4),
      },
      {
        matchId: match1.id,
        senderId: thomas.id,
        receiverId: anna.id,
        content: "Super, das klingt gut! Ich bringe es dir um 14:00 zum Terminal 1. Sollen wir 15 EUR machen?",
        createdAt: new Date(now.getTime() - 3600000 * 3),
      },
      {
        matchId: match1.id,
        senderId: anna.id,
        receiverId: thomas.id,
        content: "15 EUR passt! Dann sehen wir uns Mittwoch am Terminal 1 um 14:00. Bis dann! 👋",
        createdAt: new Date(now.getTime() - 3600000 * 2),
      },
    ],
  });

  // Create a completed match with reviews
  const completedOffer = await prisma.luggageOffer.create({
    data: {
      userId: leila.id,
      flightNumber: "TK1722",
      airline: "Turkish Airlines",
      departureAirport: "DUS",
      arrivalAirport: "IST",
      departureCity: "Düsseldorf",
      arrivalCity: "Istanbul",
      departureDate: new Date(now.getTime() - 86400000 * 10),
      arrivalDate: new Date(now.getTime() - 86400000 * 10),
      availableWeight: 15,
      sizeCategory: "L",
      pricePerKg: 2.5,
      negotiable: true,
      pickupType: "address",
      dropoffType: "airport",
      status: "completed",
    },
  });

  const completedRequest = await prisma.luggageRequest.create({
    data: {
      userId: thomas.id,
      departureCity: "Düsseldorf",
      arrivalCity: "Istanbul",
      departureAirport: "DUS",
      arrivalAirport: "IST",
      earliestDate: new Date(now.getTime() - 86400000 * 14),
      latestDate: new Date(now.getTime() - 86400000 * 7),
      neededWeight: 8,
      sizeCategory: "M",
      itemDescription: "Geschenke für die Familie: Spielzeug und Bücher",
      itemCategory: "general",
      maxBudget: 25,
      requestType: "shipment",
      pickupPreference: "flexible",
      dropoffPreference: "airport",
      status: "completed",
    },
  });

  const completedMatch = await prisma.match.create({
    data: {
      offerId: completedOffer.id,
      requestId: completedRequest.id,
      score: 95,
      agreedPrice: 20,
      handoverCode: "AB12CD34",
      status: "completed",
      pickupConfirmed: true,
      pickupConfirmedAt: new Date(now.getTime() - 86400000 * 10),
      dropoffConfirmed: true,
      dropoffConfirmedAt: new Date(now.getTime() - 86400000 * 10),
    },
  });

  // Create reviews for completed match
  await prisma.review.create({
    data: {
      matchId: completedMatch.id,
      fromUserId: thomas.id,
      toUserId: leila.id,
      rating: 5,
      comment: "Super zuverlässig! Alles sicher angekommen. Leila ist ein Top-Carrier. Gerne wieder!",
    },
  });

  await prisma.review.create({
    data: {
      matchId: completedMatch.id,
      fromUserId: leila.id,
      toUserId: thomas.id,
      rating: 5,
      comment: "Thomas hat das Paket pünktlich und gut verpackt übergeben. Alles problemlos gelaufen.",
    },
  });

  console.log("Seed completed!");
  console.log(`Created ${users.length} users`);
  console.log(`Created ${offers.length + 1} offers`);
  console.log(`Created ${requests.length + 1} requests`);
  console.log(`Created 3 matches`);
  console.log("\nTest-Login: demo@example.com / test1234");
  console.log("Weitere Accounts: anna@, max@, sofia@, thomas@, leila@ (alle @example.com, PW: test1234)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

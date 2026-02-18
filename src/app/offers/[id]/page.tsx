import { Metadata } from "next";
import { prisma } from "@/lib/db";
import OfferDetailClient from "./offer-detail-client";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const offer = await prisma.luggageOffer.findUnique({
      where: { id },
      select: {
        departureAirport: true,
        arrivalAirport: true,
        departureCity: true,
        arrivalCity: true,
        departureDate: true,
        availableWeight: true,
        flatPrice: true,
        pricePerKg: true,
        currency: true,
        description: true,
        user: { select: { name: true } },
      },
    });

    if (!offer) {
      return {
        title: "Angebot nicht gefunden | LuggageX",
      };
    }

    const price = offer.flatPrice
      ? `${offer.flatPrice} ${offer.currency}`
      : offer.pricePerKg
      ? `${offer.pricePerKg} ${offer.currency}/kg`
      : "Verhandelbar";

    const date = new Date(offer.departureDate).toLocaleDateString("de-DE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const title = `${offer.departureAirport} → ${offer.arrivalAirport} | ${offer.availableWeight}kg ab ${price} | LuggageX`;
    const description = `Gepäcktransport von ${offer.departureCity} (${offer.departureAirport}) nach ${offer.arrivalCity} (${offer.arrivalAirport}) am ${date}. ${offer.availableWeight}kg verfügbar für ${price}. Angeboten von ${offer.user.name}.${offer.description ? ` ${offer.description}` : ""}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "LuggageX by FinnTutto",
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    };
  } catch {
    return {
      title: "Gepäck-Angebot | LuggageX",
      description: "Finde günstigen Gepäcktransport auf LuggageX.",
    };
  }
}

export default function OfferDetailPage({ params }: Props) {
  return <OfferDetailClient params={params} />;
}

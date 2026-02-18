"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Locale = "de" | "en";

const translations: Record<Locale, Record<string, string>> = {
  de: {
    // Navigation
    "nav.search": "Suchen",
    "nav.offerLuggage": "Gepäck anbieten",
    "nav.searchLuggage": "Gepäck suchen",
    "nav.dashboard": "Dashboard",
    "nav.messages": "Nachrichten",
    "nav.bookmarks": "Gemerkt",
    "nav.stats": "Statistiken",
    "nav.alerts": "Route-Alerts",
    "nav.profile": "Profil",
    "nav.settings": "Einstellungen",
    "nav.logout": "Abmelden",
    "nav.login": "Anmelden",
    "nav.register": "Registrieren",

    // Common
    "common.loading": "Laden...",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
    "common.back": "Zurück",
    "common.next": "Weiter",
    "common.submit": "Absenden",
    "common.close": "Schließen",
    "common.active": "Aktiv",
    "common.paused": "Pausiert",
    "common.completed": "Abgeschlossen",
    "common.cancelled": "Storniert",
    "common.expired": "Abgelaufen",

    // Auth
    "auth.login.title": "Willkommen zurück",
    "auth.login.subtitle": "Melde dich bei LuggageX an",
    "auth.login.email": "E-Mail",
    "auth.login.password": "Dein Passwort",
    "auth.login.submit": "Anmelden",
    "auth.login.noAccount": "Noch kein Konto?",
    "auth.login.registerLink": "Jetzt registrieren",
    "auth.register.title": "Konto erstellen",
    "auth.register.subtitle": "Werde Teil der LuggageX Community",
    "auth.register.name": "Dein vollständiger Name",
    "auth.register.password": "Mind. 8 Zeichen",
    "auth.register.confirmPassword": "Passwort wiederholen",
    "auth.register.submit": "Registrieren",
    "auth.register.hasAccount": "Bereits ein Konto?",
    "auth.register.loginLink": "Jetzt anmelden",
    "auth.error.network": "Netzwerkfehler. Bitte versuche es erneut.",

    // Search
    "search.title": "Angebote durchsuchen",
    "search.from": "Von",
    "search.to": "Nach",
    "search.date": "Datum",
    "search.weight": "Gewicht",
    "search.searchBtn": "Suchen",
    "search.noResults": "Keine Angebote gefunden",
    "search.loadMore": "Mehr laden",
    "search.results": "Ergebnisse",
    "search.filters": "Filter",
    "search.sort": "Sortieren",
    "search.compare": "Vergleichen",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Verwalte deine Angebote, Gesuche und Matches",
    "dashboard.activeMatches": "Aktive Matches",
    "dashboard.completed": "Abgeschlossen",
    "dashboard.myOffers": "Meine Angebote",
    "dashboard.myRequests": "Meine Gesuche",

    // Settings
    "settings.title": "Einstellungen",
    "settings.subtitle": "Verwalte dein Konto und deine Präferenzen",
    "settings.profile": "Profil",
    "settings.notifications": "Benachrichtigungen",
    "settings.security": "Sicherheit",
    "settings.language": "Sprache",

    // Misc
    "insurance.title": "Versicherung & Schutz",
    "disputes.title": "Streitfall melden",
    "footer.rights": "Alle Rechte vorbehalten.",
  },

  en: {
    // Navigation
    "nav.search": "Search",
    "nav.offerLuggage": "Offer luggage",
    "nav.searchLuggage": "Find luggage",
    "nav.dashboard": "Dashboard",
    "nav.messages": "Messages",
    "nav.bookmarks": "Saved",
    "nav.stats": "Statistics",
    "nav.alerts": "Route Alerts",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.logout": "Sign out",
    "nav.login": "Sign in",
    "nav.register": "Sign up",

    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.back": "Back",
    "common.next": "Next",
    "common.submit": "Submit",
    "common.close": "Close",
    "common.active": "Active",
    "common.paused": "Paused",
    "common.completed": "Completed",
    "common.cancelled": "Cancelled",
    "common.expired": "Expired",

    // Auth
    "auth.login.title": "Welcome back",
    "auth.login.subtitle": "Sign in to LuggageX",
    "auth.login.email": "Email",
    "auth.login.password": "Your password",
    "auth.login.submit": "Sign in",
    "auth.login.noAccount": "Don't have an account?",
    "auth.login.registerLink": "Sign up now",
    "auth.register.title": "Create account",
    "auth.register.subtitle": "Join the LuggageX community",
    "auth.register.name": "Your full name",
    "auth.register.password": "Min. 8 characters",
    "auth.register.confirmPassword": "Confirm password",
    "auth.register.submit": "Sign up",
    "auth.register.hasAccount": "Already have an account?",
    "auth.register.loginLink": "Sign in now",
    "auth.error.network": "Network error. Please try again.",

    // Search
    "search.title": "Browse offers",
    "search.from": "From",
    "search.to": "To",
    "search.date": "Date",
    "search.weight": "Weight",
    "search.searchBtn": "Search",
    "search.noResults": "No offers found",
    "search.loadMore": "Load more",
    "search.results": "Results",
    "search.filters": "Filters",
    "search.sort": "Sort",
    "search.compare": "Compare",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Manage your offers, requests and matches",
    "dashboard.activeMatches": "Active Matches",
    "dashboard.completed": "Completed",
    "dashboard.myOffers": "My Offers",
    "dashboard.myRequests": "My Requests",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your account and preferences",
    "settings.profile": "Profile",
    "settings.notifications": "Notifications",
    "settings.security": "Security",
    "settings.language": "Language",

    // Misc
    "insurance.title": "Insurance & Protection",
    "disputes.title": "File a dispute",
    "footer.rights": "All rights reserved.",
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "de",
  setLocale: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("de");

  useEffect(() => {
    const saved = localStorage.getItem("luggagex-locale") as Locale | null;
    if (saved && (saved === "de" || saved === "en")) {
      setLocaleState(saved);
    }
  }, []);

  function setLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    localStorage.setItem("luggagex-locale", newLocale);
  }

  function t(key: string): string {
    return translations[locale][key] || translations.de[key] || key;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

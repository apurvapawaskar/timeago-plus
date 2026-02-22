import type { TimeAgoLabels } from "./core";

type LocalePack = {
  short: TimeAgoLabels;
  long: TimeAgoLabels;
};

const en: LocalePack = {
  short: {
    justNow: "just now",
    seconds: "s",
    minutes: "m",
    hours: "h",
    days: "d",
    months: "mo",
    years: "y",
    futurePrefix: "in ",
    pastSuffix: " ago",
  },
  long: {
    justNow: "just now",
    second: "second",
    seconds: "seconds",
    minute: "minute",
    minutes: "minutes",
    hour: "hour",
    hours: "hours",
    day: "day",
    days: "days",
    month: "month",
    months: "months",
    year: "year",
    years: "years",
    futurePrefix: "in ",
    pastSuffix: " ago",
  },
};

const fr: LocalePack = {
  short: {
    justNow: "à l'instant",
    seconds: "s",
    minutes: "min",
    hours: "h",
    days: "j",
    months: "mo",
    years: "a",
    futurePrefix: "dans ",
    pastSuffix: " plus tôt",
  },
  long: {
    justNow: "à l'instant",
    second: "seconde",
    seconds: "secondes",
    minute: "minute",
    minutes: "minutes",
    hour: "heure",
    hours: "heures",
    day: "jour",
    days: "jours",
    month: "mois",
    months: "mois",
    year: "an",
    years: "ans",
    futurePrefix: "dans ",
    pastSuffix: " plus tôt",
  },
};

const es: LocalePack = {
  short: {
    justNow: "justo ahora",
    seconds: "s",
    minutes: "min",
    hours: "h",
    days: "d",
    months: "mo",
    years: "a",
    futurePrefix: "en ",
    pastSuffix: " atrás",
  },
  long: {
    justNow: "justo ahora",
    second: "segundo",
    seconds: "segundos",
    minute: "minuto",
    minutes: "minutos",
    hour: "hora",
    hours: "horas",
    day: "día",
    days: "días",
    month: "mes",
    months: "meses",
    year: "año",
    years: "años",
    futurePrefix: "en ",
    pastSuffix: " atrás",
  },
};

export const BUILTIN_LOCALES: Record<string, LocalePack> = { en, fr, es };

export function getLocaleLabels(locale: string, short: boolean): TimeAgoLabels {
  const normalized = (locale || "en").toLowerCase();
  const baseTag = normalized.split(/[-_]/)[0] || "en";
  const pack = BUILTIN_LOCALES[normalized] ?? BUILTIN_LOCALES[baseTag] ?? BUILTIN_LOCALES.en;
  return short ? pack.short : pack.long;
}


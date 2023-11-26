import { WebsocketMessageType } from "@/enum";
import { Item } from "@/types/sessionList";

export const sortBySortOrder = (a: Item, b: Item) => {
  //@ts-ignore
  const isDisabledComparison = a.isDisabled - b.isDisabled;
  if (isDisabledComparison === 0) {
    return a.sortOrder - b.sortOrder;
  }
  return isDisabledComparison;
};

export const scrollToBottomWithKeyboardAdjustment = () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  const keyboardHeight = 200;

  const adjustedScrollTop = Math.max(
    scrollHeight - windowHeight + keyboardHeight,
    0
  );

  window.scrollBy({
    top: adjustedScrollTop - window.scrollY,
    behavior: "smooth",
  });
};

export const convertBlobToJSON = async (blob: Blob) => {
  try {
    const jsonString = (await blobToString(blob)) as string;
    const jsonData = JSON.parse(jsonString);
    return jsonData;
  } catch (error) {
    console.error("Error parsing received JSON:", error);
  }
};

const blobToString = (blob: Blob): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsText(blob);
  });
};

export function constructWebsocketPayloadMsg<T>(
  type: WebsocketMessageType,
  data: T
) {
  return JSON.stringify({
    type,
    data,
  });
}

export function generateRandomName(): string {
  const malePrefixes: string[] = [
    "Zielony",
    "Szybki",
    "Magiczny",
    "Nowoczesny",
    "Super",
    "Dynamiczny",
    "Fantastyczny",
    "Innowacyjny",
    "Ciekawy",
  ];
  const maleSuffixes: string[] = [
    "Zestaw",
    "Katalog",
    "Spis",
    "Indeks",
    "Rejestr",
    "Zbiór",
  ];

  const femalePrefixes: string[] = [
    "Zielona",
    "Szybka",
    "Magiczna",
    "Nowoczesna",
    "Super",
    "Dynamiczna",
    "Fantastyczna",
    "Innowacyjna",
    "Ciekawa",
  ];
  const femaleSuffixes: string[] = [
    "Skarbnica",
    "Lista",
    "Kolekcja",
    "Księga",
    "Książka",
  ];

  const isMale = Math.random() < 0.5; // 50% chance for male, 50% chance for female
  const prefixes = isMale ? malePrefixes : femalePrefixes;
  const suffixes = isMale ? maleSuffixes : femaleSuffixes;

  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  return `${randomPrefix} ${randomSuffix}`;
}

export const generateSingularOrPlural = (connectionCount: number) => {
  return connectionCount === 0 ? "osób" : connectionCount === 1 ? "osoba" : "osoby";
}
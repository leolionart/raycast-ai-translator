import { getPreferenceValues } from "@raycast/api";
import fetch from "node-fetch";

// Types
export interface Preferences {
  apiKey: string;
  apiURL: string;
  model?: string;
  primaryLanguage?: string;
  secondaryLanguage?: string;
}

export interface TranslatorConfig {
  apiKey: string;
  apiURL: string;
  model: string;
}

export interface TranslationResult {
  detectedLanguage: string;
  targetLanguage: string;
  translatedText: string;
  originalText: string;
}

// Supported languages
export const LANGUAGES = {
  AUTO: "auto",
  VIETNAMESE: "Vietnamese",
  ENGLISH: "English",
  CHINESE: "Chinese",
  JAPANESE: "Japanese",
  KOREAN: "Korean",
  FRENCH: "French",
  GERMAN: "German",
  SPANISH: "Spanish",
} as const;

export type LanguageCode = (typeof LANGUAGES)[keyof typeof LANGUAGES];

// Language options for dropdowns
export const SOURCE_LANGUAGE_OPTIONS = [
  { value: LANGUAGES.AUTO, title: "🔍 Auto-detect" },
  { value: LANGUAGES.VIETNAMESE, title: "🇻🇳 Vietnamese" },
  { value: LANGUAGES.ENGLISH, title: "🇺🇸 English" },
  { value: LANGUAGES.CHINESE, title: "🇨🇳 Chinese" },
  { value: LANGUAGES.JAPANESE, title: "🇯🇵 Japanese" },
  { value: LANGUAGES.KOREAN, title: "🇰🇷 Korean" },
  { value: LANGUAGES.FRENCH, title: "🇫🇷 French" },
  { value: LANGUAGES.GERMAN, title: "🇩🇪 German" },
  { value: LANGUAGES.SPANISH, title: "🇪🇸 Spanish" },
];

export const TARGET_LANGUAGE_OPTIONS = [
  { value: LANGUAGES.AUTO, title: "🔄 Smart (Vi ↔ En)" },
  { value: LANGUAGES.VIETNAMESE, title: "🇻🇳 Vietnamese" },
  { value: LANGUAGES.ENGLISH, title: "🇺🇸 English" },
  { value: LANGUAGES.CHINESE, title: "🇨🇳 Chinese" },
  { value: LANGUAGES.JAPANESE, title: "🇯🇵 Japanese" },
  { value: LANGUAGES.KOREAN, title: "🇰🇷 Korean" },
  { value: LANGUAGES.FRENCH, title: "🇫🇷 French" },
  { value: LANGUAGES.GERMAN, title: "🇩🇪 German" },
  { value: LANGUAGES.SPANISH, title: "🇪🇸 Spanish" },
];

/**
 * Get translator configuration from preferences
 */
export function getTranslatorConfig(): TranslatorConfig {
  const preferences = getPreferenceValues<Preferences>();
  return {
    apiKey: preferences.apiKey,
    apiURL: preferences.apiURL,
    model: preferences.model || "gpt-3.5-turbo",
  };
}

/**
 * Get user's preferred languages from preferences
 */
export function getPreferredLanguages(): {
  primary: string;
  secondary: string;
} {
  const preferences = getPreferenceValues<Preferences>();
  return {
    primary: preferences.primaryLanguage || "Vietnamese",
    secondary: preferences.secondaryLanguage || "English",
  };
}

/**
 * Detect the language of input text using AI
 */
export async function detectLanguage(
  text: string,
  config: TranslatorConfig,
): Promise<string> {
  const response = await fetch(config.apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: "system",
          content:
            "You are a language detection assistant. Respond with ONLY the language name in English (e.g., 'Vietnamese', 'English', 'French'). No other text.",
        },
        {
          role: "user",
          content: `Detect the language of this text: "${text}"`,
        },
      ],
      temperature: 0,
    }),
  });

  const json = (await response.json()) as {
    choices?: Array<{ message: { content: string } }>;
  };

  if (json.choices && json.choices.length > 0) {
    return json.choices[0].message.content.trim();
  }

  throw new Error("Failed to detect language");
}

/**
 * Determine target language based on detected language and preferences
 */
export function determineTargetLanguage(
  detected: string,
  primary: string,
  secondary: string,
): string {
  const normalizedDetected = detected.toLowerCase();
  const normalizedPrimary = primary.toLowerCase();
  const normalizedSecondary = secondary.toLowerCase();

  // If input is in primary language, translate to secondary
  if (
    normalizedDetected.includes(normalizedPrimary) ||
    normalizedPrimary.includes(normalizedDetected)
  ) {
    return secondary;
  }

  // If input is in secondary language, translate to primary
  if (
    normalizedDetected.includes(normalizedSecondary) ||
    normalizedSecondary.includes(normalizedDetected)
  ) {
    return primary;
  }

  // For any other language, translate to primary language
  return primary;
}

/**
 * Translate text to target language using AI
 */
export async function translateText(
  text: string,
  targetLang: string,
  config: TranslatorConfig,
): Promise<string> {
  const response = await fetch(config.apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the given text to ${targetLang}. Provide ONLY the translation, no explanations or additional text.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    }),
  });

  const json = (await response.json()) as {
    choices?: Array<{ message: { content: string } }>;
  };

  if (json.choices && json.choices.length > 0) {
    return json.choices[0].message.content.trim();
  }

  throw new Error("Failed to translate text");
}

/**
 * Smart translate: detect language, determine target, and translate
 */
export async function smartTranslate(
  text: string,
  config: TranslatorConfig,
  options?: {
    sourceLanguage?: string;
    targetLanguage?: string;
  },
): Promise<TranslationResult> {
  const { primary, secondary } = getPreferredLanguages();

  // Detect or use specified source language
  let detectedLanguage: string;
  if (options?.sourceLanguage && options.sourceLanguage !== LANGUAGES.AUTO) {
    detectedLanguage = options.sourceLanguage;
  } else {
    detectedLanguage = await detectLanguage(text, config);
  }

  // Determine or use specified target language
  let targetLanguage: string;
  if (options?.targetLanguage && options.targetLanguage !== LANGUAGES.AUTO) {
    targetLanguage = options.targetLanguage;
  } else {
    targetLanguage = determineTargetLanguage(
      detectedLanguage,
      primary,
      secondary,
    );
  }

  // Translate
  const translatedText = await translateText(text, targetLanguage, config);

  return {
    detectedLanguage,
    targetLanguage,
    translatedText,
    originalText: text,
  };
}

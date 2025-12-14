/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** API Key - Your API key for the translation service. */
  "apiKey": string,
  /** API URL - The base URL of the translation API. */
  "apiURL": string,
  /** AI Model - The AI model to use for translation. */
  "model": string,
  /** Primary Language - Your primary language (e.g., Vietnamese, English, Chinese). */
  "primaryLanguage": string,
  /** Secondary Language - Your secondary language for translation. */
  "secondaryLanguage": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `translate-preview` command */
  export type TranslatePreview = ExtensionPreferences & {}
  /** Preferences accessible in the `index` command */
  export type Index = ExtensionPreferences & {}
  /** Preferences accessible in the `quick-translate` command */
  export type QuickTranslate = ExtensionPreferences & {}
  /** Preferences accessible in the `translate-selection` command */
  export type TranslateSelection = ExtensionPreferences & {}
  /** Preferences accessible in the `translation-history` command */
  export type TranslationHistory = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `translate-preview` command */
  export type TranslatePreview = {}
  /** Arguments passed to the `index` command */
  export type Index = {}
  /** Arguments passed to the `quick-translate` command */
  export type QuickTranslate = {}
  /** Arguments passed to the `translate-selection` command */
  export type TranslateSelection = {}
  /** Arguments passed to the `translation-history` command */
  export type TranslationHistory = {}
}


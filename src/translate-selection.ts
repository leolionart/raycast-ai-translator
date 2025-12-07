import {
  getSelectedText,
  showToast,
  Toast,
  showHUD,
  popToRoot,
  Clipboard,
} from "@raycast/api";
import { getTranslatorConfig, smartTranslate } from "./translator";

export default async function Command() {
  try {
    // Get selected text
    let selectedText: string;
    try {
      selectedText = await getSelectedText();
    } catch {
      await showToast({
        style: Toast.Style.Failure,
        title: "No Selection",
        message: "Please select some text first",
      });
      return;
    }

    if (!selectedText || selectedText.trim() === "") {
      await showToast({
        style: Toast.Style.Failure,
        title: "Empty Selection",
        message: "Please select some text first",
      });
      return;
    }

    // Get translator config
    const config = getTranslatorConfig();

    if (!config.apiKey || !config.apiURL) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Configuration Error",
        message: "Please configure API Key and URL in preferences",
      });
      return;
    }

    // Show translating toast
    await showToast({
      style: Toast.Style.Animated,
      title: "Translating selection...",
      message:
        selectedText.substring(0, 50) + (selectedText.length > 50 ? "..." : ""),
    });

    // Smart translate
    const result = await smartTranslate(selectedText.trim(), config);

    // Paste result to replace selection
    await Clipboard.paste(result.translatedText);

    // Show success HUD
    await showHUD(`✓ ${result.detectedLanguage} → ${result.targetLanguage}`);

    // Close Raycast
    await popToRoot();
  } catch (error) {
    console.error("Translate selection error:", error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Translation Failed",
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}

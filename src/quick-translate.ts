import { Clipboard, showToast, Toast, popToRoot } from "@raycast/api";
import { getTranslatorConfig, smartTranslate } from "./translator";

export default async function Command() {
  try {
    // Read text from clipboard
    const clipboardText = await Clipboard.readText();

    if (!clipboardText || clipboardText.trim() === "") {
      await showToast({
        style: Toast.Style.Failure,
        title: "Clipboard Empty",
        message: "Please copy some text first",
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
      title: "Translating...",
      message:
        clipboardText.substring(0, 50) +
        (clipboardText.length > 50 ? "..." : ""),
    });

    // Smart translate
    const result = await smartTranslate(clipboardText.trim(), config);

    // Show result in toast
    await showToast({
      style: Toast.Style.Success,
      title: "Translation Result",
      message: result.translatedText,
    });
    await popToRoot();
  } catch (error) {
    console.error("Quick translate error:", error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Translation Failed",
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}

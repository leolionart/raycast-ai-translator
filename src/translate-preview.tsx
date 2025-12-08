import React, { useState, useEffect } from "react";
import {
  List,
  ActionPanel,
  Action,
  Clipboard,
  showToast,
  Toast,
  showHUD,
  popToRoot,
  Icon,
  LaunchProps,
} from "@raycast/api";
import {
  getTranslatorConfig,
  smartTranslate,
  LANGUAGES,
  TARGET_LANGUAGE_OPTIONS,
} from "./translator";

interface TranslatePreviewArguments {
  text?: string;
}

interface LaunchContext {
  text?: string;
}

export default function Command(
  props: LaunchProps<{
    arguments: TranslatePreviewArguments;
    launchContext: LaunchContext;
  }>,
) {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState<string>(
    LANGUAGES.AUTO,
  );

  // Auto-load clipboard or context and translate on mount
  useEffect(() => {
    async function loadAndTranslate() {
      try {
        // Priority 1: Launch Context (from Translate Selection command)
        if (props.launchContext?.text) {
          setInputText(props.launchContext.text);
          await handleTranslate(props.launchContext.text);
          return;
        }

        // Priority 2: Clipboard
        const clipboardText = await Clipboard.readText();
        if (clipboardText && clipboardText.trim()) {
          setInputText(clipboardText.trim());
          await handleTranslate(clipboardText.trim());
        }
      } catch (error) {
        console.error("Failed to read clipboard:", error);
      }
    }
    loadAndTranslate();
  }, []);

  async function handleTranslate(text?: string) {
    const textToTranslate = text || inputText;
    if (!textToTranslate.trim()) {
      return;
    }

    const config = getTranslatorConfig();

    if (!config.apiKey || !config.apiURL) {
      showToast({
        style: Toast.Style.Failure,
        title: "Configuration Error",
        message: "Please configure API Key and URL in preferences.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await smartTranslate(textToTranslate.trim(), config, {
        sourceLanguage: LANGUAGES.AUTO,
        targetLanguage: selectedTargetLanguage,
      });

      setDetectedLanguage(result.detectedLanguage);
      setTargetLanguage(result.targetLanguage);
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Translation Failed",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePaste() {
    if (!translatedText) {
      showToast({
        style: Toast.Style.Failure,
        title: "Nothing to Paste",
        message: "Please wait for translation to complete.",
      });
      return;
    }

    await Clipboard.paste(translatedText);
    await showHUD(`✓ Pasted: ${detectedLanguage} → ${targetLanguage}`);
    await popToRoot();
  }

  async function handleCopy() {
    if (!translatedText) {
      showToast({
        style: Toast.Style.Failure,
        title: "Nothing to Copy",
      });
      return;
    }

    await Clipboard.copy(translatedText);
    await showHUD("✓ Copied to clipboard");
  }

  // Format markdown for detail view
  const detailMarkdown = translatedText
    ? `## Translation Result

**${detectedLanguage}** → **${targetLanguage}**

---

### Original
${inputText}

---

### Translation
${translatedText}`
    : inputText
      ? `## Translating...

**Original text:**
${inputText}`
      : `## Ready

Waiting for clipboard content or enter text to search...`;

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Enter text to translate..."
      onSearchTextChange={(text) => {
        setInputText(text);
        if (text.trim()) {
          // Debounce translation
          const timer = setTimeout(() => handleTranslate(text), 500);
          return () => clearTimeout(timer);
        }
      }}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Target Language"
          value={selectedTargetLanguage}
          onChange={setSelectedTargetLanguage}
        >
          <List.Dropdown.Section title="Target Language">
            {TARGET_LANGUAGE_OPTIONS.map((option) => (
              <List.Dropdown.Item
                key={option.value}
                value={option.value}
                title={option.title}
              />
            ))}
          </List.Dropdown.Section>
        </List.Dropdown>
      }
      isShowingDetail={true}
    >
      {translatedText ? (
        <List.Item
          title={
            translatedText.length > 60
              ? translatedText.substring(0, 60) + "..."
              : translatedText
          }
          subtitle={`${detectedLanguage} → ${targetLanguage}`}
          icon={Icon.Globe}
          detail={<List.Item.Detail markdown={detailMarkdown} />}
          actions={
            <ActionPanel>
              <ActionPanel.Section title="Actions">
                <Action
                  title="Paste to Active App"
                  icon={Icon.Clipboard}
                  onAction={handlePaste}
                />
                <Action
                  title="Copy Translation"
                  icon={Icon.CopyClipboard}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                  onAction={handleCopy}
                />
              </ActionPanel.Section>
              <ActionPanel.Section title="Re-translate">
                <Action
                  title="Translate Again"
                  icon={Icon.ArrowClockwise}
                  shortcut={{ modifiers: ["cmd"], key: "r" }}
                  onAction={() => handleTranslate()}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ) : inputText ? (
        <List.Item
          title="Translating..."
          subtitle={
            inputText.length > 40
              ? inputText.substring(0, 40) + "..."
              : inputText
          }
          icon={Icon.Clock}
          detail={<List.Item.Detail markdown={detailMarkdown} />}
        />
      ) : (
        <List.EmptyView
          title="AI Translator"
          description="Type text to translate or copy something to clipboard first"
          icon={Icon.Globe}
        />
      )}
    </List>
  );
}

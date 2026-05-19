export const MAX_CHAT_MESSAGE_CHARS = 1000;

export type MessageTooLongSplit = {
  splitIndex: number;
  endSnippet: string;
  startOverflowSnippet: string;
};

const SNIPPET_WORD_COUNT = 4;

function lastWords(text: string, count: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const slice = words.slice(-count);
  const joined = slice.join(' ');
  return words.length > count ? `…${joined}` : joined;
}

function firstWords(text: string, count: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const slice = words.slice(0, count);
  const joined = slice.join(' ');
  return words.length > count ? `${joined}…` : joined;
}

/** Word-safe split point for messages over the character limit. */
export function messageTooLongSplit(
  text: string,
  max = MAX_CHAT_MESSAGE_CHARS
): MessageTooLongSplit | null {
  if (text.length <= max) return null;

  const head = text.slice(0, max);
  const lastSpace = head.lastIndexOf(' ');
  const splitIndex = lastSpace > max * 0.75 ? lastSpace : max;

  const fits = text.slice(0, splitIndex).trimEnd();
  const overflow = text.slice(splitIndex).trimStart();

  return {
    splitIndex,
    endSnippet: lastWords(fits, SNIPPET_WORD_COUNT),
    startOverflowSnippet: firstWords(overflow, SNIPPET_WORD_COUNT),
  };
}

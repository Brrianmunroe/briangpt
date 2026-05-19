/** Stable codes returned by POST /api/chat and used client-side for copy mapping. */
export const CHAT_ERROR_CODE = {
  RATE_LIMIT: 'RATE_LIMIT',
  MESSAGE_TOO_LONG: 'MESSAGE_TOO_LONG',
  THREAD_TOO_LONG: 'THREAD_TOO_LONG',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  OFFLINE: 'OFFLINE',
  INTERRUPTED: 'INTERRUPTED',
  FORBIDDEN: 'FORBIDDEN',
} as const;

export type ChatErrorCode = (typeof CHAT_ERROR_CODE)[keyof typeof CHAT_ERROR_CODE];

/** Visitor-facing API error strings (also used for message matching). */
export const CHAT_API_ERROR_MESSAGE = {
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  MESSAGE_TOO_LONG: 'A message exceeds the maximum length.',
  THREAD_TOO_LONG: 'Too many messages in this chat.',
  SERVICE_UNAVAILABLE: 'Something went wrong — please try again.',
} as const;

export const MAX_CHAT_MESSAGES = 50;

'use client';

import * as React from 'react';
import { ChatInput } from '@/components/chat-input';
import styles from './ChatInputGalleryDemo.module.css';

const SUBMITTED_TO_STREAMING_MS = 500;

export function ChatInputGalleryDemo() {
  const [value, setValue] = React.useState('');
  const [busyPhase, setBusyPhase] = React.useState<'none' | 'waiting' | 'streaming'>('none');
  const [log, setLog] = React.useState<string[]>([]);
  const lastSentRef = React.useRef('');
  const phaseTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (phaseTimeoutRef.current != null) clearTimeout(phaseTimeoutRef.current);
    };
  }, []);

  const requestInFlight = busyPhase !== 'none';

  const push = (line: string) => {
    setLog((prev) => [line, ...prev].slice(0, 6));
  };

  return (
    <div className={styles.wrap}>
      <ChatInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        streaming={requestInFlight}
        onSubmit={(v) => {
          push(`submit: ${v}`);
          lastSentRef.current = v;
          setValue('');
          setBusyPhase('waiting');
          if (phaseTimeoutRef.current != null) clearTimeout(phaseTimeoutRef.current);
          phaseTimeoutRef.current = setTimeout(() => {
            phaseTimeoutRef.current = null;
            setBusyPhase('streaming');
          }, SUBMITTED_TO_STREAMING_MS);
        }}
        onStop={() => {
          if (phaseTimeoutRef.current != null) {
            clearTimeout(phaseTimeoutRef.current);
            phaseTimeoutRef.current = null;
          }
          push('stop');
          setBusyPhase('none');
          setValue(lastSentRef.current);
        }}
      />
      <p className={styles.hint} role="status">
        {requestInFlight
          ? busyPhase === 'waiting'
            ? `Waiting for first tokens (${SUBMITTED_TO_STREAMING_MS}ms demo) — Stop is available.`
            : 'Streaming — Stop restores the message to the field.'
          : 'Enter sends; Shift+Enter newline.'}
      </p>
      {log.length > 0 ? (
        <ul className={styles.log}>
          {log.map((line, i) => (
            <li key={`${i}-${line}`}>{line}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

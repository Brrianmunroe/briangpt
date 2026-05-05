'use client';

import * as React from 'react';
import { ChatInput } from '@/components/chat-input';
import styles from './ChatInputGalleryDemo.module.css';

export function ChatInputGalleryDemo() {
  const [value, setValue] = React.useState('');
  const [streaming, setStreaming] = React.useState(false);
  const [log, setLog] = React.useState<string[]>([]);

  const push = (line: string) => {
    setLog((prev) => [line, ...prev].slice(0, 6));
  };

  return (
    <div className={styles.wrap}>
      <ChatInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        streaming={streaming}
        onSubmit={(v) => {
          push(`submit: ${v}`);
          setValue('');
          setStreaming(true);
        }}
        onStop={() => {
          push('stop');
          setStreaming(false);
        }}
      />
      <p className={styles.hint} role="status">
        {streaming ? 'Streaming — Stop clears streaming.' : 'Enter sends; Shift+Enter newline.'}
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

import { useEffect, useRef, useState } from 'react';

export interface CountdownResult {
  remaining: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

/**
 * Обратный отсчёт на totalSeconds от момента монтирования.
 * По истечении вызывается onExpire (один раз).
 */
export const useCountdown = (totalSeconds: number, onExpire?: () => void): CountdownResult => {
  const [remaining, setRemaining] = useState(totalSeconds);
  const deadlineRef = useRef<number>(Date.now() + totalSeconds * 1000);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        window.clearInterval(interval);
        onExpireRef.current?.();
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return {
    remaining,
    minutes,
    seconds,
    formatted: `${minutes}:${String(seconds).padStart(2, '0')}`,
  };
};

import { useEffect, useRef, useState } from 'react';

export interface CountdownResult {
  remaining: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

/**
 * Обратный отсчёт от АБСОЛЮТНОГО дедлайна (epoch ms).
 * По истечении вызывается onExpire (один раз).
 * Принимает именно deadline, а не длительность, чтобы перезагрузка страницы
 * не «продлевала» таймер (см. TakeTestTaker + attemptStorage).
 */
export const useCountdown = (deadline: number, onExpire?: () => void): CountdownResult => {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.ceil((deadline - Date.now()) / 1000)),
  );
  const deadlineRef = useRef<number>(deadline);
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

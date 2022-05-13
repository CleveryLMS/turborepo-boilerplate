import { useState, useEffect } from 'react';

export const DEFAULT_EVENTS = [
  'mousemove',
  'keydown',
  'wheel',
  'DOMMouseScroll',
  'mousewheel',
  'mousedown',
  'touchstart',
  'touchmove',
  'MSPointerDown',
  'MSPointerMove',
  'visibilitychange',
];

type SessionTimeoutProps = {
  timeout?: number;
  onAction?: () => void;
  onIdle?: () => void;
  events?: string[];
};

export function useSessionTimeout({
  timeout = 60 * 10,
  onAction = () => undefined,
  onIdle = () => undefined,
  events = DEFAULT_EVENTS,
}: SessionTimeoutProps) {
  const [timer, setTimer] = useState<number>(timeout);
  const [lastActive, setLastActive] = useState<number>(new Date().getTime());

  const [isIdle, setIsIdle] = useState<boolean>(false);

  useEffect(() => {
    if (timer > 0) {
      if (isIdle) {
        onAction();
        setIsIdle(false);
      }

      /** Cada segundo que pasa, bajamos 1 al temporizador */
      const timerInterval = setInterval(() => setTimer(timer - 1), 1000);

      return () => clearInterval(timerInterval);
    } else {
      setIsIdle(true);
      onIdle();
    }
  }, [timer]);

  useEffect(() => {
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => events.forEach((event) => window.removeEventListener(event, resetTimer));
  }, []);

  const resetTimer = () => {
    setLastActive(new Date().getTime());
    setTimer(timeout);
  };

  const getLasttimeActive = () => lastActive;

  return { timer, getLasttimeActive };
}

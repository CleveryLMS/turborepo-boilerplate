import { useState, useEffect } from 'react';

/**
 * Hook custom para obtener un temporizador dado un número de minutos (mins) concreto.
 *
 * @param mins Numero de minutos totales del temporizador
 * @returns progress: number (% completado de 0 a 100)
 *  minutes: string (minutos del temporizador mm:ss)
 *  seconds: string (segundos del temporizador mm:ss)
 *  secs: number (segundos totales restantes)
 *  decrementSecs: Function (Función para decrementar segundos del contador de forma externa)
 */
export function useCountdown(mins: number): [number, string, string, number, (s: number) => void] {
  const [secs, decrement] = useState<number>(mins * 60);
  const [progress, increment] = useState<number>(0);

  useEffect(() => {
    if (secs > 0) {
      const progressLevel = setInterval(() => {
        increment(progress + 100 / (mins * 60));
        decrement(secs - 1);
      }, 1000);

      return () => clearInterval(progressLevel);
    }
  }, [progress, secs, mins]);

  const min = parseInt(secs / 60 + '', 10);
  const sec = parseInt((secs % 60) + '', 10);

  const minutes: string = min < 10 ? '0' + min : min + '';
  const seconds: string = sec < 10 ? '0' + sec : sec + '';

  const decrementSecs = (s: number) => {
    decrement((se) => Math.max(0, se - s));
    increment((p) => p + (100 * s) / (mins * 60));
  };

  return [progress, minutes, seconds, secs, decrementSecs];
}

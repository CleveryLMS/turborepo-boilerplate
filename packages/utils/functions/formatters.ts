export const fmtMnts = (min = 0, showRes = true) =>
  min
    ? min < 60
      ? `${min}min`
      : min === 60
      ? '1h'
      : (min - (min %= 60)) / 60 + (9 < min ? 'h ' : 'h') + (showRes ? min + 'min' : '')
    : '-';

export const fmtSnds = (d = 0) => {
  if (d === undefined) return '-';

  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h > 0 ? h + ':' : '';
  const mDisplay = m > -1 ? (m < 10 ? '0' : '') + m + ':' : '';
  const sDisplay = s > 0 ? (s < 10 ? '0' : '') + s : '00';

  return hDisplay + mDisplay + sDisplay;
};

export const fmtHours = (h = 0) => {
  if (!h) return '-';

  const Days = Math.floor(h / 24);
  const Remainder = h % 24;
  const Hours = Math.floor(Remainder);
  const Minutes = Math.floor(60 * (Remainder - Hours));

  return (
    (Days > 0 ? `${Days} día${Days === 1 ? ' ' : 's '}` : '') +
    (Hours > 0 ? `${Hours} hora${Hours === 1 ? ' ' : 's '}` : '') +
    (Minutes > 0 ? `${Minutes} minuto${Minutes === 1 ? ' ' : 's '}` : '')
  );
};

export const stringToNumArray = (str: string) =>
  str
    ? str
        .trim()
        .replace('[', '')
        .replace(']', '')
        .split(',')
        .filter((e) => e !== '')
        .map((e) => parseInt(e))
    : [];

export const fmtTiempoTotal = (seconds = 0, showSeconds = false) => {
  const days = Math.floor(seconds / (3600 * 24)) || 0;
  seconds -= days * 3600 * 24;

  const hrs = Math.floor(seconds / 3600);
  seconds -= hrs * 3600;

  const mnts = Math.floor(seconds / 60);
  seconds -= mnts * 60;

  return (
    (hrs > 0 ? `${hrs + days * 24}h ` : '') +
    (mnts > 0 ? `${mnts}min ` : '') +
    (seconds > 0 && showSeconds ? `${seconds}s ` : '')
  );
};

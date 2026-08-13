/** Базовый URL API. В dev идёт через Vite proxy (/api -> localhost:5001). */
export const API_URL: string = import.meta.env.VITE_API_URL ?? '/api';

/** Режим разработки. */
export const IS_DEV: boolean = import.meta.env.DEV && import.meta.env.MODE === 'development';

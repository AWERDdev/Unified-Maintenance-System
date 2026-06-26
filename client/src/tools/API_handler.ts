const IS_LOCAL = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export const BASE_URL = IS_LOCAL
  ? 'http://localhost:3500'
  : 'https://unifiedmaintenanceescalationsystem.vercel.app';
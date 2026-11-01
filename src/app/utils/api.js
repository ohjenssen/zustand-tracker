// Settes i .env.local, f.eks. NEXT_PUBLIC_API_URL=http://localhost:8000/api
// Uten variabelen brukes produksjons-API-et.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foodtracker-api.oskarjenssen.com/api';

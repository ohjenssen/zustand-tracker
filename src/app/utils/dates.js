// Date -> "YYYY-MM-DD" i brukerens lokale tid (toISOString() gir UTC og kan bli feil dag)
export function toLocalDateString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// "YYYY-MM-DD" + nåværende lokale klokkeslett -> ISO-tidspunkt med tidssone for API-et.
// Returnerer null for ugyldig input (f.eks. strengen "null" fra URL-en).
export function dateToTimestamp(dateString) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString || '')) return null;
    const [y, m, d] = dateString.split('-').map(Number);
    const now = new Date();
    return new Date(y, m - 1, d, now.getHours(), now.getMinutes(), now.getSeconds()).toISOString();
}

import { Course, User } from './models/models';

export const SERVER_ORIGIN = 'http://localhost:5000';
export const API_BASE = `${SERVER_ORIGIN}/api/v1`;

export function capitalizeWords(str: string | undefined | null): string {
  return String(str ?? '').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

export function fullName(user: Partial<User> | null | undefined): string {
  if (!user) return '';
  return [user.firstName, user.lastName].filter(Boolean).join(' ');
}

export function initials(name = ''): string {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

/** Build the real URL to an uploaded file, or null if there isn't a real one. */
export function uploadedFileUrl(folder: 'users' | 'courses', filename?: string | null): string | null {
  if (!filename || filename === 'default-user.webp') return null;
  return `${SERVER_ORIGIN}/uploads/${folder}/${filename}`;
}

export const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced', 'expert'];

export function levelFilledDots(level: string | undefined): number {
  const idx = LEVEL_ORDER.indexOf(String(level || '').toLowerCase());
  return idx === -1 ? 1 : Math.min(idx + 1, 3);
}

export interface CategoryColors { bg: string; fg: string; }

export const CATEGORY_PALETTE: CategoryColors[] = [
  { bg: '#E3EAE0', fg: '#20402D' },
  { bg: '#F3E1CD', fg: '#8A4520' },
  { bg: '#E4EFEC', fg: '#2B6659' },
  { bg: '#F6E1DD', fg: '#96382B' },
  { bg: '#E7E6DA', fg: '#4B4636' },
  { bg: '#EFE3EE', fg: '#6C3D66' },
];

export function categoryHash(category: string | undefined | null): number {
  let hash = 0;
  const s = String(category || '');
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return hash % CATEGORY_PALETTE.length;
}

export function categoryColors(category: string | undefined | null): CategoryColors {
  return CATEGORY_PALETTE[categoryHash(category)];
}

const CATEGORY_ICON_PATHS: Record<string, string> = {
  'cyber security': '<path d="M12 2l8 3v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V5l8-3z"/><path d="M9 12l2 2 4-4"/>',
  backend: '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><circle cx="7" cy="7" r=".6" fill="currentColor" stroke="none"/><circle cx="7" cy="17" r=".6" fill="currentColor" stroke="none"/>',
  database: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5V18c0 1.7 3.6 3 8 3s8-1.3 8-3V5.5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  frontend: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 14l-2 2 2 2M13 14l2 2-2 2"/>',
  programming: '<path d="M8 9l-4 4 4 4M16 9l4 4-4 4M13 6l-2 14"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
  design: '<circle cx="13.5" cy="6.5" r="2.5"/><path d="M17.5 10.5 L7 21H3v-4L13.5 6.5"/>',
};
const DEFAULT_ICON_PATH = '<path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/>';

export function categoryIconPath(category: string | undefined | null): string {
  const key = String(category || '').toLowerCase();
  return CATEGORY_ICON_PATHS[key] || DEFAULT_ICON_PATH;
}

export function categoryIconSvg(category: string | undefined | null): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${categoryIconPath(category)}</svg>`;
}

/** Resolve a course id whether it's a populated Course object or a raw ObjectId string. */
export function courseIdOf(courseOrId: string | Course | null | undefined): string | null {
  if (!courseOrId) return null;
  return typeof courseOrId === 'object' ? courseOrId._id : courseOrId;
}

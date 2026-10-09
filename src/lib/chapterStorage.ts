import { Chapter, ChapterStatus } from '@/types/chapter';

export const STORAGE_KEY = 'english-course-chapters';
export const BACKUP_PREFIX = 'english-course-chapters.corrupt-';

const STATUSES: ChapterStatus[] = ['to-do', 'in-progress', 'completed'];

export function isValidChapter(v: unknown): v is Chapter {
  if (!v || typeof v !== 'object') return false;
  const c = v as Record<string, unknown>;
  return (
    ['id', 'title', 'skill', 'objective', 'content', 'exercises', 'notes'].every(
      k => typeof c[k] === 'string'
    ) &&
    typeof c.order === 'number' &&
    STATUSES.includes(c.status as ChapterStatus)
  );
}

export function isValidChapterList(v: unknown): v is Chapter[] {
  return Array.isArray(v) && v.every(isValidChapter);
}

export type LoadResult =
  | { state: 'ok'; chapters: Chapter[] }
  | { state: 'empty'; chapters: Chapter[] }
  | { state: 'corrupted'; chapters: Chapter[]; backupKey: string | null };

/**
 * Reads chapters from storage. Never throws and never deletes the stored value.
 * If corrupted, the raw value is copied to a backup key and seed data is used
 * in memory only (the original key is left untouched until the user edits).
 */
export function loadChapters(storage: Storage, seed: Chapter[]): LoadResult {
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { state: 'corrupted', chapters: clone(seed), backupKey: null };
  }
  if (raw === null) return { state: 'empty', chapters: clone(seed) };
  try {
    const parsed = JSON.parse(raw);
    if (isValidChapterList(parsed)) return { state: 'ok', chapters: parsed };
  } catch {
    /* fall through */
  }
  let backupKey: string | null = BACKUP_PREFIX + Date.now();
  try {
    storage.setItem(backupKey, raw);
  } catch {
    backupKey = null;
  }
  return { state: 'corrupted', chapters: clone(seed), backupKey };
}

export function saveChapters(storage: Storage, chapters: Chapter[]): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(chapters));
    return true;
  } catch {
    return false;
  }
}

export const applyStatus = (list: Chapter[], id: string, status: ChapterStatus) =>
  list.map(ch => (ch.id === id ? { ...ch, status } : ch));

export const applyNotes = (list: Chapter[], id: string, notes: string) =>
  list.map(ch => (ch.id === id ? { ...ch, notes } : ch));

export function computeProgress(list: Chapter[]) {
  const total = list.length;
  const completed = list.filter(c => c.status === 'completed').length;
  const inProgress = list.filter(c => c.status === 'in-progress').length;
  const toDo = list.filter(c => c.status === 'to-do').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, inProgress, toDo, percentage };
}

export function buildExport(chapters: Chapter[], storage?: Storage) {
  let rawStored: string | null = null;
  try {
    rawStored = storage?.getItem(STORAGE_KEY) ?? null;
  } catch {
    /* ignore */
  }
  return JSON.stringify(
    { app: 'fluent-path', version: 1, exportedAt: new Date().toISOString(), storageKey: STORAGE_KEY, chapters, rawStored },
    null,
    2
  );
}

export function downloadExport(chapters: Chapter[]) {
  const blob = new Blob([buildExport(chapters, localStorage)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fluent-path-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const clone = (c: Chapter[]) => c.map(x => ({ ...x }));

export const PRE_IMPORT_PREFIX = 'english-course-chapters.pre-import-';

export type ParseImportResult =
  | { ok: true; chapters: Chapter[] }
  | { ok: false; error: string };

/** Strictly validates a file produced by buildExport. Never throws. */
export function parseImport(text: string): ParseImportResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: 'The file is not valid JSON.' };
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: 'The file is not a Fluent Path export.' };
  }
  const d = data as Record<string, unknown>;
  if (d.app !== 'fluent-path' || d.version !== 1) {
    return { ok: false, error: 'The file is not a Fluent Path export (version 1).' };
  }
  if (!isValidChapterList(d.chapters) || d.chapters.length === 0) {
    return { ok: false, error: 'The chapters in this file are missing or invalid.' };
  }
  const ids = new Set(d.chapters.map(c => c.id));
  if (ids.size !== d.chapters.length) {
    return { ok: false, error: 'The file contains duplicate chapters.' };
  }
  return { ok: true, chapters: d.chapters.map(c => ({ ...c })) };
}

export type ImportResult =
  | { ok: true; backupKey: string | null }
  | { ok: false; error: string };

/**
 * Replaces stored chapters. The current raw value (if any) is copied to a
 * pre-import backup key first; if that backup fails, nothing is replaced.
 */
export function importChapters(storage: Storage, chapters: Chapter[]): ImportResult {
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { ok: false, error: 'Storage is unavailable. Nothing was changed.' };
  }
  let backupKey: string | null = null;
  if (raw !== null) {
    backupKey = PRE_IMPORT_PREFIX + Date.now();
    try {
      storage.setItem(backupKey, raw);
    } catch {
      return { ok: false, error: 'Could not back up current data. Nothing was changed.' };
    }
  }
  if (!saveChapters(storage, chapters)) {
    return { ok: false, error: 'Could not save imported data. Current data was kept.' };
  }
  return { ok: true, backupKey };
}

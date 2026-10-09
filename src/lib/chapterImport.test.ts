import { describe, it, expect, beforeEach } from 'vitest';
import { initialChapters } from '@/data/initialChapters';
import { STORAGE_KEY, PRE_IMPORT_PREFIX, buildExport, parseImport, importChapters } from './chapterStorage';

beforeEach(() => localStorage.clear());

describe('parseImport', () => {
  it('accepts a round-tripped export', () => {
    const r = parseImport(buildExport(initialChapters));
    expect(r.ok && r.chapters.length).toBe(5);
  });
  it.each([
    ['not json', '{oops'],
    ['array', '[]'],
    ['wrong app', JSON.stringify({ app: 'x', version: 1, chapters: initialChapters })],
    ['wrong version', JSON.stringify({ app: 'fluent-path', version: 2, chapters: initialChapters })],
    ['empty chapters', JSON.stringify({ app: 'fluent-path', version: 1, chapters: [] })],
    ['bad status', JSON.stringify({ app: 'fluent-path', version: 1, chapters: [{ ...initialChapters[0], status: 'done' }] })],
    ['duplicate ids', JSON.stringify({ app: 'fluent-path', version: 1, chapters: [initialChapters[0], initialChapters[0]] })],
  ])('rejects %s', (_, text) => {
    expect(parseImport(text).ok).toBe(false);
  });
});

describe('importChapters', () => {
  it('backs up current data before replacing', () => {
    localStorage.setItem(STORAGE_KEY, 'ORIGINAL');
    const next = initialChapters.map(c => ({ ...c, status: 'completed' as const }));
    const r = importChapters(localStorage, next);
    expect(r.ok).toBe(true);
    if (r.ok) expect(localStorage.getItem(r.backupKey!)).toBe('ORIGINAL');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(next);
  });
  it('changes nothing if the backup cannot be written', () => {
    const store: Record<string, string> = { [STORAGE_KEY]: 'ORIGINAL' };
    const fake = {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        if (k.startsWith(PRE_IMPORT_PREFIX)) throw new Error('quota');
        store[k] = v;
      },
    } as unknown as Storage;
    expect(importChapters(fake, initialChapters).ok).toBe(false);
    expect(store[STORAGE_KEY]).toBe('ORIGINAL');
  });
  it('fails safely when storage is unavailable', () => {
    const fake = { getItem: () => { throw new Error('denied'); } } as unknown as Storage;
    expect(importChapters(fake, initialChapters).ok).toBe(false);
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { initialChapters } from '@/data/initialChapters';
import {
  STORAGE_KEY, BACKUP_PREFIX, loadChapters, saveChapters, applyStatus,
  applyNotes, computeProgress, buildExport, isValidChapterList,
} from './chapterStorage';

beforeEach(() => localStorage.clear());

describe('computeProgress', () => {
  it('counts only completed chapters for percentage', () => {
    expect(computeProgress(initialChapters)).toEqual({
      total: 5, completed: 1, inProgress: 1, toDo: 3, percentage: 20,
    });
  });
  it('handles empty list', () => {
    expect(computeProgress([]).percentage).toBe(0);
  });
  it('reaches 100% when all completed', () => {
    const all = initialChapters.map(c => ({ ...c, status: 'completed' as const }));
    expect(computeProgress(all).percentage).toBe(100);
  });
});

describe('status / notes updates', () => {
  it('updates only target chapter status, immutably', () => {
    const out = applyStatus(initialChapters, '3', 'completed');
    expect(out.find(c => c.id === '3')!.status).toBe('completed');
    expect(initialChapters.find(c => c.id === '3')!.status).toBe('to-do');
    expect(out.filter(c => c.id !== '3')).toEqual(initialChapters.filter(c => c.id !== '3'));
  });
  it('updates notes and persists round-trip', () => {
    const out = applyNotes(initialChapters, '1', 'ma note');
    saveChapters(localStorage, out);
    const r = loadChapters(localStorage, initialChapters);
    expect(r.state).toBe('ok');
    expect(r.chapters.find(c => c.id === '1')!.notes).toBe('ma note');
  });
});

describe('corrupted data', () => {
  it.each([
    ['invalid JSON', '{not json'],
    ['not an array', '{"a":1}'],
    ['bad status', JSON.stringify([{ ...initialChapters[0], status: 'done' }])],
    ['missing field', JSON.stringify([{ id: '1' }])],
  ])('recovers from %s without crashing or deleting', (_l, raw) => {
    localStorage.setItem(STORAGE_KEY, raw);
    const r = loadChapters(localStorage, initialChapters);
    expect(r.state).toBe('corrupted');
    expect(r.chapters).toHaveLength(5);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw); // original untouched
    if (r.state === 'corrupted') {
      expect(r.backupKey!.startsWith(BACKUP_PREFIX)).toBe(true);
      expect(localStorage.getItem(r.backupKey!)).toBe(raw);
    }
  });
  it('empty storage yields seed', () => {
    expect(loadChapters(localStorage, initialChapters).state).toBe('empty');
  });
});

describe('non-regression', () => {
  it('keeps the five original chapters and storage key', () => {
    expect(STORAGE_KEY).toBe('english-course-chapters');
    expect(initialChapters.map(c => c.title)).toEqual([
      'Understanding Context in Conversations',
      'Expressing Opinions with Nuance',
      'Complex Sentence Structures',
      'Reading Academic Texts',
      'Formal vs. Informal Register',
    ]);
    expect(isValidChapterList(initialChapters)).toBe(true);
  });
  it('export contains chapters and raw stored value', () => {
    localStorage.setItem(STORAGE_KEY, 'raw-corrupt');
    const e = JSON.parse(buildExport(initialChapters, localStorage));
    expect(e.chapters).toHaveLength(5);
    expect(e.rawStored).toBe('raw-corrupt');
  });
});

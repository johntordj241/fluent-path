import { useState, useEffect, useCallback } from 'react';
import { Chapter, ChapterStatus } from '@/types/chapter';
import { initialChapters } from '@/data/initialChapters';
import {
  loadChapters,
  saveChapters,
  applyStatus,
  applyNotes,
  computeProgress,
  importChapters,
  ImportResult,
} from '@/lib/chapterStorage';

export function useChapters() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [corruptedBackupKey, setCorruptedBackupKey] = useState<string | null>(null);
  const [isCorrupted, setIsCorrupted] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    const result = loadChapters(localStorage, initialChapters);
    setChapters(result.chapters);
    if (result.state === 'empty' && !saveChapters(localStorage, result.chapters)) {
      setSaveFailed(true);
    }
    if (result.state === 'corrupted') {
      setIsCorrupted(true);
      setCorruptedBackupKey(result.backupKey);
      console.warn('[Fluent Path] Stored data invalid; raw copy kept at', result.backupKey);
    }
    setIsLoading(false);
  }, []);

  // While stored data is corrupted/unreadable, changes stay in memory only:
  // the stored value is never silently overwritten. Recovery = explicit import.
  const update = (fn: (prev: Chapter[]) => Chapter[]) =>
    setChapters(prev => {
      const updated = fn(prev);
      if (!isCorrupted && !saveChapters(localStorage, updated)) setSaveFailed(true);
      return updated;
    });

  const updateChapterStatus = (id: string, status: ChapterStatus) =>
    update(prev => applyStatus(prev, id, status));

  const updateChapterNotes = (id: string, notes: string) =>
    update(prev => applyNotes(prev, id, notes));

  const replaceAll = useCallback((next: Chapter[]): ImportResult => {
    const result = importChapters(localStorage, next);
    if (result.ok) {
      setChapters(next);
      setIsCorrupted(false);
      setSaveFailed(false);
    }
    return result;
  }, []);

  const getChapter = (id: string) => chapters.find(ch => ch.id === id);
  const getProgress = () => computeProgress(chapters);

  return {
    chapters: [...chapters].sort((a, b) => a.order - b.order),
    isLoading,
    isCorrupted,
    corruptedBackupKey,
    saveFailed,
    updateChapterStatus,
    updateChapterNotes,
    replaceAll,
    getChapter,
    getProgress,
  };
}

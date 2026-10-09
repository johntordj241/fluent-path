import { useState, useEffect } from 'react';
import { Chapter, ChapterStatus } from '@/types/chapter';
import { initialChapters } from '@/data/initialChapters';
import {
  loadChapters,
  saveChapters,
  applyStatus,
  applyNotes,
  computeProgress,
} from '@/lib/chapterStorage';

export function useChapters() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [corruptedBackupKey, setCorruptedBackupKey] = useState<string | null>(null);
  const [isCorrupted, setIsCorrupted] = useState(false);

  useEffect(() => {
    const result = loadChapters(localStorage, initialChapters);
    setChapters(result.chapters);
    if (result.state === 'empty') saveChapters(localStorage, result.chapters);
    if (result.state === 'corrupted') {
      setIsCorrupted(true);
      setCorruptedBackupKey(result.backupKey);
      console.warn('[Fluent Path] Stored data invalid; raw copy kept at', result.backupKey);
    }
    setIsLoading(false);
  }, []);

  const update = (fn: (prev: Chapter[]) => Chapter[]) =>
    setChapters(prev => {
      const updated = fn(prev);
      saveChapters(localStorage, updated);
      return updated;
    });

  const updateChapterStatus = (id: string, status: ChapterStatus) =>
    update(prev => applyStatus(prev, id, status));

  const updateChapterNotes = (id: string, notes: string) =>
    update(prev => applyNotes(prev, id, notes));

  const getChapter = (id: string) => chapters.find(ch => ch.id === id);
  const getProgress = () => computeProgress(chapters);

  return {
    chapters: [...chapters].sort((a, b) => a.order - b.order),
    isLoading,
    isCorrupted,
    corruptedBackupKey,
    updateChapterStatus,
    updateChapterNotes,
    getChapter,
    getProgress,
  };
}

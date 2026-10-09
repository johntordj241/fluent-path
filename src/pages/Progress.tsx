import { useChapters } from '@/hooks/useChapters';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { downloadExport, parseImport } from '@/lib/chapterStorage';
import { Chapter } from '@/types/chapter';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const readText = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ''));
    r.onerror = () => reject(r.error);
    r.readAsText(file);
  });

const Progress = () => {
  const { getProgress, chapters, isLoading, isCorrupted, corruptedBackupKey, saveFailed, replaceAll } = useChapters();
  const progress = getProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Chapter[] | null>(null);
  const [message, setMessage] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    let text: string;
    try {
      text = await readText(file);
    } catch {
      setMessage({ kind: 'error', text: 'Import cancelled: the file could not be read.' });
      return;
    }
    const result = parseImport(text);
    if (!result.ok) {
      setMessage({ kind: 'error', text: `Import cancelled: ${result.error}` });
      return;
    }
    setMessage(null);
    setPending(result.chapters);
  };

  const confirmImport = () => {
    if (!pending) return;
    const result = replaceAll(pending);
    setMessage(result.ok
      ? { kind: 'ok', text: `Import complete: ${pending.length} chapters restored.${result.backupKey ? ` Previous data backed up (${result.backupKey}).` : ''}` }
      : { kind: 'error', text: `Import failed: ${result.error}` });
    setPending(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Your Progress</h1>
        <p className="text-sm text-muted-foreground">
          Track your learning journey
        </p>
      </header>

      {/* Main Progress */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-foreground mb-2">
            {progress.percentage}%
          </div>
          <p className="text-muted-foreground">Course Completion</p>
        </div>
        <ProgressBar percentage={progress.percentage} showLabel={false} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-status-completed/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground mb-1">
            {progress.completed}
          </div>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="bg-status-progress/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground mb-1">
            {progress.inProgress}
          </div>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </div>
        <div className="bg-status-todo/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground mb-1">
            {progress.toDo}
          </div>
          <p className="text-xs text-muted-foreground">To Do</p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h2 className="font-medium text-foreground mb-2">Summary</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• {progress.completed} of {progress.total} chapters completed</li>
          <li>• {progress.total - progress.completed} chapters remaining</li>
          {progress.inProgress > 0 && (
            <li>• {progress.inProgress} chapter{progress.inProgress > 1 ? 's' : ''} in progress</li>
          )}
        </ul>
      </div>

      {isCorrupted && (
        <div role="alert" className="mt-6 border border-border rounded-lg p-4 text-sm text-foreground">
          Saved data could not be read. A raw copy was kept
          {corruptedBackupKey ? ` (${corruptedBackupKey})` : ''} and is included in the export.
          Changes will not be saved until you import a valid backup.
        </div>
      )}

      {saveFailed && !isCorrupted && (
        <div role="alert" className="mt-6 border border-border rounded-lg p-4 text-sm text-foreground">
          Your browser storage is unavailable. Changes are not being saved.
        </div>
      )}

      {message && (
        <div
          role={message.kind === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className="mt-6 border border-border rounded-lg p-4 text-sm text-foreground"
        >
          {message.text}
        </div>
      )}

      {/* Backup */}
      <section aria-labelledby="backup-heading" className="mt-6">
        <h2 id="backup-heading" className="sr-only">Backup</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => downloadExport(chapters)}
            aria-label="Export my data as a JSON file">
            <Download className="w-4 h-4 mr-2" aria-hidden="true" />
            Export my data (JSON)
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}
            aria-label="Import data from a JSON backup file">
            <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
            Import data (JSON)
          </Button>
        </div>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden"
          data-testid="import-input" aria-hidden="true" tabIndex={-1} onChange={onFile} />
      </section>

      <AlertDialog open={pending !== null} onOpenChange={open => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace your current data?</AlertDialogTitle>
            <AlertDialogDescription>
              This file contains {pending?.length ?? 0} chapters. Your current progress and notes
              ({chapters.length} chapters) will be replaced. A backup copy of the current data is
              saved automatically before import.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>Replace data</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Progress;

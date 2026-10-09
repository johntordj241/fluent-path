import { useChapters } from '@/hooks/useChapters';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadExport } from '@/lib/chapterStorage';

const Progress = () => {
  const { getProgress, chapters, isLoading, isCorrupted, corruptedBackupKey } = useChapters();
  const progress = getProgress();

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
        </div>
      )}

      {/* Backup */}
      <div className="mt-6">
        <Button variant="outline" size="sm" onClick={() => downloadExport(chapters)}>
          <Download className="w-4 h-4 mr-2" />
          Export my data (JSON)
        </Button>
      </div>
    </div>
  );
};

export default Progress;

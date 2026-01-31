import { useChapters } from '@/hooks/useChapters';
import { ChapterCard } from '@/components/ChapterCard';
import { ProgressBar } from '@/components/ProgressBar';

const Chapters = () => {
  const { chapters, getProgress, isLoading } = useChapters();
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
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Chapters</h1>
        <p className="text-sm text-muted-foreground mb-4">
          {chapters.length} lessons • {progress.completed} completed
        </p>
        <ProgressBar percentage={progress.percentage} showLabel={false} />
      </header>

      <div className="space-y-3">
        {chapters.map(chapter => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </div>
  );
};

export default Chapters;

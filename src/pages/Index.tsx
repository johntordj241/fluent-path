import { Link } from 'react-router-dom';
import { useChapters } from '@/hooks/useChapters';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';

const Index = () => {
  const { getProgress, isLoading } = useChapters();
  const progress = getProgress();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-8">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-accent-foreground" />
          </div>
          
          <h1 className="text-3xl font-semibold text-foreground mb-3 leading-tight">
            English Course
          </h1>
          <p className="text-lg text-accent-foreground font-medium mb-4">
            B1 to B2 Level
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Progress from intermediate to upper-intermediate English through structured lessons covering listening, speaking, grammar, reading, and writing skills.
          </p>
        </div>

        <div className="mb-8">
          <ProgressBar percentage={progress.percentage} />
          <p className="text-sm text-muted-foreground mt-2">
            {progress.completed} of {progress.total} chapters completed
          </p>
        </div>

        <Button asChild size="lg" className="w-full">
          <Link to="/chapters" className="flex items-center justify-center gap-2">
            Start learning
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;

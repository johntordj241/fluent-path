import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChapters } from '@/hooks/useChapters';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChapterStatus } from '@/types/chapter';
import { ArrowLeft, CheckCircle, Clock, Circle } from 'lucide-react';

const ChapterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getChapter, updateChapterStatus, updateChapterNotes, isLoading } = useChapters();
  
  const chapter = getChapter(id || '');
  const [notes, setNotes] = useState('');
  const [notesTimer, setNotesTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (chapter) {
      setNotes(chapter.notes);
    }
  }, [chapter]);

  // Auto-save notes with debounce
  const handleNotesChange = (value: string) => {
    setNotes(value);
    if (notesTimer) clearTimeout(notesTimer);
    const timer = setTimeout(() => {
      if (id) updateChapterNotes(id, value);
    }, 500);
    setNotesTimer(timer);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-muted-foreground mb-4">Chapter not found</p>
        <Button variant="outline" onClick={() => navigate('/chapters')}>
          Back to chapters
        </Button>
      </div>
    );
  }

  const statusActions: { status: ChapterStatus; label: string; icon: typeof CheckCircle }[] = [
    { status: 'to-do', label: 'Mark as To do', icon: Circle },
    { status: 'in-progress', label: 'Mark as In progress', icon: Clock },
    { status: 'completed', label: 'Mark as Completed', icon: CheckCircle }
  ];

  const nextStatus = statusActions.find(a => a.status !== chapter.status);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur border-b border-border z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <button 
            onClick={() => navigate('/chapters')}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Chapter {chapter.order}</p>
            <h1 className="font-medium text-foreground truncate">{chapter.title}</h1>
          </div>
          <StatusBadge status={chapter.status} />
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Skill & Objective */}
        <section>
          <p className="text-sm font-medium text-accent-foreground mb-2">{chapter.skill}</p>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground mb-1">Learning Objective</p>
            <p className="text-foreground">{chapter.objective}</p>
          </div>
        </section>

        {/* Course Content */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Course Content</h2>
          <div className="prose prose-sm prose-neutral max-w-none">
            {chapter.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-foreground leading-relaxed mb-4 whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Exercises */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Exercises</h2>
          <div className="bg-card border border-border rounded-lg p-4">
            {chapter.exercises.split('\n\n').map((exercise, i) => (
              <p key={i} className="text-foreground leading-relaxed mb-3 last:mb-0 whitespace-pre-line">
                {exercise}
              </p>
            ))}
          </div>
        </section>

        {/* Personal Notes */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Personal Notes</h2>
          <Textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Write your notes, questions, or key takeaways here..."
            className="min-h-32 resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">Auto-saved</p>
        </section>

        {/* Status Actions */}
        <section className="pt-4 pb-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">Update Status</p>
          <div className="flex flex-wrap gap-2">
            {statusActions.map(({ status, label, icon: Icon }) => (
              <Button
                key={status}
                variant={chapter.status === status ? "default" : "outline"}
                size="sm"
                onClick={() => updateChapterStatus(chapter.id, status)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label.replace('Mark as ', '')}
              </Button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChapterDetail;

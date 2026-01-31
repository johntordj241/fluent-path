import { Link } from 'react-router-dom';
import { Chapter } from '@/types/chapter';
import { StatusBadge } from './StatusBadge';
import { ChevronRight } from 'lucide-react';

interface ChapterCardProps {
  chapter: Chapter;
}

export function ChapterCard({ chapter }: ChapterCardProps) {
  return (
    <Link 
      to={`/chapter/${chapter.id}`}
      className="block bg-card border border-border rounded-lg p-4 hover:border-accent-foreground/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground font-medium">
              Chapter {chapter.order}
            </span>
            <StatusBadge status={chapter.status} />
          </div>
          <h3 className="font-medium text-foreground leading-snug mb-1 line-clamp-2">
            {chapter.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {chapter.skill}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
}

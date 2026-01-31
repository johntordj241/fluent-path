import { ChapterStatus } from '@/types/chapter';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ChapterStatus;
  className?: string;
}

const statusConfig: Record<ChapterStatus, { label: string; className: string }> = {
  'to-do': {
    label: 'To do',
    className: 'bg-status-todo text-status-todo-foreground'
  },
  'in-progress': {
    label: 'In progress',
    className: 'bg-status-progress text-status-progress-foreground'
  },
  'completed': {
    label: 'Completed',
    className: 'bg-status-completed text-status-completed-foreground'
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}

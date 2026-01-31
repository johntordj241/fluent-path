export type ChapterStatus = 'to-do' | 'in-progress' | 'completed';

export interface Chapter {
  id: string;
  title: string;
  skill: string;
  objective: string;
  content: string;
  exercises: string;
  status: ChapterStatus;
  notes: string;
  order: number;
}

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from '@/App';
import { STORAGE_KEY, buildExport } from '@/lib/chapterStorage';
import { initialChapters } from '@/data/initialChapters';

const go = (path: string) => {
  window.history.pushState({}, '', path);
  return render(<App />);
};

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, '', '/');
});

describe('navigation and progress', () => {
  it('lists the 5 chapters', async () => {
    go('/chapters');
    expect(await screen.findByText(/5 lessons/)).toBeInTheDocument();
  });

  it('shows progress computed from completed chapters', async () => {
    go('/progress');
    expect(await screen.findByText('20%')).toBeInTheDocument();
  });

  it('opens a chapter and marks it completed', async () => {
    const id = initialChapters.find(c => c.status === 'to-do')!.id;
    go(`/chapter/${id}`);
    const btn = await screen.findByRole('button', { name: /Mark as Completed/i });
    fireEvent.click(btn);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.find((c: { id: string }) => c.id === id).status).toBe('completed');
  });
});

describe('corrupted storage', () => {
  it('shows an alert and never overwrites the stored value', async () => {
    localStorage.setItem(STORAGE_KEY, '{corrupt');
    const id = initialChapters[0].id;
    go(`/chapter/${id}`);
    fireEvent.click(await screen.findByRole('button', { name: 'Mark as Completed' }));
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{corrupt');
  });
  it('announces the problem on the progress page', async () => {
    localStorage.setItem(STORAGE_KEY, '{corrupt');
    go('/progress');
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be read/);
  });
});

describe('import flow', () => {
  const upload = (text: string) => {
    const input = screen.getByTestId('import-input') as HTMLInputElement;
    const file = new File([text], 'backup.json', { type: 'application/json' });
    fireEvent.change(input, { target: { files: [file] } });
  };

  it('has accessible export and import buttons', async () => {
    go('/progress');
    expect(await screen.findByRole('button', { name: /Export my data/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Import data/i })).toBeInTheDocument();
  });

  it('rejects invalid JSON without touching data', async () => {
    go('/progress');
    await screen.findByText('20%');
    const before = localStorage.getItem(STORAGE_KEY);
    upload('not json');
    expect(await screen.findByRole('alert')).toHaveTextContent(/not valid JSON/);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });

  it('previews, requires confirmation, then replaces with backup', async () => {
    go('/progress');
    await screen.findByText('20%');
    const before = localStorage.getItem(STORAGE_KEY);
    const all = initialChapters.map(c => ({ ...c, status: 'completed' as const }));
    upload(buildExport(all));
    const dialog = await screen.findByRole('alertdialog');
    expect(dialog).toHaveTextContent(/contains 5 chapters/);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Replace data' }));
    await waitFor(() => expect(screen.getByText('100%')).toBeInTheDocument());
    const backups = Object.keys(localStorage).filter(k => k.includes('pre-import'));
    expect(backups).toHaveLength(1);
    expect(localStorage.getItem(backups[0])).toBe(before);
  });

  it('cancel keeps current data', async () => {
    go('/progress');
    await screen.findByText('20%');
    const before = localStorage.getItem(STORAGE_KEY);
    upload(buildExport(initialChapters.map(c => ({ ...c, status: 'completed' as const }))));
    const dialog = await screen.findByRole('alertdialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
    expect(screen.getByText('20%')).toBeInTheDocument();
  });
});

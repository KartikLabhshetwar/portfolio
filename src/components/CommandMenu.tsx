import { Command } from 'cmdk';
import { useEffect, useState } from 'react';

type Item = { label: string; href: string; group: string; external?: boolean; keywords?: string[] };

export default function CommandMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('open-command-menu', onOpen);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-menu', onOpen);
    };
  }, []);

  if (!open) return null;

  const groups = [...new Set(items.map((i) => i.group))];
  const go = (item: Item) => {
    setOpen(false);
    if (item.external) window.open(item.href, '_blank', 'noopener,noreferrer');
    else window.location.href = item.href;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[18vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <Command
        loop
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-lg border border-black/10 bg-white font-mono shadow-2xl dark:border-white/10 dark:bg-zinc-900"
      >
        <Command.Input
          autoFocus
          placeholder="Search pages, projects, posts…"
          className="w-full border-b border-black/10 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-zinc-400 dark:border-white/10"
        />
        <Command.List className="max-h-80 overflow-auto p-2 no-scrollbar">
          <Command.Empty className="px-2 py-6 text-center text-sm text-zinc-500">No results.</Command.Empty>
          {groups.map((g) => (
            <Command.Group key={g} heading={g}>
              {items
                .filter((i) => i.group === g)
                .map((i) => (
                  <Command.Item
                    key={i.label}
                    value={i.label}
                    keywords={i.keywords}
                    onSelect={() => go(i)}
                    className="flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm text-zinc-700 data-[selected=true]:bg-zinc-100 dark:text-zinc-200 dark:data-[selected=true]:bg-zinc-800"
                  >
                    <span>{i.label}</span>
                    {i.external && <span className="text-xs text-zinc-400">↗</span>}
                  </Command.Item>
                ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}

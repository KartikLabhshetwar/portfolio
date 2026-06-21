import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface EmptySponsorSlotCardProps {
  sponsorUrl: string;
}

export default function EmptySponsorSlotCard({ sponsorUrl }: EmptySponsorSlotCardProps) {
  return (
    <div className="group/item relative flex h-full w-full items-center gap-3 rounded-[12px] border border-dashed border-border p-2 overflow-hidden">
      <Link
        href={sponsorUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-20 flex items-center justify-center bg-background/95 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100"
      >
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <span className="text-lg font-bold text-foreground">Take This Slot</span>
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            Become a Sponsor
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>

      <div className="relative flex h-full w-full items-end gap-3 blur-[3px] select-none pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="flex h-full flex-col gap-0.5 overflow-hidden rounded-[8px] border border-border p-1">
            <div className="h-20 w-20 overflow-hidden rounded-t-[6px] border border-border bg-linear-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800" />
            <span className="flex items-center justify-center rounded-b-[6px] border border-border py-[2px] text-base font-semibold text-emerald-600 dark:text-emerald-400">
              $100.00
            </span>
          </div>
        </div>

        <div className="flex h-full min-w-0 flex-1 flex-col items-start justify-between gap-2.5 pb-1">
          <h4 className="truncate text-[1.10rem] font-semibold leading-[1.10] text-zinc-900 dark:text-zinc-50">
            Your Name Here
          </h4>

          <div className="flex w-full flex-col gap-1 rounded-[6px] border border-border p-1">
            <div className="flex w-full select-none items-center rounded-[4px] border border-border/40 bg-zinc-100 px-2 py-1 text-sm font-medium text-zinc-600 dark:bg-zinc-900/40 dark:text-zinc-300">
              <span className="ml-1.5 truncate">github.com/you</span>
            </div>
            <div className="flex w-full select-none items-center rounded-[4px] border border-border/40 bg-zinc-100 px-2 py-1 text-sm font-medium text-zinc-600 dark:bg-zinc-900/40 dark:text-zinc-300">
              <span className="ml-1.5 truncate">x.com/you</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import EmptySponsorSlotCard from '@/components/EmptySponsorSlotCard';
import SponsorButton, { SponsorHeartIcon } from '@/components/SponsorButton';
import { Sponsor } from '@/types/sponsor';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';

interface SponsorShowcaseProps {
  sponsors: Sponsor[];
  className?: string;
  sponsorUrl?: string;
  showEmptySlot?: boolean;
}

export default function SponsorShowcase({ 
  sponsors, 
  className = '',
  sponsorUrl = 'https://github.com/sponsors/KartikLabhshetwar',
  showEmptySlot = true,
}: SponsorShowcaseProps) {
  if (sponsors.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="rounded-lg bg-white dark:bg-zinc-900 p-6 sm:p-8 border border-black/10 dark:border-white/5">
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <SponsorHeartIcon className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-6">
              Be the first to sponsor this project
            </p>
            <SponsorButton href={sponsorUrl} />
          </div>
        </div>
      </div>
    );
  }

  const SponsorCard = ({ sponsor }: { sponsor: Sponsor }) => {
    return (
      <div className="relative flex h-full w-full items-end gap-3 rounded-[12px] border border-border p-2 text-zinc-900 transition-all duration-300 hover:-translate-y-0.5  hover:shadow-md hover:shadow-black/10 group-hover/sponsors:opacity-40 hover:opacity-100 dark:text-zinc-50">
        <div className="flex flex-col gap-1">
          <div className="flex h-full flex-col gap-0.5 overflow-hidden rounded-[8px] border border-border p-1 select-none">
            <div className="h-20 w-20 overflow-hidden rounded-t-[6px] border border-border">
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
                style={{ color: 'transparent' }}
              />
            </div>
            {typeof sponsor.amountUsd === 'number' && (
              <span className="flex items-center justify-center rounded-b-[6px] border border-border py-[2px] text-base font-semibold text-emerald-600 dark:text-emerald-400">
                ${sponsor.amountUsd.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="flex h-full min-w-0 flex-1 flex-col items-start justify-between gap-2.5 pb-1">
          <h4 className="truncate text-[1.10rem] font-semibold leading-[1.10] text-zinc-900 dark:text-zinc-50">
            {sponsor.name}
          </h4>

          <div className="flex w-full flex-col gap-1 rounded-[6px] border border-border p-1">
            {sponsor.github && (
              <Link
                href={`https://github.com/${sponsor.github}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex w-full select-none items-center rounded-[4px] border border-border/40 bg-zinc-100 px-2 py-1 text-sm font-medium text-zinc-600 transition-colors duration-300 hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800/40 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              >
                <FaGithub className="h-[14.5px] w-[14.5px]" />
                <span className="ml-1.5 truncate">{sponsor.github}</span>
              </Link>
            )}
            {sponsor.twitter && (
              <Link
                href={`https://x.com/${sponsor.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex w-full select-none items-center rounded-[4px] border border-border/40 bg-zinc-100 px-2 py-1 text-sm font-medium text-zinc-600 transition-colors duration-300 hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800/40 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              >
                <FaXTwitter className="h-[14.5px] w-[14.5px]" />
                <span className="ml-1.5 truncate">{sponsor.twitter}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 group/sponsors">
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} />
        ))}
        {showEmptySlot && <EmptySponsorSlotCard sponsorUrl={sponsorUrl} />}
      </div>
    </div>
  );
}


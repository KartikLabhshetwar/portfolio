'use client';

import { Sponsor } from '@/types/sponsor';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowUpRight } from 'lucide-react';

interface SponsorShowcaseProps {
  sponsors: Sponsor[];
  className?: string;
  sponsorUrl?: string;
}

export default function SponsorShowcase({ 
  sponsors, 
  className = '',
  sponsorUrl = 'https://github.com/sponsors/Shivam909058'
}: SponsorShowcaseProps) {
  if (sponsors.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="rounded-lg bg-white dark:bg-zinc-900 p-6 sm:p-8 border border-black/10 dark:border-white/5">
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-6">
              Be the first to sponsor this project
            </p>
            <Link
              href={sponsorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm sm:text-base font-medium transition-all hover:bg-zinc-800 dark:hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              <Heart className="w-4 h-4 fill-current" />
              Sponsor Me
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const SponsorCard = ({ sponsor }: { sponsor: Sponsor }) => {
    const cardContent = (
      <div className="flex flex-col items-center text-center w-full p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-lg transition-all duration-300 group-has-hover:opacity-40 group-has-hover:group-hover/item:opacity-100 group-has-hover:group-hover/item:border-black/20 group-has-hover:group-hover/item:dark:border-white/10 group-has-hover:group-hover/item:scale-[1.02] group-has-hover:group-hover/item:shadow-lg group-has-hover:group-hover/item:shadow-black/5 dark:group-has-hover:group-hover/item:shadow-black/20">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white dark:bg-white/5 border-2 border-black/10 dark:border-white/10 mb-4 transition-all duration-300 group-has-hover:group-hover/item:border-black/20 group-has-hover:group-hover/item:dark:border-white/20 group-has-hover:group-hover/item:shadow-md shrink-0">
          <Image
            src={sponsor.logo}
            alt={sponsor.name}
            width={80}
            height={80}
            className="w-full h-full object-cover transition-transform duration-300 group-has-hover:group-hover/item:scale-110"
            style={{ color: 'transparent' }}
          />
        </div>
        
        <h4 className="text-sm sm:text-base font-medium text-black dark:text-white transition-colors duration-300 group-has-hover:group-hover/item:text-black dark:group-has-hover:group-hover/item:text-white">
          {sponsor.name}
        </h4>
        
        {sponsor.url && (
          <div className="flex items-center justify-center gap-1 mt-1 opacity-0 group-has-hover:opacity-40 group-has-hover:group-hover/item:opacity-100 transition-opacity duration-300">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Visit</span>
            <ArrowUpRight className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
          </div>
        )}
      </div>
    );

    if (sponsor.url) {
      return (
        <Link
          key={sponsor.id}
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/item block w-full touch-manipulation"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          {cardContent}
        </Link>
      );
    }

    return (
      <div key={sponsor.id} className="group/item w-full">
        {cardContent}
      </div>
    );
  };

  return (
    <div className={`group ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4">
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} />
        ))}
      </div>
    </div>
  );
}


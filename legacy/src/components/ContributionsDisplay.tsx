'use client'

import React from 'react';
import GitHubContributions from './ui/GitHubContributions';

interface ContributionsDisplayProps {
  username: string;
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

const ContributionsDisplay: React.FC<ContributionsDisplayProps> = ({
  username,
  variant = 'full',
  className = ''
}) => {
  const isCompact = variant === 'compact' || variant === 'minimal';

  return (
    <GitHubContributions
      username={username}
      compact={isCompact}
      className={className}
    />
  );
};

export default ContributionsDisplay;

'use client'

import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

interface GitHubContributionsProps {
  username: string;
  compact?: boolean;
  className?: string;
}

const GitHubContributions: React.FC<GitHubContributionsProps> = ({ 
  username,
  compact = false,
  className = ""
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const theme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

  if (!mounted) {
    return (
      <div className={`w-full ${compact ? 'h-[120px]' : 'h-[160px]'} rounded-xl bg-muted animate-pulse ${className}`} />
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <motion.div
        className="w-full overflow-hidden rounded-xl bg-transparent backdrop-blur-none border-0 hover:shadow-sm transition-shadow duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`${compact ? 'p-2' : 'p-3'} hover:scale-[1.005] transition-transform duration-300`}>
          
          <GitHubCalendar
            username={username}
            colorScheme={resolvedTheme as "light" | "dark"}
            fontSize={compact ? 14 : 12}
            blockSize={compact ? 10 : 12}
            blockMargin={compact ? 2 : 4}
            showWeekdayLabels={!compact}
            theme={theme}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default GitHubContributions;
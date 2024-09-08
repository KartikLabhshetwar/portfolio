import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

interface GitHubStats {
  publicRepos: number;
  totalCommits: number;
  followers: number;
  totalStars: number;
}

const Stats: React.FC = () => {
  const [stats, setStats] = useState<GitHubStats>({
    publicRepos: 0,
    totalCommits: 0,
    followers: 0,
    totalStars: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const username = 'KartikLabhshetwar';
        const token = import.meta.env.VITE_GITHUB_TOKEN;

        if (!token) {
          throw new Error('GitHub token is not set');
        }

        const axiosInstance = axios.create({
          headers: { Authorization: `token ${token}` }
        });

        const userResponse = await axiosInstance.get(`https://api.github.com/users/${username}`);
        const reposResponse = await axiosInstance.get(`https://api.github.com/users/${username}/repos?per_page=100`);

        let totalCommits = 0;
        let totalStars = 0;

        for (const repo of reposResponse.data) {
          totalStars += repo.stargazers_count;

          // Fetch the latest commit for each repo
          const commitsResponse = await axiosInstance.get(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`);
          if (commitsResponse.headers['link']) {
            const match = commitsResponse.headers['link'].match(/page=(\d+)>; rel="last"/);
            if (match) {
              totalCommits += parseInt(match[1], 10);
            }
          } else {
            totalCommits += 1; // If there's no pagination, there's at least one commit
          }
        }

        setStats({
          publicRepos: userResponse.data.public_repos,
          totalCommits,
          followers: userResponse.data.followers,
          totalStars,
        });
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        setError('Failed to fetch GitHub stats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  const statItems = [
    { label: 'Public Repositories', value: stats.publicRepos },
    { label: 'Total Commits', value: stats.totalCommits },
    { label: 'GitHub Followers', value: stats.followers },
    { label: 'Total Stars', value: stats.totalStars },
  ];

  if (loading) {
    return <div className="text-center py-20">Loading GitHub stats...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <section ref={ref} className="py-20 bg-background text-text-light">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          My GitHub Stats
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.p
                className="text-4xl font-bold mb-2 text-accent"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : { scale: 0 }}
                transition={{ type: 'spring', stiffness: 100, delay: index * 0.1 + 0.2 }}
              >
                {stat.value.toLocaleString()}
              </motion.p>
              <p className="text-xl">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  initialItems: number;
  itemsPerLoad: number;
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = <T>(
  items: T[],
  options: UseInfiniteScrollOptions
) => {
  const {
    initialItems,
    itemsPerLoad,
    threshold = 0.1,
    rootMargin = '100px'
  } = options;

  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  // Initialize displayed items
  useEffect(() => {
    const initial = items.slice(0, initialItems);
    setDisplayedItems(initial);
    setHasMore(items.length > initialItems);
  }, [items, initialItems]);

  // Load more items with faster performance
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Reduced timeout for much faster loading
    setTimeout(() => {
      setDisplayedItems(current => {
        const currentLength = current.length;
        const nextItems = items.slice(currentLength, currentLength + itemsPerLoad);
        const newItems = [...current, ...nextItems];
        
        setHasMore(newItems.length < items.length);
        setIsLoading(false);
        
        return newItems;
      });
    }, 50); // Much faster - reduced from 300ms to 50ms
  }, [items, itemsPerLoad, isLoading, hasMore]);

  // Set up intersection observer
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold, rootMargin }
    );
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMore, threshold, rootMargin]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return {
    displayedItems,
    hasMore,
    isLoading,
    lastElementRef
  };
};

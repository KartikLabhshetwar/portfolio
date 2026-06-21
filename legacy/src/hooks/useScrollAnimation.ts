'use client';

import { useCallback, useRef, useEffect, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  staggerDelay?: number;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.2,
    rootMargin = '50px',
    staggerDelay = 0.1
  } = options;

  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const observer = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  const registerItem = useCallback((id: string, element: HTMLElement | null) => {
    if (!element) {
      itemRefs.current.delete(id);
      return;
    }

    itemRefs.current.set(id, element);

    if (!observer.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const itemId = entry.target.getAttribute('data-item-id');
            if (!itemId) return;

            if (entry.isIntersecting) {
              setVisibleItems(prev => new Set([...prev, itemId]));
            }
          });
        },
        {
          threshold,
          rootMargin
        }
      );
    }

    element.setAttribute('data-item-id', id);
    observer.current.observe(element);
  }, [threshold, rootMargin]);

  const getAnimationDelay = useCallback((index: number) => {
    return index * staggerDelay;
  }, [staggerDelay]);

  const isVisible = useCallback((id: string) => {
    return visibleItems.has(id);
  }, [visibleItems]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return {
    registerItem,
    isVisible,
    getAnimationDelay
  };
};

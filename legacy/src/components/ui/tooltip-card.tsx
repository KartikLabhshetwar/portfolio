"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const Tooltip = ({
  content,
  children,
  containerClassName,
  padded = false,
}: {
  content: string | React.ReactNode;
  children: React.ReactNode;
  containerClassName?: string;
  padded?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [bgColor, setBgColor] = useState<string>('rgb(255, 255, 255)');

  useEffect(() => {
    const updateBgColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setBgColor(isDark ? 'rgb(23, 23, 23)' : 'rgb(255, 255, 255)');
    };
    
    updateBgColor();
    const observer = new MutationObserver(updateBgColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && contentRef.current && tooltipRef.current) {
      const updateDimensions = () => {
        if (contentRef.current && tooltipRef.current) {
          setHeight(contentRef.current.scrollHeight);
          setWidth(tooltipRef.current.offsetWidth || tooltipRef.current.scrollWidth);
        }
      };
      
      const ensureImageOpacity = () => {
        if (!tooltipRef.current) return;
        
        const images = tooltipRef.current.querySelectorAll('img');
        images.forEach((img) => {
          img.style.setProperty('opacity', '1', 'important');
          img.style.setProperty('display', 'block', 'important');
          const parent = img.parentElement;
          if (parent) {
            parent.style.setProperty('opacity', '1', 'important');
          }
        });
      };
      
      updateDimensions();
      ensureImageOpacity();
      
      requestAnimationFrame(() => {
        updateDimensions();
        ensureImageOpacity();
      });
      
      const observer = new MutationObserver(() => {
        ensureImageOpacity();
      });
      
      observer.observe(tooltipRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
      
      return () => {
        observer.disconnect();
      };
    }
  }, [isVisible, content]);

  const calculatePosition = useCallback((mouseX: number, mouseY: number) => {
    if (!containerRef.current) return { x: mouseX + 12, y: mouseY + 12 };

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 12;

    const tooltipWidth = width || 240;
    const tooltipHeight = height || 0;

    const mouseAbsoluteX = containerRect.left + mouseX;
    const mouseAbsoluteY = containerRect.top + mouseY;

    let finalX: number;
    let finalY: number;

    const spaceRight = viewportWidth - mouseAbsoluteX;
    const spaceLeft = mouseAbsoluteX;
    const spaceBottom = viewportHeight - mouseAbsoluteY;
    const spaceTop = mouseAbsoluteY;

    if (spaceRight >= tooltipWidth + padding) {
      finalX = mouseX + padding;
    } else if (spaceLeft >= tooltipWidth + padding) {
      finalX = mouseX - tooltipWidth - padding;
    } else {
      finalX = Math.max(padding - containerRect.left, viewportWidth - tooltipWidth - containerRect.left - padding);
    }

    if (spaceBottom >= tooltipHeight + padding) {
      finalY = mouseY + padding;
    } else if (spaceTop >= tooltipHeight + padding) {
      finalY = mouseY - tooltipHeight - padding;
    } else {
      finalY = Math.max(padding - containerRect.top, viewportHeight - tooltipHeight - containerRect.top - padding);
    }

    return { x: finalX, y: finalY };
  }, [width, height]);

  const updateMousePosition = (mouseX: number, mouseY: number) => {
    setMouse({ x: mouseX, y: mouseY });
    const newPosition = calculatePosition(mouseX, mouseY);
    setPosition(newPosition);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsVisible(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    updateMousePosition(mouseX, mouseY);
  };

  const handleMouseLeave = () => {
    setMouse({ x: 0, y: 0 });
    setPosition({ x: 0, y: 0 });
    setIsVisible(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isVisible) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    updateMousePosition(mouseX, mouseY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;
    updateMousePosition(mouseX, mouseY);
    setIsVisible(true);
  };

  const handleTouchEnd = () => {
    // Delay hiding to allow for tap interaction
    setTimeout(() => {
      setIsVisible(false);
      setMouse({ x: 0, y: 0 });
      setPosition({ x: 0, y: 0 });
    }, 2000);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Toggle visibility on click for mobile devices
    if (window.matchMedia("(hover: none)").matches) {
      e.preventDefault();
      if (isVisible) {
        setIsVisible(false);
        setMouse({ x: 0, y: 0 });
        setPosition({ x: 0, y: 0 });
      } else {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        updateMousePosition(mouseX, mouseY);
        setIsVisible(true);
      }
    }
  };

  useEffect(() => {
    if (isVisible && contentRef.current) {
      const newPosition = calculatePosition(mouse.x, mouse.y);
      setPosition(newPosition);
    }
  }, [isVisible, height, width, mouse.x, mouse.y, calculatePosition]);

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block", containerClassName)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            key="tooltip"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className={cn(
              "pointer-events-none absolute z-[9999] max-w-[90vw] rounded-2xl border border-neutral-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.35)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_18px_45px_rgba(0,0,0,0.65)]",
              padded && "px-3 py-1.5 border-neutral-300/80 dark:border-neutral-700/80"
            )}
            style={{
              top: position.y,
              left: position.x,
              backgroundColor: bgColor,
            }}
          >
            <div
              ref={contentRef}
              className="text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-300 [&_img]:max-w-[300px] [&_img]:h-auto [&_img]:bg-transparent [&_img]:block [&_img]:relative [&_img]:z-10 [&_img]:mb-0 [&_span]:!opacity-100 [&_span>img]:!opacity-100 [&>p]:mb-2 [&>p]:last:mb-0 [&>p]:leading-relaxed [&>*+*]:mt-2"
            >
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

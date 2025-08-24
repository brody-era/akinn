// components/LiquidNavigation.tsx
// Future menu for navigation with liquid-like transitions
"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface LiquidNavigationProps {
  items?: NavItem[];
  className?: string;
}

const defaultItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'changelog', label: 'Changelog', href: '/changelog' },
  { id: 'career', label: 'Career', href: '/career' },
  { id: 'about', label: 'About', href: '/about' }
];

export default function LiquidNavigation({ 
  items = defaultItems, 
  className = '' 
}: LiquidNavigationProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  // Determine active item based on current pathname
  const getActiveItem = () => {
    const currentItem = items.find(item => {
      if (item.href === '/' && pathname === '/') return true;
      if (item.href !== '/' && pathname?.startsWith(item.href)) return true;
      return false;
    });
    return currentItem?.id || items[0]?.id || 'home';
  };

  const activeItem = getActiveItem();

  const handleItemClick = (itemId: string) => {
    if (itemId === activeItem) return;
    
    setIsTransitioning(true);
    
    // Reset transition state
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const getItemGroups = () => {
    const activeIndex = items.findIndex(item => item.id === activeItem);
    const beforeActive = items.slice(0, activeIndex);
    const activeItemObj = items[activeIndex];
    const afterActive = items.slice(activeIndex + 1);
    
    return { beforeActive, activeItemObj, afterActive };
  };

  const { beforeActive, activeItemObj, afterActive } = getItemGroups();

  return (
    <nav 
      ref={containerRef}
      className={`flex items-center gap-3 p-1 ${className}`}
      style={{
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Left group (items before active) */}
      {beforeActive.length > 0 && (
        <div className={`
          flex items-center bg-[#0a0a0a] rounded-full transition-all duration-500 ease-out overflow-hidden
          ${isTransitioning ? 'transform scale-95 opacity-90' : 'transform scale-100 opacity-100'}
        `}>
          {beforeActive.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => handleItemClick(item.id)}
              className={`
                px-6 py-3 text-[#FAFAFA] text-sm font-normal whitespace-nowrap
                transition-all duration-300 ease-out hover:bg-white/10 focus:bg-white/10
                focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-inset
                ${index === beforeActive.length - 1 ? 'rounded-r-full' : ''}
                ${index === 0 ? 'rounded-l-full' : ''}
              `}
              style={{ 
                fontWeight: 400,
                letterSpacing: '0.01em'
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Active item (separated) */}
      {activeItemObj && (
        <div className={`
          relative transition-all duration-500 ease-out
          ${isTransitioning ? 'transform scale-110' : 'transform scale-100'}
        `}>
          {/* Liquid connection effect */}
          <div className={`
            absolute top-1/2 transform -translate-y-1/2 h-8 bg-blue-500/20 
            transition-all duration-400 ease-out rounded-full blur-sm
            ${isTransitioning ? 'w-24 opacity-60' : 'w-0 opacity-0'}
            ${beforeActive.length > 0 ? '-left-12' : '-right-12'}
          `} />
          
          <Link
            href={activeItemObj.href}
            onClick={() => handleItemClick(activeItemObj.id)}
            className={`
              relative block px-6 py-3 bg-blue-500 text-white text-sm font-medium rounded-full
              transition-all duration-400 ease-out hover:bg-blue-600 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent
              ${isTransitioning ? 'shadow-2xl shadow-blue-500/30' : 'shadow-xl shadow-blue-500/20'}
            `}
            style={{ 
              fontWeight: 500,
              letterSpacing: '0.01em'
            }}
            aria-current="page"
          >
            {activeItemObj.label}
          </Link>
        </div>
      )}

      {/* Right group (items after active) */}
      {afterActive.length > 0 && (
        <div className={`
          flex items-center bg-[#0a0a0a] rounded-full transition-all duration-500 ease-out overflow-hidden
          ${isTransitioning ? 'transform scale-95 opacity-90' : 'transform scale-100 opacity-100'}
        `}>
          {afterActive.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => handleItemClick(item.id)}
              className={`
                px-6 py-3 text-[#FAFAFA] text-sm font-normal whitespace-nowrap
                transition-all duration-300 ease-out hover:bg-white/10 focus:bg-white/10
                focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-inset
                ${index === 0 ? 'rounded-l-full' : ''}
                ${index === afterActive.length - 1 ? 'rounded-r-full' : ''}
              `}
              style={{ 
                fontWeight: 400,
                letterSpacing: '0.01em'
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Ambient background glow */}
      <div className={`
        absolute inset-0 -z-10 bg-gradient-to-t from-blue-500/5 to-transparent 
        rounded-full blur-3xl transition-opacity duration-700 pointer-events-none
        ${activeItemObj ? 'opacity-100' : 'opacity-0'}
      `} style={{ 
        width: '150%', 
        height: '200%',
        left: '-25%',
        top: '-50%'
      }} />
    </nav>
  );
}
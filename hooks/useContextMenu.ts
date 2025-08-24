/**
 * Custom hook for managing logo context menu functionality
 * 
 * Provides right-click context menu for the Akinn logo with options to:
 * - Copy logo as SVG to clipboard
 * - Download brand assets ZIP
 * 
 * Features:
 * - Cross-platform support (desktop right-click, mobile long-press, keyboard)
 * - Accessibility compliant with ARIA attributes and keyboard navigation
 * - Smart positioning to keep menu within viewport
 * - iOS-specific touch handling
 * 
 * @author Akinn Labs
 * @since 1.0.0
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Interface for menu position coordinates
 */
interface MenuPosition {
  x: number;
  y: number;
}

/**
 * Type for pending menu actions
 */
type PendingAction = null | "copy-svg" | "brand-assets";

export function useContextMenu() {
  // Menu state
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [pending, setPending] = useState<PendingAction>(null);

  // Refs for DOM elements and accessibility
  const menuRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);
  const lastItemRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLImageElement>(null);
  const longPressRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Opens the context menu at specified coordinates
   * Automatically adjusts position to keep menu within viewport
   * 
   * @param x - X coordinate for menu position
   * @param y - Y coordinate for menu position
   */
  const openMenuAt = useCallback((x: number, y: number) => {
    // Menu dimensions for positioning calculations
    const menuWidth = 180;
    const menuHeight = 104;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padding = 16; // Minimum distance from viewport edges

    // Ensure menu stays within viewport bounds
    const mx = Math.max(padding, Math.min(x, vw - menuWidth - padding));
    const my = Math.max(padding, Math.min(y, vh - menuHeight - padding));

    setMenuPosition({ x: mx, y: my });
    setShowMenu(true);
  }, []);

  /**
   * Closes the context menu and resets state
   * Returns focus to the trigger element for accessibility
   */
  const closeMenu = useCallback(() => {
    setShowMenu(false);
    setPending(null);
    triggerRef.current?.focus?.();
  }, []);

  /**
   * Copies SVG content to clipboard using modern Clipboard API
   * Falls back to text clipboard if image/svg+xml is not supported
   * 
   * @param svgText - SVG content as string
   * @throws Error if all clipboard methods fail
   */
  const copySVGToClipboard = async (svgText: string) => {
    try {
      // Try modern ClipboardItem API with SVG MIME type first
      if ('ClipboardItem' in window && navigator.clipboard?.write) {
        const blob = new Blob([svgText], { type: "image/svg+xml" });
        const item = new ClipboardItem({ 
          "image/svg+xml": blob,
          "text/plain": new Blob([svgText], { type: "text/plain" })
        });
        await navigator.clipboard.write([item]);
        console.log('Copied SVG using ClipboardItem API');
        return;
      }
    } catch (error) {
      console.log('ClipboardItem API failed, falling back to text:', error);
    }

    try {
      // Fallback to text clipboard
      await navigator.clipboard.writeText(svgText);
      console.log('Copied SVG as text');
    } catch (error) {
      console.error('All clipboard methods failed:', error);
      throw error;
    }
  };

  /**
   * Handles copying the Akinn logo as SVG
   * Fetches the SVG file and copies it to clipboard
   */
  const handleCopyLogoAsSVG = async () => {
    setPending("copy-svg");
    try {
      // Fetch the SVG file from public directory
      const res = await fetch("/akinnlabs.svg", { 
        cache: "force-cache",
        headers: {
          'Accept': 'image/svg+xml,text/plain,*/*'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch SVG: ${res.status}`);
      }
      
      const svgText = await res.text();
      
      // Validate SVG content
      if (!svgText.includes('<svg')) {
        throw new Error('Invalid SVG content');
      }
      
      await copySVGToClipboard(svgText);
      console.log('SVG copied successfully');
    } catch (error) {
      console.error('Failed to copy SVG:', error);
      
      // Fallback: show error message in clipboard
      try {
        await navigator.clipboard.writeText('Failed to copy SVG - please check console for details');
      } catch (clipboardError) {
        console.error('Clipboard fallback also failed:', clipboardError);
      }
    } finally {
      // Auto-close menu after brief delay
      setTimeout(() => {
        setPending(null);
        closeMenu();
      }, 900);
    }
  };

  /**
   * Handles downloading brand assets ZIP file
   * Creates a temporary download link and triggers download
   */
  const handleBrandAssets = () => {
    setPending("brand-assets");
    
    // Create temporary download link
    const link = document.createElement('a');
    link.href = '/brand-assets.zip';
    link.download = 'akinn-brand-assets.zip';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Auto-close menu
    setTimeout(() => {
      setPending(null);
      closeMenu();
    }, 500);
  };

  /**
   * Handles touch start for mobile long-press detection
   * 
   * @param e - Touch start event
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    // Set up long press timer (500ms)
    longPressRef.current = setTimeout(() => {
      // Haptic feedback if available
      if (navigator.vibrate) navigator.vibrate(50);
      
      openMenuAt(startX, startY);
    }, 500);
  };

  /**
   * Handles touch move to cancel long press if finger moves too much
   * 
   * @param e - Touch move event
   */
  const handleTouchMove = (e: React.TouchEvent) => {
    if (longPressRef.current) {
      const touch = e.touches[0];
      const startTouch = e.currentTarget.getBoundingClientRect();
      const deltaX = Math.abs(touch.clientX - (startTouch.left + startTouch.width / 2));
      const deltaY = Math.abs(touch.clientY - (startTouch.top + startTouch.height / 2));
      
      // Cancel if moved more than 10px in any direction
      if (deltaX > 10 || deltaY > 10) {
        clearLongPress();
      }
    }
  };

  /**
   * Clears the long press timeout
   */
  const clearLongPress = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  /**
   * Handles right-click on logo to open context menu
   * 
   * @param e - Mouse event
   */
  const handleLogoRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openMenuAt(e.clientX, e.clientY);
  };

  /**
   * Handles keyboard navigation for logo (Context Menu key or Shift+F10)
   * 
   * @param e - Keyboard event
   */
  const handleLogoKeyDown = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
      e.preventDefault();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      // Position menu below the logo
      openMenuAt(rect.left + rect.width / 2, rect.top + rect.height);
    }
  };

  /**
   * Effect to handle menu interactions and keyboard navigation
   * Sets up event listeners for:
   * - Outside clicks to close menu
   * - Keyboard navigation within menu
   * - Focus management
   */
  useEffect(() => {
    if (!showMenu) return;

    /**
     * Closes menu when clicking outside
     */
    const onDocPointer = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    /**
     * Closes menu when touching outside (separate handler to prevent conflicts)
     */
    const onDocTouch = (event: TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    /**
     * Handles keyboard navigation within menu
     * Supports: Escape, Arrow keys, Home, End, Tab
     */
    const onKey = (event: KeyboardEvent) => {
      if (!showMenu) return;

      // Close menu on Escape
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      // Get all focusable menu items
      const focusables = menuRef.current?.querySelectorAll<HTMLButtonElement>("[role='menuitem']");
      if (!focusables || focusables.length === 0) return;

      const list = Array.from(focusables);
      const idx = list.indexOf(document.activeElement as HTMLButtonElement);

      // Handle navigation keys
      if (event.key === "ArrowDown") {
        event.preventDefault();
        list[(idx + 1 + list.length) % list.length]?.focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        list[(idx - 1 + list.length) % list.length]?.focus();
      } else if (event.key === "Home") {
        event.preventDefault();
        list[0]?.focus();
      } else if (event.key === "End") {
        event.preventDefault();
        list[list.length - 1]?.focus();
      } else if (event.key === "Tab") {
        event.preventDefault();
        // Tab navigation with wrapping
        if (event.shiftKey) {
          (document.activeElement === firstItemRef.current ? lastItemRef.current : list[Math.max(idx - 1, 0)])?.focus();
        } else {
          (document.activeElement === lastItemRef.current ? firstItemRef.current : list[Math.min(idx + 1, list.length - 1)])?.focus();
        }
      }
    };

    // Set up event listeners
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocTouch, { passive: true });
    document.addEventListener("keydown", onKey);

    // Focus first menu item when menu opens
    requestAnimationFrame(() => firstItemRef.current?.focus());

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocTouch);
      document.removeEventListener("keydown", onKey);
    };
  }, [showMenu, closeMenu]);

  // Cleanup long press timer on unmount
  useEffect(() => () => clearLongPress(), []);

  /**
   * Returns all state and handlers needed by the component
   */
  return {
    // Menu state
    showMenu,
    menuPosition,
    pending,
    
    // DOM refs for accessibility
    menuRef,
    firstItemRef,
    lastItemRef,
    triggerRef,
    
    // Event handlers
    handleLogoRightClick,
    handleLogoKeyDown,
    handleTouchStart,
    handleTouchMove,
    clearLongPress,
    handleCopyLogoAsSVG,
    handleBrandAssets,
    closeMenu,
  };
}
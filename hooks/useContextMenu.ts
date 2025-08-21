// hooks/useContextMenu.ts
"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export function useContextMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [pending, setPending] = useState<null | "copy-svg" | "brand-assets">(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);
  const lastItemRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLImageElement>(null);
  const longPressRef = useRef<NodeJS.Timeout | null>(null);

  const openMenuAt = useCallback((x: number, y: number) => {
    // More accurate menu sizing
    const menuWidth = 180; // Slightly wider to account for content
    const menuHeight = 104; // Height for 2 items + padding
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padding = 16; // Minimum distance from viewport edges

    const mx = Math.max(padding, Math.min(x, vw - menuWidth - padding));
    const my = Math.max(padding, Math.min(y, vh - menuHeight - padding));

    setMenuPosition({ x: mx, y: my });
    setShowMenu(true);
  }, []);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
    setPending(null);
    triggerRef.current?.focus?.();
  }, []);

  // Clipboard: prefer image/svg+xml item, fallback to text
  const copySVGToClipboard = async (svgText: string) => {
    try {
      // First try the modern ClipboardItem API with SVG MIME type
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

  const handleCopyLogoAsSVG = async () => {
    setPending("copy-svg");
    try {
      // Try to fetch the SVG file
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
      
      // Validate that we got SVG content
      if (!svgText.includes('<svg')) {
        throw new Error('Invalid SVG content');
      }
      
      await copySVGToClipboard(svgText);
      
      console.log('SVG copied successfully'); // For debugging
    } catch (error) {
      console.error('Failed to copy SVG:', error);
      
      // Fallback: try to copy a simple text message
      try {
        await navigator.clipboard.writeText('Failed to copy SVG - please check console for details');
      } catch (clipboardError) {
        console.error('Clipboard fallback also failed:', clipboardError);
      }
    } finally {
      setTimeout(() => {
        setPending(null);
        closeMenu();
      }, 900);
    }
  };

  const handleBrandAssets = () => {
    setPending("brand-assets");
    
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = '/brand-assets.zip';
    link.download = 'akinn-brand-assets.zip';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      setPending(null);
      closeMenu();
    }, 500);
  };

  // Mobile long-press with better touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent default but don't stop propagation initially
    e.preventDefault();
    
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    longPressRef.current = setTimeout(() => {
      // Vibrate feedback if available
      if (navigator.vibrate) navigator.vibrate(50);
      
      // Use the original touch position for menu placement
      openMenuAt(startX, startY);
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Cancel long press if finger moves too much
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

  const clearLongPress = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  const handleLogoRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openMenuAt(e.clientX, e.clientY);
  };

  const handleLogoKeyDown = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
      e.preventDefault();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      openMenuAt(rect.left + rect.width / 2, rect.top + rect.height);
    }
  };

  // Close on outside click / Esc; keyboard nav & focus trap
  useEffect(() => {
    if (!showMenu) return;

    const onDocPointer = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    // Separate touch handler to prevent conflicts
    const onDocTouch = (event: TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (!showMenu) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      const focusables = menuRef.current?.querySelectorAll<HTMLButtonElement>("[role='menuitem']");
      if (!focusables || focusables.length === 0) return;

      const list = Array.from(focusables);
      const idx = list.indexOf(document.activeElement as HTMLButtonElement);

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
        if (event.shiftKey) {
          (document.activeElement === firstItemRef.current ? lastItemRef.current : list[Math.max(idx - 1, 0)])?.focus();
        } else {
          (document.activeElement === lastItemRef.current ? firstItemRef.current : list[Math.min(idx + 1, list.length - 1)])?.focus();
        }
      }
    };

    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocTouch, { passive: true });
    document.addEventListener("keydown", onKey);

    requestAnimationFrame(() => firstItemRef.current?.focus());

    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocTouch);
      document.removeEventListener("keydown", onKey);
    };
  }, [showMenu, closeMenu]);

  // Cleanup long press on unmount
  useEffect(() => () => clearLongPress(), []);

  return {
    // State
    showMenu,
    menuPosition,
    pending,
    
    // Refs
    menuRef,
    firstItemRef,
    lastItemRef,
    triggerRef,
    
    // Handlers
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
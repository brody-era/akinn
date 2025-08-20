"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

export default function Footer() {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [pending, setPending] = useState<null | "copy-svg" | "brand-assets">(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);
  const lastItemRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLImageElement>(null);
  const longPressRef = useRef<NodeJS.Timeout | null>(null);

  const openMenuAt = useCallback((x: number, y: number) => {
    // tighter menu sizing for a smaller footprint
    const menuWidth = 168;
    const menuHeight = 96;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const mx = Math.max(8, Math.min(x, vw - menuWidth - 8));
    const my = Math.max(8, Math.min(y, vh - menuHeight - 8));

    setMenuPosition({ x: mx, y: my });
    setShowMenu(true);
  }, []);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
    setPending(null);
    triggerRef.current?.focus?.();
  }, []);

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

  // Mobile long-press
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    longPressRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(50);
      openMenuAt(touch.clientX, touch.clientY);
    }, 500);
  };
  const clearLongPress = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  // Clipboard: prefer image/svg+xml item, fallback to text
  const copySVGToClipboard = async (svgText: string) => {
    try {
      // @ts-ignore
      if (window.ClipboardItem && navigator.clipboard?.write) {
        const blob = new Blob([svgText], { type: "image/svg+xml" });
        // @ts-ignore
        const item = new window.ClipboardItem({ "image/svg+xml": blob });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(svgText);
      }
    } catch {
      await navigator.clipboard.writeText(svgText);
    }
  };

  const handleCopyLogoAsSVG = async () => {
    setPending("copy-svg");
    try {
      const res = await fetch("/akinnlabs.svg", { cache: "force-cache" });
      const svgText = await res.text();
      await copySVGToClipboard(svgText);
    } finally {
      setTimeout(() => {
        setPending(null);
        closeMenu();
      }, 900);
    }
  };

  const handleBrandAssets = () => {
    setPending("brand-assets");
    setTimeout(() => {
      window.open("/brand-assets", "_blank");
      setPending(null);
      closeMenu();
    }, 200);
  };

  // Close on outside click / Esc; keyboard nav & focus trap
  useEffect(() => {
    if (!showMenu) return;

    const onDocPointer = (event: Event) => {
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
    document.addEventListener("touchstart", onDocPointer as any, { passive: true } as any);
    document.addEventListener("keydown", onKey);

    requestAnimationFrame(() => firstItemRef.current?.focus());

    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocPointer as any);
      document.removeEventListener("keydown", onKey);
    };
  }, [showMenu, closeMenu]);

  useEffect(() => () => clearLongPress(), []);

  return (
    <>
      <footer className="pb-8">
        <div className="mb-2">
          <Link href="/">
            <img
              ref={triggerRef}
              id="akinn-logo"
              src="/akinnlabs.svg"
              alt="AKINN Logo"
              className="h-6 mx-auto cursor-pointer select-none"
              onContextMenu={handleLogoRightClick}
              onKeyDown={handleLogoKeyDown}
              onTouchStart={handleTouchStart}
              onTouchEnd={clearLongPress}
              onTouchMove={clearLongPress}
              draggable={false}
              style={{
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                touchAction: "manipulation",
              }}
              aria-haspopup="menu"
              aria-expanded={showMenu || undefined}
              aria-controls={showMenu ? "logo-context-menu" : undefined}
              tabIndex={0}
            />
          </Link>
        </div>

        <nav className="font-[100] text-sm text-neutral-600 tracking-wide">
          <a className="mx-2 opacity-70 hover:opacity-100" href="mailto:hey@akinn.xyz">
            hey@akinn.xyz
          </a>
        </nav>
      </footer>

      {/* Context Menu (compact) */}
      {showMenu && (
        <div
          ref={menuRef}
          id="logo-context-menu"
          role="menu"
          aria-labelledby="akinn-logo"
          className="fixed z-50 bg-white border border-neutral-200 rounded-xl shadow-xl min-w-[168px] py-1 overflow-hidden"
          style={{
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
            fontFamily:
              "'SFProDisplay-Thin', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          <button
            ref={firstItemRef}
            role="menuitem"
            onClick={handleCopyLogoAsSVG}
            disabled={pending !== null}
            className={`w-full px-3.5 py-2 mx-1.5 text-left text-[13px] text-[#0a0a0a] flex items-center gap-2 rounded-lg transition-colors
                        ${pending ? "opacity-80 cursor-default" : "hover:bg-neutral-100"}`}
            style={{ width: "calc(100% - 12px)" }}
          >
            {/* Uniform 16x16 icon box */}
            <span className="w-4 h-4 inline-flex items-center justify-center" aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2" // slightly thicker for balance
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 8l-4 4 4 4" />
                <path d="M17 8l4 4-4 4" />
                <path d="M14 5l-4 14" />
              </svg>
            </span>
            <span className="flex items-center gap-2">
              {pending === "copy-svg" ? (
                <>
                  Copied <span aria-hidden>✓</span>
                </>
              ) : (
                "Copy Logo as SVG"
              )}
            </span>
          </button>

          <button
            ref={lastItemRef}
            role="menuitem"
            onClick={handleBrandAssets}
            disabled={pending !== null}
            className={`w-full px-3.5 py-2 mx-1.5 text-left text-[13px] text-[#0a0a0a] flex items-center gap-2 rounded-lg transition-colors
                        ${pending ? "opacity-80 cursor-default" : "hover:bg-neutral-100"}`}
            style={{ width: "calc(100% - 12px)" }}
          >
            {/* Uniform 16x16 icon box */}
            <span className="w-4 h-4 inline-flex items-center justify-center" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span>{pending === "brand-assets" ? "Opening…" : "Brand Assets"}</span>
          </button>

          {/* SR-only live region for the inline 'Copied' message */}
          {pending === "copy-svg" && (
            <div aria-live="polite" className="sr-only">Copied to clipboard</div>
          )}
        </div>
      )}
    </>
  );
}
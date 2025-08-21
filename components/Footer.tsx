"use client";

import Link from "next/link";
import Image from "next/image";
import { useContextMenu } from "@/hooks/useContextMenu";

export default function Footer() {
  const {
    showMenu,
    menuPosition,
    pending,
    menuRef,
    firstItemRef,
    lastItemRef,
    triggerRef,
    handleLogoRightClick,
    handleLogoKeyDown,
    handleTouchStart,
    handleTouchMove,
    clearLongPress,
    handleCopyLogoAsSVG,
    handleBrandAssets,
  } = useContextMenu();

  return (
    <>
      <footer className="pb-8">
        <div className="mb-2">
          <Link href="/">
            <Image
              ref={triggerRef}
              id="akinn-logo"
              src="/akinnlabs.svg"
              alt="AKINN Logo"
              width={24}
              height={24}
              className="h-6 w-auto mx-auto cursor-pointer select-none"
              onContextMenu={handleLogoRightClick}
              onKeyDown={handleLogoKeyDown}
              onTouchStart={handleTouchStart}
              onTouchEnd={clearLongPress}
              onTouchMove={handleTouchMove}
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
            Hey
          </a>
        </nav>
      </footer>

      {/* Context Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          id="logo-context-menu"
          role="menu"
          aria-labelledby="akinn-logo"
          className="fixed z-50 bg-white border border-neutral-200 rounded-xl shadow-xl min-w-[168px] p-1 overflow-hidden"
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
            className={`w-full px-3.5 py-2 text-left text-[13px] text-[#0a0a0a] flex items-center gap-2 rounded-lg transition-colors
                        ${pending ? "opacity-80 cursor-default" : "hover:bg-neutral-100"}`}
          >
            <span className="w-4 h-4 inline-flex items-center justify-center" aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
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
            className={`w-full px-3.5 py-2 text-left text-[13px] text-[#0a0a0a] flex items-center gap-2 rounded-lg transition-colors
                        ${pending ? "opacity-80 cursor-default" : "hover:bg-neutral-100"}`}
          >
            <span className="w-4 h-4 inline-flex items-center justify-center" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </span>
            <span>{pending === "brand-assets" ? "Downloading…" : "Download Brand Assets"}</span>
          </button>

          {/* SR-only live region for accessibility */}
          {pending === "copy-svg" && (
            <div aria-live="polite" className="sr-only">Copied to clipboard</div>
          )}
          {pending === "brand-assets" && (
            <div aria-live="polite" className="sr-only">Downloading brand assets</div>
          )}
        </div>
      )}
    </>
  );
}
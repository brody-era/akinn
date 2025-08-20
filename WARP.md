# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Akinn Labs is a Next.js-based website showcasing a company that operates in the "lifestyle x tech" space. The site features innovative halftone canvas animations that convert video content into dynamic dot patterns, creating a unique visual experience.

## Development Commands

### Core Development
- `yarn dev` - Start development server (default: http://localhost:3000)
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint for code quality

### Alternative Package Managers
The project supports multiple package managers:
- `yarn dev/build/start` 
- `pnpm dev/build/start`
- `bun dev/build/start`

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15.4.6 with App Router
- **Frontend**: React 19.1.0, TypeScript 5.x
- **Styling**: Tailwind CSS 4.x with PostCSS
- **Fonts**: SF Pro Display (Thin weight) with fallback system fonts

### Project Structure
```
app/                    # Next.js App Router pages
├── globals.css        # Global styles and theme variables
├── layout.tsx         # Root layout with metadata and Footer
├── page.tsx           # Homepage with PromoBanner and HalftoneCanvas
├── not-found.tsx      # 404 page with specialized halftone animation
├── manifest.ts        # PWA manifest configuration
└── favicon.ico

components/            # Reusable React components
├── HalftoneCanvas.tsx      # Main video-to-halftone animation
├── Halftone404Canvas.tsx   # 404 page variant (uses ghost.mp4)
├── PromoBanner.tsx         # Floating promotional banner
├── Footer.tsx              # Footer with logo context menu
├── OpenRoles.tsx           # Job listings component
├── InterviewProcess.tsx    # Interview process display
└── EqualOpportunity.tsx    # EO compliance component

public/               # Static assets
├── horse_video.mp4   # Main halftone animation source
├── ghost.mp4         # 404 page animation source  
├── akinnlabs.svg     # Main logo (copyable via context menu)
└── various icons/images
```

### Key Components Architecture

**HalftoneCanvas**: The centerpiece component that:
- Creates an off-screen HTML5 video element
- Uses Canvas 2D API with `willReadFrequently: true` optimization
- Processes video frames in real-time to create halftone dot patterns
- Handles complex cross-platform video playback (iOS, autoplay policies)
- Implements accessibility with `prefers-reduced-motion` support
- Uses `requestVideoFrameCallback` when available, fallback to `requestAnimationFrame`

**Video Playback Handling**: Sophisticated cross-browser/platform support:
- Multiple autoplay attempt strategies
- iOS-specific heartbeat monitoring for backgrounding detection
- User gesture activation for restricted autoplay environments
- Visibility change handling for performance optimization

**Footer Component**: Interactive logo with:
- Right-click context menu for brand assets
- SVG logo copying with both image and text clipboard support
- Keyboard navigation and screen reader accessibility
- Mobile long-press support with haptic feedback

## Styling Approach

### Design System
- **Colors**: Light theme locked (`#ffffff` background, `#0a0a0a` foreground)
- **Typography**: SF Pro Display Thin (100 weight) with system font fallbacks
- **Animation**: Respects `prefers-reduced-motion` for accessibility
- **Layout**: Mobile-first responsive design with `dvh` units

### Tailwind Configuration
- Uses Tailwind CSS 4.x with PostCSS integration
- Custom CSS variables for theme colors in `:root`
- Inline theme configuration with `@theme inline`

## Browser Compatibility & Performance

### Video Processing Optimizations
- Canvas context configured with `willReadFrequently: true`
- Frame-rate synchronized rendering via `requestVideoFrameCallback`
- iOS-specific workarounds for video backgrounding issues
- Automatic fallback mechanisms for various autoplay restrictions

### Accessibility Features
- Reduced motion support disables animations entirely
- Proper ARIA labels and screen reader support
- Keyboard navigation for interactive elements
- Focus management in modal contexts (logo context menu)

### Performance Considerations
- Aggressive caching headers for media assets (1 year cache)
- Optimized video compression for web delivery
- Lazy loading and intersection observer patterns where applicable
- Memory cleanup for video elements and event listeners

## Development Notes

### Component Patterns
- All interactive components are marked `"use client"`
- Extensive use of `useRef` for DOM manipulation and animation control
- Custom hooks pattern for complex state management (video playback)
- Cleanup patterns in `useEffect` return functions for memory management

### Cross-Platform Considerations
- iOS Safari video playbook handling with multiple attribute strategies
- Mobile-first responsive breakpoints
- Touch interaction support (long-press, gesture handling)
- Overscroll behavior management for mobile consistency

### Code Quality
- TypeScript strict mode enabled
- ESLint with Next.js and TypeScript configurations
- Comprehensive prop typing for all components
- Error boundary patterns for video loading failures

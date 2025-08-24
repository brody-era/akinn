import type { Metadata } from "next";

/**
 * Beta Layout Component for beta.akinn.xyz
 * 
 * This layout is specifically designed for the ERA beta signup flow at beta.akinn.xyz
 * It provides a clean, distraction-free environment optimized for conversions.
 * 
 * Key Features:
 * - Removes footer component for focused experience
 * - No scrolling to keep users engaged with signup
 * - Inherits fonts and base styling from root layout
 * - Applied automatically to all /beta/* routes
 * 
 * @author Akinn Labs
 * @since 1.0.0
 */

/**
 * Metadata configuration for ERA beta pages
 * Optimized for social sharing and SEO for the beta signup flow
 */
export const metadata: Metadata = {
  title: "ERA Protocol Beta",
  description: "Join the waitlist for ERA, your new favourite crypto protocol.",
  openGraph: {
    title: "ERA Protocol Beta", 
    description: "Join the waitlist for ERA, your new favourite crypto protocol.",
    url: "/beta",
    siteName: "Akinn Labs",
    images: [{ url: "/og-beta.png", width: 1200, height: 630, alt: "ERA Beta - Akinn Labs" }],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Beta Layout Component
 * 
 * Provides a minimal layout wrapper for beta signup pages.
 * Unlike the main site layout, this excludes the footer to create
 * a focused, conversion-optimized experience.
 * 
 * @param children - Child components to render within the layout
 * @returns JSX element containing only the children (no header/footer)
 */
export default function BetaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
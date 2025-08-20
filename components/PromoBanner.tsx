"use client";

interface PromoBannerProps {
  message: string;
  href?: string;
}

export default function PromoBanner({ message, href }: PromoBannerProps) {
  const handleClick = () => {
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-none sm:w-auto sm:px-0">
        <div 
          className={`
            text-white text-sm px-2 py-1.5 rounded-lg 
            shadow-lg backdrop-blur-sm flex items-start gap-0.5 sm:gap-1
            ${href ? 'cursor-pointer' : ''}
            transition-colors duration-200 max-w-full
          `}
          onClick={href ? handleClick : undefined}
          style={{
            fontFamily: "'SFProDisplay-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            backgroundColor: '#0a0a0a',
          }}
          onMouseEnter={(e) => {
            if (href) {
              e.currentTarget.style.backgroundColor = '#262626';
            }
          }}
          onMouseLeave={(e) => {
            if (href) {
              e.currentTarget.style.backgroundColor = '#0a0a0a';
            }
          }}
        >
          {/* Message */}
          <span 
            className="flex-1 min-w-0 leading-snug text-left" 
            style={{ color: '#ffffff', opacity: 0.9 }}
          >
            {message}
          </span>
          
          {/* CTA Arrow - Responsive sizing */}
          {href && (
            <span 
              className="banner-arrow font-light leading-none flex-shrink-0 mt-0.5" 
              style={{ color: '#ffffff', opacity: 0.7 }}
            >
              ↗
            </span>
          )}
        </div>
      </div>

      {/* Responsive Arrow Styles */}
      <style jsx>{`
        .banner-arrow {
          font-size: 15px; /* Mobile: 14px */
        }
        
        @media (min-width: 640px) {
          .banner-arrow {
            font-size: 16px; /* Desktop: 16px */
          }
        }
      `}</style>
    </>
  );
}
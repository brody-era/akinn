/**
 * ERA Dashboard Page for beta.akinn.xyz
 * 
 * Clean, minimal dashboard matching the reference design exactly.
 * Features slanted cards with titles inside and proper text sizing.
 * 
 * @author Akinn Labs
 * @since 1.0.0
 */

"use client";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fafafa' }}>
      
      {/* Main content container - centered and constrained */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-16">
        
        {/* Top badge */}
        <div className="mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border" style={{ backgroundColor: '#f5f5f5', color: '#525252', borderColor: '#d4d4d4' }}>
            <img 
              src="/icons/mouse_square_icon.svg" 
              alt="Mouse"
              className="w-4 h-4"
            />
            Try Protocol Beta
          </div>
        </div>

        {/* Hero section */}
        <div className="text-center mb-12 max-w-4xl">
          <h1 className="text-3xl font-medium text-gray-900 mb-4 leading-tight tracking-tight">
            Effortless. Economical. Ethereum.
          </h1>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#adadad' }}>
            Swap and transfer assets on Ethereum
            for virtually nothing. No bridges. No compromises. Just pure, effortless value exchange
            the way it was always meant to be.
          </p>
        </div>

        {/* Cards grid - 3 cards with custom icons */}
        <div className="grid grid-cols-3 gap-8 mb-12 w-full" style={{ maxWidth: '480px' }}>
          
          {/* Protocol Beta */}
          <div className="text-center">
            <div 
              className="rounded-2xl p-4 flex flex-col items-center justify-between transition-all duration-200 hover:scale-105 cursor-pointer group relative"
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                transform: 'rotate(-1deg)',
                width: '140px',
                height: '160px'
              }}
            >
              <h3 className="text-xs font-medium text-gray-700 mb-2">Protocol Beta</h3>
              
              <div className="flex-1 flex items-center justify-center">
                <img 
                  src="/icons/protocol_beta_icon.svg" 
                  alt="Protocol Beta"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div className="text-center">
            <div 
              className="rounded-2xl p-4 flex flex-col items-center justify-between transition-all duration-200 hover:scale-105 cursor-pointer"
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                transform: 'rotate(0deg)',
                width: '140px',
                height: '160px'
              }}
            >
              <h3 className="text-xs font-medium text-gray-700 mb-2">Documentation</h3>
              
              <div className="flex-1 flex items-center justify-center">
                <img 
                  src="/icons/documentation_icon.svg" 
                  alt="Documentation"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Research */}
          <div className="text-center">
            <div 
              className="rounded-2xl p-4 flex flex-col items-center justify-between transition-all duration-200 hover:scale-105 cursor-pointer"
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                transform: 'rotate(1.5deg)',
                width: '140px',
                height: '160px'
              }}
            >
              <h3 className="text-xs font-medium text-gray-700 mb-2">Research</h3>
              
              <div className="flex-1 flex items-center justify-center">
                <img 
                  src="/icons/research_icon.svg" 
                  alt="Research"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="text-center">
          <p className="text-sm" style={{ color: '#adadad' }}>
            Press <kbd className="px-2 py-1 text-xs bg-white border border-gray-300 rounded-lg font-mono shadow-sm font-bold">S</kbd> anytime to get started
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="pb-8">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-4">
            <img 
              src="/akinnlabs_a_logo.svg" 
              alt="Akinn Labs" 
              width="32" 
              height="32"
              className="w-8 h-8 mx-auto"
            />
          </div>
          
          {/* Footer Links */}
          <div className="flex items-center justify-center text-sm" style={{ color: '#adadad' }}>
            <a href="/changelog" className="hover:opacity-70 transition-opacity">
              Changelog
            </a>
            <span className="mx-3">•</span>
            <a href="https://linkedin.com/company/akinn-labs" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              LinkedIn
            </a>
            <span className="mx-3">•</span>
            <a href="https://github.com/akinn-labs" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              Github
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
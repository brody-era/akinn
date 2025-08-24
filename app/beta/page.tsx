"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * ERA Beta Signup Page Component for beta.akinn.xyz
 * 
 * This is the main signup form for the ERA protocol waitlist.
 * Features smart email validation and progressive form disclosure.
 * 
 * User Flow:
 * 1. User enters email
 * 2. Form validates email format in real-time
 * 3. Submit button appears when valid email is detected
 * 4. On submit, redirects to validation page
 * 
 * @author Akinn Labs
 * @since 1.0.0
 */
export default function BetaSignup() {
  // Form state management
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  /**
   * Handles form submission for beta signup
   * Currently redirects to validation page without API call
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't submit if email is empty
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // For now, skip API and go directly to validation
      router.push('/beta/validate');
    } catch (error) {
      console.error('Submission error:', error);
      // TODO: Add proper error handling/display
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Updates email state as user types
   * 
   * @param e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  /**
   * Validates email format to determine if submit button should show
   * Checks for basic email structure: text@domain.tld
   * 
   * @returns boolean indicating if email appears valid
   */
  const isValidEmail = (() => {
    const emailParts = email.split('@');
    const domain = emailParts.length === 2 ? emailParts[1].split('.').pop() : undefined;
    return emailParts.length === 2 && 
           emailParts[1].includes('.') && 
           domain && domain.length >= 2;
  })();

  return (
    <div className="h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#fafafa' }}>
      <div className="w-full max-w-sm text-center">
        {/* ERA Branding Section */}
        <div className="mb-4 animate-fadeInUp">
          <div className="flex justify-center mb-4">
            <img 
              src="/akinnlabs_a_logo.svg" 
              alt="Akinn Labs" 
              width="48" 
              height="48"
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-gray-900 mb-1 font-medium text-lg">
            Welcome to ERA
          </h1>
          <p className="text-gray-500 mb-0 font-normal text-base" style={{ color: '#999999' }}>
            Sign up to join our waitlist.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="mt-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          {/* Email Input Field */}
          <div>
            <input
              type="email"
              placeholder="Please enter your email"
              value={email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-2xl text-gray-900 transition-all border-0 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 font-normal text-base"
              style={{
                backgroundColor: '#edeef1',
                color: email ? '#0a0a0a' : '#737373'
              }}
              required
            />
          </div>

          {/* Progressive Form Disclosure - Shows help text or submit button */}
          <div className="mt-4 h-12 flex items-center justify-center">
            {!isValidEmail ? (
              // Show help text when email is invalid/incomplete
              <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <p className="text-gray-500 text-sm text-center font-normal" style={{ color: '#adadad' }}>
                  We'll notify you when the ERA Protocol launches.
                </p>
              </div>
            ) : (
              // Show submit button when email looks valid
              <div className="animate-slideUp w-full">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-[#0a0a0a] disabled:bg-gray-400 text-white rounded-2xl focus:outline-none font-normal text-base"
                >
                  {isSubmitting ? 'Submitting...' : 'Continue'}
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Loading spinner during submission */}
        {isSubmitting && (
          <div className="flex justify-center mt-4 animate-fadeIn">
            <div 
              className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"
              aria-label="Submitting form"
            ></div>
          </div>
        )}
      </div>

      {/* Beautiful Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out both;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
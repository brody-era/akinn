/**
 * ERA Beta Password Setup Page for beta.akinn.xyz
 * 
 * This component handles password creation for the ERA beta signup flow.
 * Users land here after successfully verifying their email.
 * 
 * User Flow:
 * 1. User enters a secure password
 * 2. Real-time validation against security requirements
 * 3. Continue button appears when password meets all criteria
 * 4. On submit: create account and redirect to success page
 * 
 * Security Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter  
 * - At least one digit
 * - At least one special symbol
 * 
 * Features:
 * - Real-time password strength validation
 * - Show/hide password toggle with eye icon
 * - Progressive disclosure of Continue button
 * - Beautiful animations matching brand aesthetic
 * - Secure password handling practices
 * 
 * @author Akinn Labs
 * @since 1.0.0
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Interface for password validation requirements
 */
interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
}

export default function SetPassword() {
  // Form state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Navigation
  const router = useRouter();

  /**
   * Validates password against security requirements
   * 
   * @param pwd - Password string to validate
   * @returns Object with boolean flags for each requirement
   */
  const validatePassword = (pwd: string): PasswordRequirements => {
    return {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasDigit: /\d/.test(pwd),
      hasSymbol: /[^A-Za-z0-9]/.test(pwd)
    };
  };

  /**
   * Current password validation state
   */
  const requirements = validatePassword(password);

  /**
   * Determines if password meets all security requirements
   */
  const isValidPassword = Object.values(requirements).every(Boolean);

  /**
   * Handles password input changes
   * Clears errors when user starts typing
   * 
   * @param e - Input change event
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    
    // Clear any existing error when user starts typing
    if (error) setError("");
  };

  /**
   * Toggles password visibility state
   * Provides secure password input experience
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Handles form submission for account creation
   * Creates user account with validated password
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password before submission
    if (!isValidPassword) {
      setError("Please ensure your password meets all requirements.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // TODO: Replace with actual account creation API call when backend is ready
      // For now, simulate API call and redirect to success page
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Success: redirect to profile customization page
      router.push('/beta/customize-profile');
    } catch (error) {
      console.error('Account creation error:', error);
      setError(error instanceof Error ? error.message : 'Account creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#fafafa' }}>
      {/* Back navigation arrow */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 p-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
        aria-label="Go back"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="w-full max-w-sm text-center">
        
        {/* Password setup header with security icon */}
        <div className="mb-6 animate-fadeInUp">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center animate-lockBounce" style={{ backgroundColor: '#edeef1' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" className="animate-lockFloat">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <circle cx="12" cy="16" r="1" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>
          <h1 className="text-gray-900 mb-0.5 font-medium text-lg">
            Set Password
          </h1>
          <p className="text-gray-500 mb-0 font-normal text-base" style={{ color: '#999999' }}>
            Set a password for your account.
          </p>
        </div>

        {/* Password setup form */}
        <form onSubmit={handleSubmit} className="mt-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          
          {/* Password input field with show/hide toggle */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 pr-12 rounded-2xl text-gray-900 transition-all border-0 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 font-normal text-base"
              style={{
                backgroundColor: '#edeef1',
                color: password ? '#0a0a0a' : '#737373'
              }}
              required
              aria-describedby="password-requirements"
            />
            
            {/* Password visibility toggle button */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye slash icon (hide password)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                // Eye icon (show password)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Error message display */}
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center animate-fadeInShake" role="alert">
              {error}
            </div>
          )}

          {/* Progressive Form Disclosure */}
          <div className="mt-4 h-16 flex items-center justify-center">
            {!isValidPassword ? (
              // Show password requirements when password is invalid/incomplete
              <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <p 
                  id="password-requirements"
                  className="text-gray-500 text-sm text-center font-normal leading-relaxed" 
                  style={{ color: '#adadad' }}
                >
                  Min. 8 characters including an upper and lowercase letter,<br />
                  digit and a symbol.
                </p>
              </div>
            ) : (
              // Show submit button when password meets all requirements
              <div className="animate-slideUp w-full">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-[#0a0a0a] disabled:bg-gray-400 text-white rounded-2xl focus:outline-none font-normal text-base transition-all duration-200 hover:bg-[#262626]"
                >
                  {isSubmitting ? 'Creating Account...' : 'Continue'}
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
              aria-label="Creating account"
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
        
        @keyframes fadeInShake {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          20% {
            transform: translateX(10px);
          }
          40% {
            transform: translateX(-5px);
          }
          60% {
            transform: translateX(5px);
          }
          80% {
            transform: translateX(-2px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
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
        
        @keyframes lockBounce {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-30px);
          }
          50% {
            transform: scale(1.05) translateY(-5px);
          }
          70% {
            transform: scale(0.95) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes lockFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out both;
        }
        
        .animate-fadeInShake {
          animation: fadeInShake 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-lockBounce {
          animation: lockBounce 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        
        .animate-lockFloat {
          animation: lockFloat 2s ease-in-out infinite;
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
}
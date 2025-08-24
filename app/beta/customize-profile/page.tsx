/**
 * ERA Beta Profile Customization Page for beta.akinn.xyz
 * 
 * This component handles account personalization for the ERA beta signup flow.
 * Users land here after setting their password to customize their profile.
 * 
 * User Flow:
 * 1. User sees their generated avatar (cute cloud)
 * 2. User can customize their account name
 * 3. Continue button appears when name is entered
 * 4. Option to skip customization and proceed
 * 5. On submit: finalize account and redirect to welcome page
 * 
 * Features:
 * - Cute animated cloud avatar with brand colors
 * - Account name customization with placeholder
 * - Progressive disclosure of Continue button
 * - Skip option for users who want to proceed quickly
 * - Beautiful animations matching brand aesthetic
 * - Accessible form design
 * 
 * @author Akinn Labs
 * @since 1.0.0
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomizeProfile() {
  // Form state
  const [accountName, setAccountName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Navigation
  const router = useRouter();

  /**
   * Determines if account name is valid for submission
   * Requires at least 2 characters and no special characters
   */
  const isValidName = accountName.trim().length >= 2 && /^[a-zA-Z0-9\s]+$/.test(accountName.trim());

  /**
   * Handles account name input changes
   * Clears errors when user starts typing
   * 
   * @param e - Input change event
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(e.target.value);
    
    // Clear any existing error when user starts typing
    if (error) setError("");
  };

  /**
   * Handles form submission for profile customization
   * Saves profile data and finalizes account setup
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate account name
    if (!isValidName) {
      setError("Please enter a valid account name (2+ characters, letters and numbers only).");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // TODO: Replace with actual profile creation API call when backend is ready
      // This would save the account name and avatar preferences
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Success: redirect to dashboard
      router.push('/beta/dashboard');
    } catch (error) {
      console.error('Profile creation error:', error);
      setError(error instanceof Error ? error.message : 'Profile creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles skipping profile customization
   * Proceeds directly to welcome page with default settings
   */
  const handleSkip = async () => {
    try {
      // TODO: Create account with default profile settings
      router.push('/beta/dashboard');
    } catch (error) {
      console.error('Skip profile error:', error);
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
        
        {/* Profile customization header with edit icon */}
        <div className="mb-6 animate-fadeInUp">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#edeef1' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
          </div>
          <h1 className="text-gray-900 mb-0.5 font-medium text-lg">
            Customize your Account
          </h1>
          <p className="text-gray-500 mb-0 font-normal text-base" style={{ color: '#999999' }}>
            Give your account an icon and name
          </p>
        </div>

        {/* Cute Cloud Avatar */}
        <div className="mb-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-center mb-4">
            <div className="relative">
              {/* Cloud Avatar Container */}
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                }}
              >
                {/* Your Custom Avatar */}
                <img 
                  src="/akinn_avatar.svg?v=2" 
                  alt="Account Avatar"
                  width="84"
                  height="84"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* 3 dots ellipsis icon */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fafafa' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <circle cx="5" cy="12" r="2" fill="#6b7280" />
                  <circle cx="12" cy="12" r="2" fill="#6b7280" />
                  <circle cx="19" cy="12" r="2" fill="#6b7280" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Account name form */}
        <form onSubmit={handleSubmit} className="mt-6 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          
          {/* Account name label */}
          <div className="mb-2 text-left">
            <label 
              htmlFor="account-name" 
              className="text-gray-600 text-sm font-normal"
              style={{ color: '#6b7280' }}
            >
              Account Name
            </label>
          </div>
          
          {/* Account name input field */}
          <div className="relative mb-4">
            <input
              id="account-name"
              type="text"
              placeholder="My Account"
              value={accountName}
              onChange={handleNameChange}
              className="w-full px-4 py-3 rounded-2xl text-gray-900 transition-all border-0 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 font-normal text-base"
              style={{
                backgroundColor: '#edeef1',
                color: accountName ? '#0a0a0a' : '#737373'
              }}
              maxLength={30}
              aria-describedby="account-name-help"
            />
          </div>

          {/* Error message display */}
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center animate-fadeInShake" role="alert">
              {error}
            </div>
          )}

          {/* Progressive Form Disclosure */}
          <div className="mt-4 h-16 flex items-center justify-center">
            {!isValidName ? (
              // Show empty space when name is invalid/incomplete
              <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                <div className="h-12"></div> {/* Empty space maintaining layout */}
              </div>
            ) : (
              // Show submit button when name is valid
              <div className="animate-slideUp w-full">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-[#007AFF] disabled:bg-gray-400 text-white rounded-2xl focus:outline-none font-normal text-base transition-all duration-200 hover:bg-[#0056CC]"
                >
                  {isSubmitting ? 'Creating Profile...' : 'Continue'}
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Skip option */}
        <div className="mt-4 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
          <p className="text-gray-500 text-sm">
            {"Don't want to customize your account? "}
            <button
              onClick={handleSkip}
              className="text-gray-900 font-medium hover:underline focus:outline-none transition-all duration-200 hover:scale-105"
              disabled={isSubmitting}
            >
              Skip for now
            </button>
          </p>
        </div>

        {/* Loading spinner during submission */}
        {isSubmitting && (
          <div className="flex justify-center mt-4 animate-fadeIn">
            <div 
              className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"
              aria-label="Creating profile"
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
        
        @keyframes editBounce {
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
        
        @keyframes editFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        
        @keyframes cloudBounce {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-40px);
          }
          50% {
            transform: scale(1.1) translateY(-10px);
          }
          70% {
            transform: scale(0.9) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes cloudFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
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
        
        .animate-editBounce {
          animation: editBounce 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        
        .animate-editFloat {
          animation: editFloat 2s ease-in-out infinite;
          animation-delay: 0.8s;
        }
        
        .animate-cloudBounce {
          animation: cloudBounce 1s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.3s;
        }
        
        .animate-cloudFloat {
          animation: cloudFloat 3s ease-in-out infinite;
          animation-delay: 1.3s;
        }
      `}</style>
    </div>
  );
}
/**
 * ERA Beta Email Verification Page for beta.akinn.xyz
 * 
 * This component handles the 6-digit email verification step in the beta signup flow.
 * Users land here after submitting their email on the signup page.
 * 
 * User Flow:
 * 1. User receives 6-digit code via email
 * 2. User enters code in individual input fields
 * 3. Auto-submission when all 6 digits are entered
 * 4. On success: redirect to set-password page
 * 5. On error: show error message with resend option
 * 
 * Features:
 * - Auto-advance between input fields
 * - Paste support for full codes
 * - Backspace navigation
 * - Auto-submission when complete
 * - Error handling with user-friendly messages
 * - Resend functionality
 * 
 * @author Akinn Labs
 * @since 1.0.0
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Type for the 6-digit verification code array
 */
type VerificationCode = [string, string, string, string, string, string];

export default function BetaValidate() {
  // Form state
  const [code, setCode] = useState<VerificationCode>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const [ringPosition, setRingPosition] = useState({ left: 0, top: 0 });
  
  // Navigation and refs
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Updates the ring position based on the focused input
   */
  const updateRingPosition = (index: number) => {
    const input = inputRefs.current[index];
    const container = containerRef.current;
    
    if (input && container) {
      const inputRect = input.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      setRingPosition({
        left: inputRect.left - containerRect.left + (inputRect.width / 2),
        top: inputRect.top - containerRect.top + (inputRect.height / 2)
      });
    }
  };

  /**
   * Handles input changes for individual digit fields
   * Implements auto-advance to next field when digit is entered
   * 
   * @param index - Index of the input field (0-5)
   * @param value - New value entered by user
   */
  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit input
    if (value.length > 1) return;
    
    const newCode = [...code] as VerificationCode;
    newCode[index] = value;
    setCode(newCode);
    
    // Clear any existing error when user starts typing
    if (error) setError("");
    
    // Auto-advance to next field if value entered and not on last field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handles keyboard navigation within verification inputs
   * Implements backspace navigation to previous field
   * 
   * @param index - Index of current input field
   * @param e - Keyboard event
   */
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Navigate back on backspace if current field is empty
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /**
   * Handles paste events for full verification codes
   * Allows users to paste complete 6-digit codes from email
   * 
   * @param e - Clipboard paste event
   */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    
    // Extract only digits from pasted content, limit to 6 characters
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...code] as VerificationCode;
    
    // Fill in the digits from paste
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    
    // Focus the next empty field or the last field if all filled
    const nextEmptyIndex = newCode.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  /**
   * Submits the verification code to the backend
   * Handles success/error states and navigation
   */
  const handleSubmit = async () => {
    const fullCode = code.join("");
    
    // Validate that all 6 digits are entered
    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // For now, skip API and go directly to set-password
      router.push('/beta/set-password');
    } catch (error) {
      console.error('Verification error:', error);
      setError(error instanceof Error ? error.message : 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Requests a new verification code to be sent
   * Called when user clicks "Resend" link
   */
  const handleResend = async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // For now, just log the attempt
      console.log('Resend verification code requested');
    } catch (error) {
      console.error('Resend error:', error);
      // TODO: Show error message to user
    }
  };

  /**
   * Auto-submit verification when all 6 digits are entered
   * Provides seamless UX without requiring manual submit
   */
  useEffect(() => {
    const fullCode = code.join("");
    if (fullCode.length === 6 && !isSubmitting) {
      handleSubmit();
    }
  }, [code, isSubmitting]);

  /**
   * Focus first input field when component mounts
   * Improves UX by setting cursor ready for input
   */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
        
        {/* Email verification header with icon */}
        <div className="mb-6 animate-fadeInUp">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center animate-mailBounce" style={{ backgroundColor: '#edeef1' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" className="animate-mailFloat">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
          </div>
          <h1 className="text-gray-900 mb-0.5 font-medium text-lg">
            We've emailed you a verification code
          </h1>
          <p className="text-gray-500 mb-0 font-normal text-base" style={{ color: '#999999' }}>
            Please enter the code we sent you below.
          </p>
        </div>

        {/* 6-digit verification code input grid with dash separator */}
        <div className="mb-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div ref={containerRef} className="flex justify-center items-center gap-3 mb-4 relative">
            {/* Animated focus ring */}
            {focusedIndex !== null && (
              <div 
                className="absolute pointer-events-none transition-all duration-300 ease-out border-2 border-gray-900 rounded-xl"
                style={{
                  left: `${ringPosition.left}px`,
                  top: `${ringPosition.top}px`,
                  width: '48px',
                  height: '48px',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}
            
            {/* First 3 digits */}
            {code.slice(0, 3).map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric" // Mobile keyboard optimization
                pattern="[0-9]" // Validation pattern
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={() => {
                  setFocusedIndex(index);
                  updateRingPosition(index);
                }}
                onBlur={() => setFocusedIndex(null)}
                className="w-11 h-11 text-center text-lg font-medium text-gray-900 transition-all border-0 focus:outline-none rounded-xl"
                style={{
                  backgroundColor: '#edeef1',
                }}
                disabled={isSubmitting}
                aria-label={`Digit ${index + 1} of verification code`}
              />
            ))}
            
            {/* Dash separator */}
            <span className="text-gray-400 text-lg font-medium px-1">–</span>
            
            {/* Last 3 digits */}
            {code.slice(3, 6).map((digit, index) => (
              <input
                key={index + 3}
                ref={(el) => { inputRefs.current[index + 3] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index + 3, e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => handleKeyDown(index + 3, e)}
                onPaste={handlePaste}
                onFocus={() => {
                  setFocusedIndex(index + 3);
                  updateRingPosition(index + 3);
                }}
                onBlur={() => setFocusedIndex(null)}
                className="w-11 h-11 text-center text-lg font-medium text-gray-900 transition-all border-0 focus:outline-none rounded-xl"
                style={{
                  backgroundColor: '#edeef1',
                }}
                disabled={isSubmitting}
                aria-label={`Digit ${index + 4} of verification code`}
              />
            ))}
          </div>

          {/* Error message display */}
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center animate-fadeInShake" role="alert">
              {error}
            </div>
          )}

          {/* Resend verification code option */}
          <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <span className="text-gray-500 text-sm">Didn't receive a code? </span>
            <button
              onClick={handleResend}
              className="text-gray-900 text-sm font-medium hover:underline focus:outline-none transition-all duration-200 hover:scale-105"
              disabled={isSubmitting}
            >
              Resend
            </button>
          </div>
        </div>

        {/* Loading spinner during submission */}
        {isSubmitting && (
          <div className="flex justify-center mt-4 animate-fadeIn">
            <div 
              className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"
              aria-label="Verifying code"
            ></div>
          </div>
        )}
      </div>

      {/* Enhanced Animation Styles */}
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
        
        @keyframes mailBounce {
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
        
        @keyframes mailFloat {
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
        
        .animate-mailBounce {
          animation: mailBounce 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        
        .animate-mailFloat {
          animation: mailFloat 2s ease-in-out infinite;
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
}
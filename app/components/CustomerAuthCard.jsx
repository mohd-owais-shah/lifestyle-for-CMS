import {useState, useEffect, useRef} from 'react';
import {useFetcher, Link, useNavigate} from 'react-router';

/**
 * CustomerAuthCard
 * Core card component matching Lifestyle Stores Sign up or Sign in UI
 * Supports Sign In, Sign Up (Register), and Forgot Password (Recover) flows
 */
export function CustomerAuthCard({
  initialMode = 'signin',
  redirectTo = '/account',
  onSuccess,
  isModal = false,
  onClose,
}) {
  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup' | 'recover'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [clientError, setClientError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const fetcher = useFetcher();
  const navigate = useNavigate();

  // 'loading' = React Router is re-running loaders with the new session, so
  // keep the button busy until the header/page data is already fresh.
  const isSubmitting = fetcher.state !== 'idle';
  const handledResultRef = useRef(null);
  const serverError = fetcher.data?.error;
  const serverSuccess = fetcher.data?.success;
  const serverMessage = fetcher.data?.message;

  // Handle successful login/registration
  useEffect(() => {
    // Wait until revalidation finished; handle each server result once
    if (!serverSuccess || fetcher.state !== 'idle') return;
    if (handledResultRef.current === fetcher.data) return;
    handledResultRef.current = fetcher.data;
    if (mode === 'recover') {
      setSuccessNotice(
        serverMessage ||
          'Password reset link sent to your email if an account exists.',
      );
    } else if (mode === 'signup' && serverMessage && !fetcher.data?.autoLoggedIn) {
      setSuccessNotice(serverMessage);
    } else {
      // The POST already revalidated the root loader, so the header shows
      // the signed-in state now — no full page reload needed.
      if (onSuccess) {
        onSuccess(fetcher.data);
      } else {
        const target = fetcher.data?.redirectTo || redirectTo || '/account';
        if (target.startsWith('/checkout')) {
          // /checkout redirects off-site to Shopify checkout
          window.location.assign(target);
        } else {
          navigate(target, {replace: true});
        }
      }
    }
  }, [serverSuccess, serverMessage, mode, onSuccess, redirectTo, fetcher.data, fetcher.state, navigate]);

  const handleSubmit = (e) => {
    setClientError('');
    setSuccessNotice('');

    const email = emailInput.trim();
    const password = passwordInput.trim();
    const confirmPassword = confirmPasswordInput.trim();

    if (!email) {
      e.preventDefault();
      setClientError('Please enter your email address.');
      return;
    }

    if (mode !== 'recover') {
      if (!password) {
        e.preventDefault();
        setClientError('Please enter your password.');
        return;
      }
      if (password.length < 5) {
        e.preventDefault();
        setClientError('Password must be at least 5 characters long.');
        return;
      }
    }

    if (mode === 'signup' && password !== confirmPassword) {
      e.preventDefault();
      setClientError('Passwords do not match. Please verify your password.');
      return;
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8 relative">
      {/* Close button for modal */}
      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-[22px] sm:text-[24px] font-semibold text-gray-900 tracking-tight">
          {mode === 'recover'
            ? 'Reset Password'
            : mode === 'signup'
            ? 'Sign up'
            : 'Sign up or Sign in'}
        </h2>
        <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">
          {mode === 'recover'
            ? 'Enter your email address and we will send you a link to reset or set your password.'
            : 'Enjoy the convenience of a single account across all participating brands'}
        </p>
      </div>

      {/* Mode Switcher Tabs (when not in recover mode) */}
      {mode !== 'recover' && (
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setClientError('');
              setSuccessNotice('');
            }}
            className={`flex-1 py-2.5 text-center text-[14px] font-medium transition-colors cursor-pointer border-b-2 -mb-[1px] ${
              mode === 'signin'
                ? 'border-[#FAA619] text-[#FAA619] font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setClientError('');
              setSuccessNotice('');
            }}
            className={`flex-1 py-2.5 text-center text-[14px] font-medium transition-colors cursor-pointer border-b-2 -mb-[1px] ${
              mode === 'signup'
                ? 'border-[#FAA619] text-[#FAA619] font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Create Account
          </button>
        </div>
      )}

      {/* Server / Client Error Banner */}
      {(clientError || serverError) && (
        <div className="mb-5 p-3.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-start gap-2.5 animate-fadeIn">
          <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1 space-y-1.5 leading-snug">
            <div>{clientError || serverError}</div>
            {serverError &&
              (serverError.toLowerCase().includes('unidentified') ||
                serverError.toLowerCase().includes('incorrect')) && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('recover');
                    setClientError('');
                  }}
                  className="inline-block text-[12px] font-semibold text-[#FAA619] hover:underline cursor-pointer"
                >
                  Forgot your password? Click here to reset it.
                </button>
              )}
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="mb-5 p-3.5 rounded-md bg-green-50 border border-green-200 text-green-800 text-[13px] flex items-start gap-2.5 animate-fadeIn">
          <svg className="w-4 h-4 mt-0.5 shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">{successNotice}</div>
        </div>
      )}

      {/* Authentication Form */}
      {/* return_to in the action URL: if the form submits before hydration
          (plain POST), the login loader still redirects to the right page */}
      <fetcher.Form
        method="post"
        action={`/account/login?return_to=${encodeURIComponent(redirectTo || '/account')}`}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input type="hidden" name="actionType" value={mode} />
        <input type="hidden" name="redirectTo" value={redirectTo} />

        {/* Additional Fields for Registration (First & Last Name) */}
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1" htmlFor="auth-firstname">
                First Name
              </label>
              <input
                id="auth-firstname"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={firstNameInput}
                onChange={(e) => setFirstNameInput(e.target.value)}
                placeholder="First name"
                className="w-full h-[42px] px-3 border border-gray-300 rounded-[3px] text-[14px] text-gray-900 focus:outline-none focus:border-[#FAA619] focus:ring-1 focus:ring-[#FAA619] transition-all"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1" htmlFor="auth-lastname">
                Last Name
              </label>
              <input
                id="auth-lastname"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={lastNameInput}
                onChange={(e) => setLastNameInput(e.target.value)}
                placeholder="Last name"
                className="w-full h-[42px] px-3 border border-gray-300 rounded-[3px] text-[14px] text-gray-900 focus:outline-none focus:border-[#FAA619] focus:ring-1 focus:ring-[#FAA619] transition-all"
              />
            </div>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="block text-[12px] font-medium text-gray-700 mb-1" htmlFor="auth-email">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="auth-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email"
              className="w-full h-[44px] px-3.5 border border-gray-300 rounded-[3px] text-[14px] text-gray-900 focus:outline-none focus:border-[#FAA619] focus:ring-1 focus:ring-[#FAA619] transition-all"
            />
          </div>
        </div>

        {/* Password Field (for Sign In and Sign Up) */}
        {mode !== 'recover' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[12px] font-medium text-gray-700" htmlFor="auth-password">
                Password <span className="text-red-500">*</span>
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('recover');
                    setClientError('');
                    setSuccessNotice('');
                  }}
                  className="text-[12px] font-medium text-[#FAA619] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                id="auth-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-[44px] pl-3.5 pr-10 border border-gray-300 rounded-[3px] text-[14px] text-gray-900 focus:outline-none focus:border-[#FAA619] focus:ring-1 focus:ring-[#FAA619] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {mode === 'signup' && (
              <p className="text-[11px] text-gray-500 mt-1">Minimum 5 characters</p>
            )}
          </div>
        )}

        {/* Confirm Password Field (for Sign Up only) */}
        {mode === 'signup' && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1" htmlFor="auth-confirm-password">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="auth-confirm-password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={confirmPasswordInput}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
              placeholder="Confirm your password"
              className="w-full h-[44px] px-3.5 border border-gray-300 rounded-[3px] text-[14px] text-gray-900 focus:outline-none focus:border-[#FAA619] focus:ring-1 focus:ring-[#FAA619] transition-all"
            />
          </div>
        )}

        {/* Terms and Conditions (Exact Lifestyle Stores wording) */}
        <p className="text-[12px] text-gray-500 text-center pt-2 leading-relaxed">
          By creating your account you agree to our{' '}
          <Link
            to="/policies/terms-of-service"
            className="text-[#FAA619] hover:underline font-medium"
            onClick={isModal ? onClose : undefined}
          >
            Terms and Conditions
          </Link>
        </p>

        {/* Lifestyle Stores Orange Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[46px] bg-[#FAA619] hover:bg-[#e09415] text-white font-semibold text-[14px] uppercase tracking-wider rounded-[3px] transition-colors flex items-center justify-center shadow-sm disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Please wait...</span>
            </div>
          ) : mode === 'recover' ? (
            'Send Reset Link'
          ) : (
            'CONTINUE'
          )}
        </button>

        {/* Back to Sign In (for Forgot Password mode) */}
        {mode === 'recover' && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setClientError('');
                setSuccessNotice('');
              }}
              className="text-[13px] font-medium text-gray-600 hover:text-black cursor-pointer inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Sign In
            </button>
          </div>
        )}
      </fetcher.Form>

      {/* Footer Switcher */}
      {mode === 'signin' && (
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-[13px] text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setClientError('');
                setSuccessNotice('');
              }}
              className="font-semibold text-[#FAA619] hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        </div>
      )}

      {mode === 'signup' && (
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-[13px] text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setClientError('');
                setSuccessNotice('');
              }}
              className="font-semibold text-[#FAA619] hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

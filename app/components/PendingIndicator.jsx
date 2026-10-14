import {useEffect, useRef, useState} from 'react';
import {Form, useNavigation} from 'react-router';

/**
 * Small spinner used inside existing controls while their request or
 * navigation is pending. Respects reduced-motion preferences.
 * @param {{className?: string}}
 */
export function Spinner({className = 'w-4 h-4'}) {
  return (
    <svg
      className={`animate-spin motion-reduce:animate-none ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Spinner laid over a control's existing content. The content stays in the
 * layout (made invisible by the caller), so the control keeps its size.
 * Announced to screen readers via role="status".
 * @param {{label: string, spinnerClassName?: string}}
 */
export function PendingOverlay({label, spinnerClassName}) {
  return (
    <span
      role="status"
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <Spinner className={spinnerClassName} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/**
 * Link to the /checkout gate (which prepares the cart and redirects to
 * Shopify checkout, or to sign-in first). Shows pending feedback on the
 * clicked button for that handoff, ignores repeat clicks while pending, and
 * keeps normal link behaviour for modified clicks (new tab/window).
 * Pending state resets if the page is shown again (Back button / bfcache)
 * or if the navigation never starts.
 * @param {{className?: string, children: React.ReactNode, label?: string}}
 */
export function CheckoutLink({
  className = '',
  children,
  label = 'Opening secure checkout',
}) {
  const [pending, setPending] = useState(false);
  // Synchronous guard: React state only updates after the click handler, so
  // a burst of clicks could otherwise start several navigations.
  const pendingRef = useRef(false);

  useEffect(() => {
    const reset = () => {
      pendingRef.current = false;
      setPending(false);
    };
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  useEffect(() => {
    if (!pending) return undefined;
    const timer = window.setTimeout(() => {
      pendingRef.current = false;
      setPending(false);
    }, 15000);
    return () => window.clearTimeout(timer);
  }, [pending]);

  const handleClick = (event) => {
    const modified =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;
    if (modified) return;
    if (pendingRef.current) {
      event.preventDefault(); // duplicate click while the handoff is running
      return;
    }
    pendingRef.current = true;
    setPending(true);
  };

  return (
    <a
      href="/checkout"
      target="_self"
      onClick={handleClick}
      aria-busy={pending || undefined}
      className={`relative ${className}`}
    >
      <span className={pending ? 'invisible' : undefined}>{children}</span>
      {pending && <PendingOverlay label={label} spinnerClassName="w-5 h-5" />}
    </a>
  );
}


/**
 * Sign Out as a React Router <Form> (same POST /account/logout, but no full
 * page reload). Disabled while the logout request is pending (no spinner).
 * @param {{className?: string, formClassName?: string, children?: React.ReactNode}}
 */
export function SignOutButton({className = '', formClassName, children = 'Sign Out'}) {
  const navigation = useNavigation();
  const pending = Boolean(
    navigation.state !== 'idle' &&
      navigation.formAction?.startsWith('/account/logout'),
  );

  return (
    <Form method="POST" action="/account/logout" className={formClassName}>
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending || undefined}
        className={`relative ${className}`}
      >
        {children}
      </button>
    </Form>
  );
}

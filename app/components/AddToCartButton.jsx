import {useEffect, useRef, useState} from 'react';
import {CartForm} from '@shopify/hydrogen';
import {useDelayedFlag} from '~/hooks/useDelayedFlag';

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 *   onAdded?: (data: unknown) => void;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className = '',
  redirectTo,
  onAdded,
  ...props
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <AddToCartButtonInner
          fetcher={fetcher}
          analytics={analytics}
          disabled={disabled}
          onClick={onClick}
          className={className}
          redirectTo={redirectTo}
          onAdded={onAdded}
          {...props}
        >
          {children}
        </AddToCartButtonInner>
      )}
    </CartForm>
  );
}

function AddToCartButtonInner({
  fetcher,
  analytics,
  children,
  disabled,
  onClick,
  className,
  redirectTo,
  onAdded,
  ...props
}) {
  const isSubmitting = fetcher.state === 'submitting' || (fetcher.state === 'loading' && !fetcher.data);
  // Disable immediately (no double adds), but only show the spinner when the
  // cart request is actually slow, so fast adds don't flash a loader.
  const showSpinner = useDelayedFlag(isSubmitting, 300);
  const lastDataRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (fetcher.data && fetcher.data !== lastDataRef.current) {
      lastDataRef.current = fetcher.data;
      // Only a confirmed cart mutation counts as "added"; Shopify userErrors
      // (e.g. out of stock) must not trigger the success toast.
      const errors = fetcher.data.errors || [];
      if (errors.length > 0) {
        setErrorMessage(
          errors[0]?.message || 'Could not add this item. Please try again.',
        );
        return;
      }
      setErrorMessage('');
      if (onAdded) {
        onAdded(fetcher.data);
      }
    }
  }, [fetcher.data, onAdded]);

  return (
    <>
      <input
        name="analytics"
        type="hidden"
        value={JSON.stringify(analytics)}
      />
      {redirectTo && (
        <input
          name="redirectTo"
          type="hidden"
          value={redirectTo}
        />
      )}
      <button
        type="submit"
        onClick={onClick}
        disabled={disabled ?? isSubmitting}
        className={className}
        {...props}
      >
        {showSpinner ? (
          <span className="inline-flex items-center justify-center">
            <svg
              className="animate-spin w-5 h-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        ) : (
          children
        )}
      </button>
      {errorMessage && !isSubmitting && (
        <p role="alert" className="mt-1.5 text-[12px] text-red-600 text-left">
          {errorMessage}
        </p>
      )}
    </>
  );
}


/** @typedef {import('react-router').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */

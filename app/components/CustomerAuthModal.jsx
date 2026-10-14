import {useEffect} from 'react';
import {useNavigate} from 'react-router';
import {CustomerAuthCard} from './CustomerAuthCard';

/**
 * CustomerAuthModal
 * Modal dialog matching Lifestyle Stores "Sign up or Sign in" popup
 */
export function CustomerAuthModal({
  isOpen,
  onClose,
  initialMode = 'signin',
  redirectTo,
}) {
  const navigate = useNavigate();
  // Close on Escape key and prevent background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop with dark overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-[480px] animate-scaleUp">
        <CustomerAuthCard
          initialMode={initialMode}
          redirectTo={redirectTo}
          isModal={true}
          onClose={onClose}
          onSuccess={() => {
            // Session is already reflected (root loader revalidated after the
            // login POST): just close and stay on the current page, unless a
            // caller asked for a specific destination.
            onClose();
            if (redirectTo) navigate(redirectTo);
          }}
        />
      </div>
    </div>
  );
}

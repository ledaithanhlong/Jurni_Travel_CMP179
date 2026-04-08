import { useUser as useClerkUser } from '@clerk/clerk-react';

/**
 * Safe wrapper for useUser hook that handles cases where ClerkProvider is not available
 * @returns {Object} { user, isLoaded, isSignedIn }
 */
export function useSafeUser() {
  try {
    return useClerkUser();
  } catch (error) {
    console.warn('ClerkProvider not found, returning guest user');
    return {
      user: null,
      isLoaded: true,
      isSignedIn: false
    };
  }
}

/**
 * Check if Clerk is properly configured
 * @returns {boolean}
 */
export function isClerkAvailable() {
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  return Boolean(clerkKey && clerkKey !== 'your_clerk_publishable_key');
}

/**
 * Get user info safely
 * @returns {Object} { name, email, id, isGuest }
 */
export function getSafeUserInfo() {
  const { user, isSignedIn } = useSafeUser();

  if (!isSignedIn || !user) {
    return {
      name: 'Khách',
      email: '',
      id: 'guest',
      isGuest: true
    };
  }

  return {
    name: user.fullName || user.firstName || 'User',
    email: user.primaryEmailAddress?.emailAddress || '',
    id: user.id,
    isGuest: false
  };
}
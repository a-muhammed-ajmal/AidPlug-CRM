import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AuthCallbackHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Check if we have OAuth tokens in the URL hash
    const hash = window.location.hash;

    if (hash && hash.includes('access_token')) {
      // Clear the hash from the URL
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );

      // Wait a moment for auth state to update, then redirect
      const timer = setTimeout(() => {
        if (user) {
          // Get the intended destination from state, or default to dashboard
          const from = location.state?.from || '/dashboard';
          navigate(from, { replace: true });
        }
      }, 500);

      return () => clearTimeout(timer);
    } else if (user && location.pathname === '/') {
      // If user is logged in and on root, redirect to dashboard
      navigate('/dashboard', { replace: true });
    }

    return () => {};
  }, [user, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}

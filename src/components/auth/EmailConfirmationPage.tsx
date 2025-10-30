import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function EmailConfirmationPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    // We wait for the auth state to load. The Supabase client will process the URL fragment.
    if (!loading) {
      if (user) {
        setStatus('success');
        setMessage(
          'Email verified successfully! Redirecting to the dashboard...'
        );
        setTimeout(() => navigate('/dashboard'), 3000);
      } else {
        // If there's no user after loading, the token was likely invalid or expired.
        setStatus('error');
        setMessage(
          'Email verification failed. The link may be invalid or expired. Please try signing up again.'
        );
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Verifying your email...
            </h2>
            <p className="text-gray-600 mt-2">
              Please wait while we confirm your email address.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-green-600">
              Email Verified!
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-red-600">
              Verification Failed
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Create New Account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

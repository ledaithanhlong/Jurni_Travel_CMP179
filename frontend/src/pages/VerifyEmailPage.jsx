import React, { useEffect, useState } from 'react';
import { useSignUp, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmailPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // If already signed in, redirect to home
    if (isSignedIn) {
      navigate('/');
      return;
    }

    // If sign up is complete, activate session
    if (isLoaded && signUp?.status === 'complete') {
      setActive({ session: signUp.createdSessionId })
        .then(() => {
          console.log('Email verification completed, session activated');
          navigate('/');
        })
        .catch((err) => {
          console.error('Error activating session:', err);
          setError('Có lỗi xảy ra khi kích hoạt tài khoản. Vui lòng thử lại.');
        });
    }
  }, [isLoaded, signUp, isSignedIn, setActive, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError('Vui lòng nhập mã xác minh 6 chữ số');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        console.log('Email verification completed, session activated');
        navigate('/');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError(err.errors?.[0]?.message || 'Mã xác minh không đúng. Vui lòng thử lại.');
      setCode('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      alert('Mã xác minh mới đã được gửi đến email của bạn!');
    } catch (err) {
      console.error('Error resending code:', err);
      setError('Không thể gửi lại mã xác minh. Vui lòng thử lại sau.');
    } finally {
      setIsResending(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show verification form with code input
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác minh email</h1>
        <p className="text-gray-600 mb-6">
          Chúng tôi đã gửi một mã xác minh 6 chữ số đến địa chỉ email của bạn. 
          Vui lòng nhập mã để xác minh tài khoản.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Mã xác minh
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(value);
                setError('');
              }}
              placeholder="Nhập mã 6 chữ số"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-center text-2xl tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying || code.length !== 6}
            className="w-full bg-sky-700 text-white py-3 px-4 rounded-lg hover:bg-sky-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isVerifying ? 'Đang xác minh...' : 'Xác minh'}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleResend}
            disabled={isResending}
            className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
          >
            {isResending ? 'Đang gửi...' : 'Gửi lại mã xác minh'}
          </button>
          <button
            onClick={() => navigate('/sign-up')}
            className="w-full text-gray-600 py-2 px-4 rounded-lg hover:text-gray-800 transition text-sm"
          >
            Quay lại đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}


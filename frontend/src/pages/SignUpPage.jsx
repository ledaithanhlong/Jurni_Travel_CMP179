import React, { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email verification states
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoaded) return;

    setError('');
    setLoading(true);

    try {
      // Create the sign up
      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });

      // Send the email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Show verification code input
      setPendingVerification(true);
      setLoading(false);
    } catch (err) {
      console.error('Sign up error:', err);

      if (err.errors && err.errors.length > 0) {
        const errorMessage = err.errors[0].message;
        if (errorMessage.includes('password')) {
          setError('Mật khẩu phải có ít nhất 8 ký tự.');
        } else if (errorMessage.includes('email')) {
          setError('Email đã được sử dụng hoặc không hợp lệ.');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();

    if (!isLoaded) return;

    setError('');
    setLoading(true);

    try {
      // Verify the email code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        // Set the active session
        await setActive({ session: completeSignUp.createdSessionId });
        // Redirect to home
        navigate('/');
      } else {
        setError('Xác thực không thành công. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Verification error:', err);

      if (err.errors && err.errors.length > 0) {
        const errorMessage = err.errors[0].message;
        if (errorMessage.includes('code')) {
          setError('Mã xác thực không đúng. Vui lòng kiểm tra lại.');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  // If pending verification, show verification form
  if (pendingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-dark">
              Xác thực email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Chúng tôi đã gửi mã xác thực đến <span className="font-semibold">{email}</span>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleVerification}>
            <div className="rounded-lg shadow-lg bg-white p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Mã xác thực
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-dark focus:border-blue-dark sm:text-sm text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Nhập mã 6 chữ số từ email
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !code}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-dark hover:bg-blue-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
                >
                  {loading ? 'Đang xác thực...' : 'Xác thực'}
                </button>
              </div>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600">
            Không nhận được email?{' '}
            <button
              onClick={() => {
                setPendingVerification(false);
                setCode('');
                setError('');
              }}
              className="font-medium text-orange-accent hover:text-orange-hover transition"
            >
              Thử lại
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Initial sign up form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-dark">
            Tạo tài khoản
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hoặc{' '}
            <Link to="/sign-in" className="font-medium text-orange-accent hover:text-orange-hover transition">
              đăng nhập với tài khoản có sẵn
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-lg shadow-lg bg-white p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Name inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên <span className="text-gray-400">(tùy chọn)</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-dark focus:border-blue-dark sm:text-sm"
                  placeholder="Tên"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Họ <span className="text-gray-400">(tùy chọn)</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-dark focus:border-blue-dark sm:text-sm"
                  placeholder="Họ"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-dark focus:border-blue-dark sm:text-sm"
                placeholder="Email của bạn"
                disabled={loading}
              />
            </div>

            {/* Password input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-dark focus:border-blue-dark sm:text-sm pr-10"
                  placeholder="Ít nhất 8 ký tự"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Mật khẩu phải có ít nhất 8 ký tự
              </p>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading || !isLoaded}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-dark hover:bg-blue-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tạo tài khoản...
                  </span>
                ) : (
                  'Đăng ký'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <div>
              <button
                type="button"
                onClick={() => signUp.authenticateWithRedirect({
                  strategy: 'oauth_google',
                  redirectUrl: '/sso-callback',
                  redirectUrlComplete: '/'
                })}
                disabled={loading || !isLoaded}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Đăng ký bằng Google
              </button>
            </div>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/sign-in" className="font-medium text-orange-accent hover:text-orange-hover transition">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

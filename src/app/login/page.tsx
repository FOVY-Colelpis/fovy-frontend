'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, userAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

type LoginStep = 'username' | 'password';

export default function LoginPage() {
  const [currentStep, setCurrentStep] = useState<LoginStep>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  // 檢查自動登入
  useEffect(() => {
    checkAutoLogin();
  }, []);

  // 檢查自動登入
  const checkAutoLogin = async () => {
    try {
      const user = await userAPI.checkAutoLogin();
      if (user) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Auto login check failed:', error);
    }
  };

  // 檢查 username 是否存在
  const checkUsernameExists = async (username: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await authAPI.checkUsername(username);
      return data.exists;
    } catch (error) {
      console.error('Error checking username:', error);
      setError('Network error, please try again');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameNext = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setError('');
    const exists = await checkUsernameExists(username);
    
    if (exists) {
      setCurrentStep('password');
    } else {
      setError('Username does not exist');
    }
  };

  const handlePasswordNext = async () => {
    if (!password.trim()) {
      setPasswordError('Please enter a password');
      return;
    }
    setPasswordError('');
    setError('');
    await handleLogin();
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await login(username, password);
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        // 檢查是否是密碼錯誤（後端返回 'Invalid credentials'）
        if (result.error && (result.error.toLowerCase().includes('password') || result.error.toLowerCase().includes('invalid credentials'))) {
          setPasswordError('Incorrect password');
        } else {
          setError(result.error || 'Login failed, please try again');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'password') {
      setCurrentStep('username');
      setPassword('');
    }
    setError('');
    setPasswordError('');
  };

  return (
    <div className="min-h-screen bg-[#0B0A44] flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">

        {/* 錯誤訊息 */}
        {error && (
          <div className="text-[#CB410F] mb-4 text-center text-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-white text-4xl font-bold text-center mb-8">Login</h2>
          
          {/* Username 輸入框 - 始終顯示 */}
          <div className="flex justify-center">
            <div className="relative w-full">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1a1a2e]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && currentStep === 'username' && handleUsernameNext()}
                className="w-full pl-12 pr-4 py-4 bg-[#E0E0E0] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-xl placeholder-gray-500"
                disabled={isLoading || currentStep === 'password'}
                style={{
                  opacity: currentStep === 'password' ? 0.7 : 1,
                  cursor: currentStep === 'password' ? 'not-allowed' : 'text'
                }}
              />
            </div>
          </div>

          {/* Next 按鈕 - 只在 username 步驟顯示 */}
          {currentStep === 'username' && (
            <div className="flex justify-center">
              <button
                onClick={handleUsernameNext}
                disabled={isLoading}
                className="w-full bg-[#D2691E] text-white py-4 rounded-lg font-bold hover:opacity-80 transition-opacity disabled:opacity-50 text-lg border-none shadow-none outline-none"
              >
                {isLoading ? 'checking...' : 'Next'}
              </button>
            </div>
          )}

          {/* Password 輸入框 - 在 password 步驟顯示 */}
          {currentStep === 'password' && (
            <>
              <div className="flex justify-center">
                <div className="relative w-full">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1a1a2e]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) {
                        setPasswordError('');
                      }
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handlePasswordNext()}
                    className="w-full pl-12 pr-4 py-4 bg-[#E0E0E0] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-xl placeholder-gray-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              {/* 密碼錯誤提示 */}
              {passwordError && (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {passwordError}
                </div>
              )}

              {/* 按鈕組 */}
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-600 text-white py-4 rounded-lg font-bold hover:opacity-80 transition-opacity text-lg border-none shadow-none outline-none"
                >
                  Back
                </button>
                <button
                  onClick={handlePasswordNext}
                  disabled={isLoading}
                  className="flex-1 bg-[#D2691E] text-white py-4 rounded-lg font-bold hover:opacity-80 transition-opacity disabled:opacity-50 text-lg border-none shadow-none outline-none"
                >
                  {isLoading ? 'Loading...' : 'Login'}
                </button>
              </div>
            </>
          )}

          {/* 註冊提示 */}
          <div className="text-center mt-6">
            <span className="text-gray-300 text-sm">Don't have a Fovy account? </span>
            <button
              onClick={() => router.push('/signup')}
              className="text-white text-sm underline hover:opacity-80 transition-opacity bg-transparent border-none outline-none cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

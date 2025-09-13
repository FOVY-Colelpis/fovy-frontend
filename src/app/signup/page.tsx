'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [nameError, setNameError] = useState('');
  const [countryError, setCountryError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameConfirmed, setUsernameConfirmed] = useState(false);
  
  const { checkUsername, register } = useAuth();
  const router = useRouter();

  // 當頁面載入時重置狀態
  useEffect(() => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: ''
    });
    setError('');
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setTermsError('');
    setNameError('');
    setCountryError('');
    setShowPassword(false);
    setAgreedToTerms(false);
    setIsLoading(false);
    setIsCheckingUsername(false);
    setUsernameConfirmed(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除相關錯誤
    if (usernameError) {
      setUsernameError('');
    }
    if (emailError && name === 'email') {
      setEmailError('');
    }
    if (passwordError && name === 'password') {
      setPasswordError('');
    }
    if (nameError && (name === 'firstName' || name === 'lastName')) {
      setNameError('');
    }
    if (usernameConfirmed) {
      setUsernameConfirmed(false);
    }
  };

  const checkUsernameAvailability = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setUsernameError('Please enter both first and last name');
      return false;
    }
    const username = `${formData.firstName}${formData.lastName}`; // Case-sensitive
    setIsCheckingUsername(true);
    setUsernameError('');
    try {
      const exists = await checkUsername(username); // checkUsername returns true if exists
      if (exists) { // Corrected logic: if exists, then it's taken
        setUsernameError('This username already exists');
        setUsernameConfirmed(false);
        return false;
      }
      setUsernameConfirmed(true);
      return true;
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameError('Error checking username availability');
      setUsernameConfirmed(false);
      return false;
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleSignup = async () => {
    // 清除所有錯誤
    setError('');
    setEmailError('');
    setPasswordError('');
    setTermsError('');
    setNameError('');
    setCountryError('');
    
    // 基本驗證
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setNameError('Please enter both first and last name');
      return;
    }
    if (!formData.email.trim()) {
      setEmailError('Please enter your email');
      return;
    }
    if (!formData.password.trim()) {
      setPasswordError('Please enter a password');
      return;
    }
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    // 驗證國家選擇
    const countrySelect = document.querySelector('select') as HTMLSelectElement;
    if (!countrySelect || !countrySelect.value) {
      setCountryError('Please select a country');
      return;
    }
    
    if (!agreedToTerms) {
      setTermsError('Please agree to the terms and conditions');
      return;
    }
    
    // 自動驗證用戶名（如果還沒有確認）
    if (!usernameConfirmed) {
      const isUsernameAvailable = await checkUsernameAvailability();
      if (!isUsernameAvailable) {
        return;
      }
    }

    setIsLoading(true);
    setError('');
    try {
      const username = `${formData.firstName}${formData.lastName}`; // Case-sensitive
      const result = await register(
        username,
        formData.email,
        formData.password,
        'freelancer',
        formData.firstName,
        formData.lastName,
        formData.phoneNumber
      );

      if (result.success) {
        alert('Account created successfully! Please log in with your new account.');
        router.push('/login');
      } else {
        setError(result.error || 'Failed to create account, please try again');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    router.push('/');
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
          {/* Google 登入按鈕 */}
          <button
            disabled
            className="w-full bg-gray-200 text-gray-700 py-4 rounded-lg font-medium hover:opacity-80 transition-opacity disabled:opacity-50 text-lg border border-gray-300 flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* 分隔線 */}
          <div className="relative flex items-center">
            <div className="flex-1 border-t border-gray-600"></div>
            <div className="px-4 text-gray-400 text-sm">or</div>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>
          
          {/* 姓名輸入 */}
          <div>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1a1a2e]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-[#E0E0E0] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-lg placeholder-gray-500"
                  disabled={isLoading || isCheckingUsername}
                />
              </div>
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1a1a2e]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-[#E0E0E0] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-lg placeholder-gray-500"
                  disabled={isLoading || isCheckingUsername}
                />
              </div>
            </div>
            {nameError && (
              <div className="text-red-500 text-sm mt-2 text-center">
                {nameError}
              </div>
            )}
          </div>

          {/* 用戶名預覽和確認按鈕 */}
          {formData.firstName && formData.lastName && (
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm">Username:</span>
                <span className="text-[#D2691E] text-sm font-bold">
                  {formData.firstName}{formData.lastName}
                </span>
              </div>
              {!usernameConfirmed && !usernameError && (
                <button
                  onClick={checkUsernameAvailability}
                  disabled={isCheckingUsername}
                  className="bg-[#D2691E] text-white px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity disabled:opacity-50 text-sm"
                >
                  {isCheckingUsername ? 'Checking...' : 'Check'}
                </button>
              )}
              {usernameConfirmed && (
                <span className="text-green-500 text-sm font-medium">✓ Available</span>
              )}
              {usernameError && !usernameConfirmed && (
                <span className="text-red-500 text-sm font-medium">✗ Already exists</span>
              )}
            </div>
          )}

          {/* 電子郵件 */}
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1a1a2e]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 bg-[#E0E0E0] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-lg placeholder-gray-500"
                disabled={isLoading}
              />
            </div>
            {emailError && (
              <div className="text-red-500 text-sm mt-2 text-center">
                {emailError}
              </div>
            )}
          </div>

          {/* 密碼 */}
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1a1a2e]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-4 bg-[#E0E0E0] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-lg placeholder-gray-500"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#1a1a2e] hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && (
              <div className="text-red-500 text-sm mt-2 text-center">
                {passwordError}
              </div>
            )}
          </div>

          {/* 國家選擇 */}
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1a1a2e]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <select
                className="w-full pl-12 pr-10 py-4 bg-[#E0E0E0] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-lg appearance-none cursor-pointer"
                disabled={isLoading}
                onChange={(e) => {
                  if (countryError) {
                    setCountryError('');
                  }
                }}
              >
                <option value="" className="bg-[#E0E0E0] text-[#1a1a2e]">Country</option>
                <option value="TW" className="bg-[#E0E0E0] text-[#1a1a2e]">Taiwan</option>
                <option value="US" className="bg-[#E0E0E0] text-[#1a1a2e]">United States</option>
                <option value="UK" className="bg-[#E0E0E0] text-[#1a1a2e]">United Kingdom</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {countryError && (
              <div className="text-red-500 text-sm mt-2 text-center">
                {countryError}
              </div>
            )}
          </div>

          {/* 電話號碼 */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1a1a2e]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number (Optional)"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-4 bg-[#E0E0E0] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-lg placeholder-gray-500"
              disabled={isLoading}
            />
          </div>

          {/* 條款同意 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="tips"
                className="w-4 h-4 text-[#D2691E] bg-transparent border-gray-500 rounded focus:ring-[#D2691E] focus:ring-2"
                disabled={isLoading}
              />
              <label htmlFor="tips" className="text-gray-300 text-sm">
                Send me tips to grow my skills and find projects.
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (termsError) {
                    setTermsError('');
                  }
                }}
                className="w-4 h-4 text-[#D2691E] bg-transparent border-gray-500 rounded focus:ring-[#D2691E] focus:ring-2"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-gray-300 text-sm">
                I agree to the FOVY Terms of Service and Privacy Policy.
              </label>
            </div>
            {termsError && (
              <div className="text-red-500 text-sm text-center">
                {termsError}
              </div>
            )}
          </div>

          {/* 註冊按鈕 */}
          <div className="flex justify-center">
            <button
              onClick={handleSignup}
              disabled={isLoading || isCheckingUsername}
              className="w-full bg-[#D2691E] text-white py-4 rounded-lg font-bold hover:opacity-80 transition-opacity disabled:opacity-50 text-lg border-none shadow-none outline-none"
            >
              {isLoading ? 'Creating Account...' : 'Create my account'}
            </button>
          </div>

          {/* 登入提示 */}
          <div className="text-center mt-6">
            <span className="text-gray-300 text-sm">Already have an account? </span>
            <button
              onClick={() => router.push('/login')}
              className="text-white text-sm underline hover:opacity-80 transition-opacity bg-transparent border-none outline-none cursor-pointer"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

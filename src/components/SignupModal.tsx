'use client';

import { useState } from 'react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 如果是電話號碼，只允許數字
    if (name === 'phoneNumber') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSignup = async () => {
    // 驗證必填欄位
    if (!formData.firstName.trim() || !formData.lastName.trim() || 
        !formData.email.trim() || !formData.password.trim() || 
        !formData.phoneNumber.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: 實作實際的註冊邏輯
      console.log('Signup with:', formData);
      // 這裡之後會調用 Django 後端的註冊 API
      
      // 模擬註冊延遲
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 顯示註冊成功提示
      alert('Account created successfully!');
      onClose();
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to create account, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: ''
    });
    setError('');
    setShowPassword(false);
    setAgreedToTerms(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full flex items-start justify-center pt-[10vh] z-[10000]"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
              <div className="relative bg-[white] p-[15px] w-[500px] max-w-[90vw] rounded-[15px] shadow-2xl">
        {/* 關閉按鈕 */}
        <button
          onClick={handleClose}
          className="absolute right-[0px] top-[0px] text-gray-500 text-[30px] hover:scale-115 duration-300 z-10 border-none outline-none bg-transparent p-2"
        >
          ×
        </button>

        {/* 標題 */}
        <h2 className="text-[#1a1a2e] text-[30px] font-bold text-center mb-[15px]">
          Sign up to find work you love
        </h2>

        {/* 錯誤訊息 */}
        {error && (
          <div className="text-[#CB410F] mb-[15px] text-center text-[15px]">
            {error}
          </div>
        )}

        {/* 表單 */}
        <div className="space-y-4">
          {/* First Name & Last Name */}
          <div className="flex space-x-[15px]">
            <div className="flex-1">
              <label className="block text-[#1a1a2e] text-[15px] font-medium">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-[15px] py-[5px] bg-[#F5F5F5] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-[20px]"
                placeholder="First name"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[#1a1a2e] text-[15px] font-medium">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-[15px] py-[5px] bg-[#F5F5F5] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-[20px]"
                placeholder="Last name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#1a1a2e] text-[15px] font-medium mt-[15px]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-[15px] py-[5px] bg-[#F5F5F5] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-[20px]"
              placeholder="Email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[#1a1a2e] text-[15px] font-medium mt-[15px]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-[15px] py-[5px] bg-[#F5F5F5] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-[20px] pr-12"
                placeholder="Password (8 or more characters)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[0px] top-1/2 text-[20px] transform -translate-y-1/2 hover:text-gray-700 border-none outline-none bg-transparent"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Phone Numbe*/}
          <div>
            <label className="block text-[#1a1a2e] text-[15px] font-medium mt-[15px]">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-[15px] py-[5px] bg-[#F5F5F5] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-[20px]"
              placeholder="Phone Number"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-start space-x-3 pt-[15px]">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 text-[#D2691E] rounded focus:ring-[#D2691E]"
            />
            <label htmlFor="terms" className="text-[#1a1a2e] text-[15px] leading-relaxed">
              Yes, I understand and agree to the{' '}
              <span className="text-[#D2691E] underline cursor-pointer">Terms of Service</span>
              , including the{' '}
              <span className="text-[#D2691E] underline cursor-pointer">User Agreement</span>
              {' '}and{' '}
              <span className="text-[#D2691E] underline cursor-pointer">Privacy Policy</span>
              .
            </label>
          </div>

          {/* Sign up Button */}
          <div className="flex justify-center mt-[30px]">
            <button
              onClick={handleSignup}
              disabled={isLoading}
              className="bg-[#14A800] text-[white] border-none outline-none py-[10px] px-[15px] rounded-[5px] font-bold hover:opacity-80 transition-opacity disabled:opacity-50 text-[15px]"
            >
              {isLoading ? 'Creating account...' : 'Create my account'}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <span className="text-[#1a1a2e] text-[15px]">
              Already have an account?{' '}
              <span 
                className="text-[#D2691E] underline cursor-pointer hover:opacity-80"
                onClick={() => {
                  onClose();
                  onSwitchToLogin?.();
                }}
              >
                Log In
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

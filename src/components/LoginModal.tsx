'use client';

import { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LoginStep = 'username' | 'password' | 'login';

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [currentStep, setCurrentStep] = useState<LoginStep>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 模擬 API 檢查 username 是否存在
  const checkUsernameExists = async (username: string): Promise<boolean> => {
    // TODO: 替換為真實的 Django API 調用
    setIsLoading(true);
    try {
      // 模擬 API 延遲
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模擬一些存在的用戶名
      const existingUsernames = ['admin', 'user', 'test', 'demo'];
      return existingUsernames.includes(username.toLowerCase());
    } catch (error) {
      console.error('Error checking username:', error);
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
      setError('Please enter a password');
      return;
    }
    setError('');
    await handleLogin();
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // TODO: 實作實際的登入邏輯
      console.log('Login with:', { username, password });
      // 這裡之後會調用 Django 後端的登入 API
      
      // 模擬登入延遲
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 顯示登入成功提示
      alert('Success！');
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login, please try again');
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
  };

  const handleClose = () => {
    setCurrentStep('username');
    setUsername('');
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full flex items-start justify-center pt-[15vh] z-[10000]"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div className="relative bg-[#0B0A44] p-8 w-[400px] max-w-[90vw] rounded-[15px]">
        {/* 關閉按鈕 */}
        <button
          onClick={handleClose}
          className="absolute right-[0px] top-[0px] text-[white] text-[30px] hover:scale-115 duration-300 z-10 border-none outline-none bg-transparent"
        >
          ×
        </button>

        {/* 錯誤訊息 */}
        {error && (
          <div className="text-[#CB410F] mb-4 text-center">
            {error}
          </div>
        )}

        {/* Username 步驟 */}
        {currentStep === 'username' && (
          <div className="space-y-6 justify-center">
            <h2 className="text-[white]  text-[50px] font-bold text-center mb-8">Login</h2>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute left-[10px] top-1/2 transform -translate-y-1/2 text-[#1a1a2e] text-[30px]">
                  👤
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUsernameNext()}
                  className="w-48 pl-[50px] pr-4 py-4 bg-[#E0E0E0] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-[30px]"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleUsernameNext}
                disabled={isLoading}
                className="w-48 bg-[#D2691E] text-[white] mr-[30px] my-[15px] rounded-full font-bold hover:opacity-80 transition-opacity disabled:opacity-50 text-[20px] border-none shadow-none outline-none"
              >
                {isLoading ? 'checking...' : 'next >'}
              </button>
            </div>
          </div>
        )}

        {/* Password 步驟 */}
        {currentStep === 'password' && (
          <div className="space-y-6">
            <h2 className="text-[white] text-[50px] font-bold text-center mb-8">Input Password</h2>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute left-[10px] top-1/2 transform -translate-y-1/2 text-[#1a1a2e] text-[30px]">
                  🔒
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordNext()}
                  className="w-48 pl-[50px] pr-4 py-4 bg-[#E0E0E0] text-[#1a1a2e] rounded-full border-none outline-none focus:ring-2 focus:ring-[#D2691E] text-[30px]"
                />
              </div>
            </div>
            <div className="flex space-x-3 justify-center my-[15px]">
              <button
                onClick={handleBack}
                className="w-24 bg-gray-600 text-[black] py-5 rounded-full font-bold hover:opacity-80 transition-opacity text-[20px] border-none shadow-none outline-none"
              >
                back
              </button>
              <button
                onClick={handlePasswordNext}
                disabled={isLoading}
                className="w-24 bg-[#D2691E] text-[white] py-5 rounded-full font-bold hover:opacity-80 transition-opacity disabled:opacity-50 text-[20px] border-none shadow-none outline-none"
              >
                {isLoading ? 'loading...' : 'login'}
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

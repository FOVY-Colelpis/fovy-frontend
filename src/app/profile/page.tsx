'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authAPI } from '@/lib/api';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
}

export default function ProfilePage() {
  const { user, isLoggedIn, updateUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: ''
  });
  const [errors, setErrors] = useState<Partial<ProfileData> & { general?: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  // 檢查登入狀態
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    if (user) {
      // 從用戶資料中提取姓名
      setProfileData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || ''
      });
    }
  }, [isLoggedIn, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // 如果名字有改變，自動更新用戶名
      if (name === 'firstName' || name === 'lastName') {
        const newUsername = `${newData.firstName}${newData.lastName}`.trim();
        newData.username = newUsername;
      }
      
      return newData;
    });
    
    // 清除對應的錯誤
    if (errors[name as keyof ProfileData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileData> = {};
    
    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.updateProfile({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone
      });
      
      if (response.success) {
        // 更新全局用戶資料
        if (response.user) {
          updateUser(response.user);
        }
        
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        
        // 3秒後清除成功訊息
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setErrors({ general: response.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Network error, please try again' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // 重置為原始資料
    if (user) {
      setProfileData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || ''
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B0A44] p-4 pt-20">
      <div className="max-w-2xl mx-auto">
        {/* 標題 */}
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-2">Profile</h1>
          <p className="text-gray-300">Manage your personal information</p>
        </div>

        {/* 成功訊息 */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-600 text-white rounded-lg">
            {successMessage}
          </div>
        )}

        {/* 錯誤訊息 */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-lg">
            {errors.general}
          </div>
        )}

        {/* 個人資料表單 */}
        <div className="bg-[#1a1a2e] rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 姓名 */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-600'
                } bg-[#2a2a3e] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#D2691E] focus:border-transparent ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-600'
                } bg-[#2a2a3e] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#D2691E] focus:border-transparent ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* 用戶名 */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-[#2a2a3e] text-gray-400 cursor-not-allowed"
                placeholder="Username updates automatically"
              />
              <p className="text-gray-500 text-xs mt-1">
                {isEditing 
                  ? "Username updates automatically when you change your name" 
                  : "Username updates automatically when you change your name"
                }
              </p>
            </div>

            {/* 電子郵件 */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                } bg-[#2a2a3e] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#D2691E] focus:border-transparent ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* 電話號碼 */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border border-gray-600 bg-[#2a2a3e] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#D2691E] focus:border-transparent ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* 按鈕組 */}
          <div className="flex justify-end space-x-4 mt-8">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#D2691E] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#B85A1A] transition-colors duration-200"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-[#D2691E] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#B85A1A] transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

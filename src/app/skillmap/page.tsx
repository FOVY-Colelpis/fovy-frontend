'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { skillmapAPI } from '@/lib/api';

interface SkillMapData {
  skill_tree_json: string;
  has_data: boolean;
  skillmap_id: number | null;
  name: string | null;
}

interface SkillMapStatus {
  has_pdf: boolean;
  is_processed: boolean;
  has_skill_tree: boolean;
  created_at: string | null;
  updated_at: string | null;
  name: string | null;
  is_active: boolean;
}

interface SkillMapItem {
  id: number;
  name: string;
  is_active: boolean;
  has_pdf: boolean;
  is_processed: boolean;
  has_skill_tree: boolean;
  created_at: string;
  updated_at: string;
}

export default function SkillMapPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [skillMapData, setSkillMapData] = useState<SkillMapData | null>(null);
  const [status, setStatus] = useState<SkillMapStatus | null>(null);
  const [skillmaps, setSkillmaps] = useState<SkillMapItem[]>([]);
  const [currentSkillmapId, setCurrentSkillmapId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    loadSkillMapData();
  }, [isLoggedIn, router]);

  const loadSkillMapData = async (skillmapId?: number) => {
    try {
      setIsLoading(true);
      setError('');
      
      const [skillTreeResponse, statusResponse, skillmapsResponse] = await Promise.all([
        skillmapAPI.getSkillTree(skillmapId),
        skillmapAPI.getStatus(skillmapId),
        skillmapAPI.listSkillmaps()
      ]);
      
      if (skillTreeResponse.success) {
        setSkillMapData(skillTreeResponse);
        setCurrentSkillmapId(skillTreeResponse.skillmap_id);
      }
      
      if (statusResponse.success) {
        setStatus(statusResponse);
      }
      
      if (skillmapsResponse.success) {
        setSkillmaps(skillmapsResponse.skillmaps);
      }
    } catch (err) {
      console.error('Failed to load skill map data:', err);
      setError('Failed to load skill map data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 檢查文件類型
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file');
      return;
    }

    // 檢查文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Maximum 10MB allowed');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      setSuccessMessage('');

      const response = await skillmapAPI.uploadPdf(file);
      
      if (response.success) {
        setSuccessMessage(`PDF uploaded successfully: ${response.file_name}`);
        setShowSuccessMessage(true);
        // 重新載入數據
        await loadSkillMapData();
      } else {
        setError(response.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      // 清空文件輸入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const closeSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage('');
  };

  const handleSwitchSkillmap = async (skillmapId: number) => {
    try {
      const response = await skillmapAPI.switchSkillmap(skillmapId);
      if (response.success) {
        setCurrentSkillmapId(skillmapId);
        await loadSkillMapData(skillmapId);
        setSuccessMessage(`Switched to ${response.name}`);
        setShowSuccessMessage(true);
      } else {
        setError(response.error || 'Failed to switch skillmap');
      }
    } catch (err) {
      console.error('Failed to switch skillmap:', err);
      setError('Failed to switch skillmap');
    }
  };

  const handleDeleteClick = (skillmapId: number) => {
    setDeleteTargetId(skillmapId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    
    try {
      const response = await skillmapAPI.deleteSkillmap(deleteTargetId);
      if (response.success) {
        setSuccessMessage(`Deleted ${response.message}`);
        setShowSuccessMessage(true);
        await loadSkillMapData();
      } else {
        setError(response.error || 'Failed to delete skillmap');
      }
    } catch (err) {
      console.error('Failed to delete skillmap:', err);
      setError('Failed to delete skillmap');
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  // 成功提示自動消失
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        closeSuccessMessage();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-white text-xl">Loading skill map...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Skill Map</h1>
          <p className="text-gray-400">Visualize your skills and their relationships</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Skill Map */}
          <div className="lg:col-span-2">
            <div className="bg-[#2a2a3e] rounded-lg p-6 h-[600px] border border-gray-600">
              <div className="h-full flex items-center justify-center">
                {skillMapData?.has_data ? (
                  <div className="text-center">
                    <div className="text-green-400 text-lg mb-4">✓ Skill Map Data Available</div>
                    <div className="text-gray-400 text-sm">
                      JSON data length: {skillMapData.skill_tree_json.length} characters
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      Skill map visualization will be implemented here
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-gray-400 text-lg mb-4">No skill map data available</div>
                    <div className="text-gray-500 text-sm">
                      Upload a PDF to generate your skill map
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Summary */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Skill Count */}
              <div className="bg-[#2a2a3e] rounded-lg p-6 border border-gray-600">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-2xl font-bold">
                      {skillMapData?.has_data ? '80' : '0'}
                    </span>
                  </div>
                  <div className="text-white text-sm">skills</div>
                </div>
              </div>

              {/* Completion */}
              <div className="bg-[#2a2a3e] rounded-lg p-6 border border-gray-600">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-2xl font-bold">
                      {skillMapData?.has_data ? '65' : '0'}
                    </span>
                  </div>
                  <div className="text-white text-sm">completed</div>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-[#2a2a3e] rounded-lg p-6 border border-gray-600">
                <h3 className="text-white text-lg font-semibold mb-4">Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">PDF Uploaded:</span>
                    <span className={status?.has_pdf ? 'text-green-400' : 'text-red-400'}>
                      {status?.has_pdf ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Processed:</span>
                    <span className={status?.is_processed ? 'text-green-400' : 'text-yellow-400'}>
                      {status?.is_processed ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Skill Tree:</span>
                    <span className={status?.has_skill_tree ? 'text-green-400' : 'text-red-400'}>
                      {status?.has_skill_tree ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#2a2a3e] rounded-full px-6 py-3 border border-gray-600 flex items-center space-x-4 max-w-[90vw] overflow-x-auto">
          {/* Delete Button - 只有當有當前技能樹時才顯示 */}
          {currentSkillmapId && (
            <button 
              onClick={() => handleDeleteClick(currentSkillmapId)}
              className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
              title="刪除當前技能樹"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="w-10 h-10 bg-[#D2691E] rounded-full flex items-center justify-center hover:bg-[#B85A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="上傳新 PDF"
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </button>

          {/* Skill Map Buttons - 顯示所有技能樹 */}
          {skillmaps.map((skillmap) => (
            <button
              key={skillmap.id}
              onClick={() => handleSwitchSkillmap(skillmap.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                skillmap.is_active 
                  ? 'bg-blue-600 hover:bg-blue-500' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              title={skillmap.name}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          ))}

          {/* Home Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors"
            title="返回首頁"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Messages */}
        {error && (
          <div className="fixed top-24 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {error}
          </div>
        )}
        
        {showSuccessMessage && successMessage && (
          <div className="fixed top-24 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2">
            <span>{successMessage}</span>
            <button
              onClick={closeSuccessMessage}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#2a2a3e] rounded-lg p-6 max-w-md w-full mx-4 border border-gray-600">
              <h3 className="text-white text-lg font-semibold mb-4">確認刪除</h3>
              <p className="text-gray-300 mb-6">
                您確定要刪除此技能樹嗎？此操作無法復原。
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                >
                  刪除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

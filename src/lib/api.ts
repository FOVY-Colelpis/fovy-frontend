// API 基礎 URL - 可透過環境變數控制
const USE_LOCAL_BACKEND = process.env.NEXT_PUBLIC_USE_LOCAL_BACKEND === 'true';
const API_BASE = (USE_LOCAL_BACKEND
  ? 'http://localhost:8000/api'
  : 'https://fovy-backend.onrender.com/api');

// Debug: 顯示當前使用的 API 基礎 URL
console.log('🔧 API Configuration:', {
  USE_LOCAL_BACKEND,
  API_BASE,
  NODE_ENV: process.env.NODE_ENV
});

// 通用 API 調用函數
async function apiCall(endpoint: string, options: RequestInit = {}) {
  // 獲取認證 token
  const token = localStorage.getItem('fovy_token');
  
  console.log(`API Call: ${API_BASE}${endpoint}`, {
    token: token ? `${token.substring(0, 10)}...` : 'No token',
    method: options.method || 'GET'
  });
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Token ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  console.log(`API Response: ${response.status} ${response.statusText}`);

  const data = await response.json();

  // 對於認證相關的錯誤（400, 401），返回錯誤數據而不是拋出異常
  if (!response.ok && (response.status === 400 || response.status === 401)) {
    console.log('API Error:', data);
    return data;
  }

  if (!response.ok) {
    console.log('API Network Error:', response.status, data);
    throw new Error(`API call failed: ${response.status}`);
  }

  return data;
}

// 認證相關 API
export const authAPI = {
  // 檢查用戶名是否存在
  checkUsername: async (username: string) => {
    return apiCall('/auth/check-username/', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  },

  // 用戶登入
  login: async (username: string, password: string) => {
    return apiCall('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // 用戶註冊
  register: async (username: string, email: string, password: string, userType: string = 'freelancer', firstName: string = '', lastName: string = '', phone: string = '') => {
    return apiCall('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ 
        username, 
        email, 
        password, 
        user_type: userType,
        first_name: firstName,
        last_name: lastName,
        phone: phone
      }),
    });
  },

  // 驗證 token
  verifyToken: async (token: string) => {
    return apiCall('/auth/verify-token/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  // 登出
  logout: async (token: string) => {
    return apiCall('/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  // 更新個人資料
  updateProfile: async (profileData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }) => {
    return apiCall('/auth/update-profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // 更改密碼
  changePassword: async (passwordData: {
    current_password: string;
    new_password: string;
  }) => {
    return apiCall('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },
};

// 用戶管理
export const userAPI = {
  // 獲取當前用戶資訊
  getCurrentUser: () => {
    const userStr = localStorage.getItem('fovy_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 獲取 token
  getToken: () => {
    return localStorage.getItem('fovy_token');
  },

  // 清除用戶資料
  clearUser: () => {
    localStorage.removeItem('fovy_token');
    localStorage.removeItem('fovy_user');
  },

  // 檢查是否已登入
  isLoggedIn: () => {
    return !!localStorage.getItem('fovy_token');
  },

  // 自動登入檢查
  checkAutoLogin: async () => {
    const token = localStorage.getItem('fovy_token');
    if (!token) return null;

    try {
      const data = await authAPI.verifyToken(token);
      if (data.success) {
        localStorage.setItem('fovy_user', JSON.stringify(data.user));
        return data.user;
      } else {
        localStorage.removeItem('fovy_token');
        localStorage.removeItem('fovy_user');
        return null;
      }
    } catch (error) {
      console.error('Auto login check failed:', error);
      localStorage.removeItem('fovy_token');
      localStorage.removeItem('fovy_user');
      return null;
    }
  },
};

// 專案相關 API
export const projectAPI = {
  // 獲取專案列表
  getProjects: async (params: any = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/projects/${queryString ? `?${queryString}` : ''}`);
  },

  // 獲取單個專案
  getProject: async (id: number) => {
    return apiCall(`/projects/${id}/`);
  },

  // 創建專案
  createProject: async (projectData: any) => {
    return apiCall('/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },
};

// 技能相關 API
export const skillAPI = {
  // 獲取技能列表
  getSkills: async (category?: string) => {
    const params = category ? `?category=${category}` : '';
    return apiCall(`/skills/${params}`);
  },
};

// 提案相關 API
export const proposalAPI = {
  // 提交提案
  submitProposal: async (projectId: number, proposalData: any) => {
    return apiCall(`/projects/${projectId}/submit_proposal/`, {
      method: 'POST',
      body: JSON.stringify(proposalData),
    });
  },

  // 獲取用戶的提案
  getUserProposals: async () => {
    return apiCall('/proposals/');
  },
};

// SkillMap API
export const skillmapAPI = {
  // 上傳 PDF 文件
  uploadPdf: async (file: File, username?: string) => {
    const formData = new FormData();
    formData.append('pdf_file', file);
    if (username) formData.append('username', username);
    
    const token = localStorage.getItem('fovy_token');
    
    console.log(`SkillMap API Call: Upload PDF`, {
      token: token ? `${token.substring(0, 10)}...` : 'No token',
      fileName: file.name,
      fileSize: file.size
    });
    
    const response = await fetch(`${API_BASE}/skillmap/upload-pdf/`, {
      method: 'POST',
      headers: {
        // username 模式免 Token；保留向後相容
        ...(username ? {} : (token ? { 'Authorization': `Token ${token}` } : {})),
      },
      body: formData,
    });

    console.log(`SkillMap API Response: ${response.status} ${response.statusText}`);

    const data = await response.json();

    if (!response.ok && (response.status === 400 || response.status === 401)) {
      console.log('SkillMap API Error:', data);
      return data;
    }

    if (!response.ok) {
      console.log('SkillMap API Network Error:', response.status, data);
      throw new Error(`API call failed: ${response.status}`);
    }

    return data;
  },

  // 獲取技能樹 JSON
  getSkillTree: async (username: string) => {
    const response = await apiCall(`/skillmap/get-skill-tree/?username=${encodeURIComponent(username)}`);
    
    // 清理 JSON 中的 markdown 標記（備用清理）
    if (response?.skill_tree_json) {
      let cleanedJson = response.skill_tree_json.trim();
      if (cleanedJson.startsWith("```json")) {
        cleanedJson = cleanedJson.substring(7);
      }
      if (cleanedJson.endsWith("```")) {
        cleanedJson = cleanedJson.substring(0, cleanedJson.length - 3);
      }
      cleanedJson = cleanedJson.trim();
      
      try {
        // 驗證 JSON 格式
        JSON.parse(cleanedJson);
        response.skill_tree_json = cleanedJson;
      } catch (e) {
        console.warn("JSON 清理後仍無法解析:", e);
      }
    }
    
    return response;
  },

  // 獲取技能樹狀態
  getStatus: async (username: string) => {
    return apiCall(`/skillmap/status/?username=${encodeURIComponent(username)}`);
  },

  // 下載 / 檢視 PDF
  downloadPdfByUsername: async (username: string) => {
    const response = await fetch(`${API_BASE}/skillmap/download/?username=${encodeURIComponent(username)}`);
    if (!response.ok) throw new Error('Failed to download PDF');
    return response.blob();
  },

  viewPdfByUsername: async (username: string) => {
    const url = `${API_BASE}/skillmap/view/?username=${encodeURIComponent(username)}`;
    window.open(url, '_blank');
  },

  // 刪除技能樹
  deleteByUsername: async (username: string) => {
    const response = await fetch(`${API_BASE}/skillmap/delete/?username=${encodeURIComponent(username)}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Failed to delete skillmap');
    }
    return data;
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  project: projectAPI,
  skill: skillAPI,
  proposal: proposalAPI,
  skillmap: skillmapAPI,
};

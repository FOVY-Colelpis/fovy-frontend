// API 基礎 URL
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-aws-backend-url.com/api' 
  : 'http://localhost:8000/api';

// 通用 API 調用函數
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  return response.json();
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

export default {
  auth: authAPI,
  user: userAPI,
  project: projectAPI,
  skill: skillAPI,
  proposal: proposalAPI,
};

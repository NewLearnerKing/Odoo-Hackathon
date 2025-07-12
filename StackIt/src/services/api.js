const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Debug logging for admin endpoints
  if (endpoint.includes('/admin/')) {
    console.log('Admin API request:', endpoint, 'Token:', token ? 'Present' : 'Missing');
  }
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// Questions API
export const questionsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/questions${queryString ? `?${queryString}` : ''}`);
  },

  create: async (questionData) => {
    return apiRequest('/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  },

  getAnswers: async (questionId) => {
    return apiRequest(`/questions/${questionId}/answers`);
  },

  addAnswer: async (questionId, answerData) => {
    return apiRequest(`/questions/${questionId}/answers`, {
      method: 'POST',
      body: JSON.stringify(answerData),
    });
  },
};

// Voting API
export const votingAPI = {
  vote: async (contentType, contentId, voteType) => {
    return apiRequest('/vote', {
      method: 'POST',
      body: JSON.stringify({ contentType, contentId, voteType }),
    });
  },

  acceptAnswer: async (answerId) => {
    return apiRequest(`/answers/${answerId}/accept`, {
      method: 'POST',
    });
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async () => {
    return apiRequest('/notifications');
  },

  markAsRead: async (notificationId) => {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  },
};

// Admin API
export const adminAPI = {
  getUsers: async () => {
    return apiRequest('/admin/users');
  },

  banUser: async (userId, banned) => {
    return apiRequest(`/admin/users/${userId}/ban`, {
      method: 'POST',
      body: JSON.stringify({ banned }),
    });
  },
};

// Tags API
export const tagsAPI = {
  getAll: async () => {
    return apiRequest('/tags');
  },
};

// Platform Messages API
export const platformMessagesAPI = {
  getAll: async () => {
    return apiRequest('/platform-messages');
  },

  create: async (message) => {
    return apiRequest('/platform-messages', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  update: async (messageId, active) => {
    return apiRequest(`/platform-messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ active }),
    });
  },

  delete: async (messageId) => {
    return apiRequest(`/platform-messages/${messageId}`, {
      method: 'DELETE',
    });
  },
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
}; 
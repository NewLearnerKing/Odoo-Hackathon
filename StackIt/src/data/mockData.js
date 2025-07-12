// Mock data for StackIt Q&A Platform

// Sample users
let users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@stackit.com',
    password: 'admin123',
    role: 'admin',
    banned: false,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    banned: false,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 3,
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    banned: false,
    createdAt: new Date('2024-01-20')
  },
  {
    id: 4,
    username: 'bob_wilson',
    email: 'bob@example.com',
    password: 'password123',
    role: 'user',
    banned: true,
    createdAt: new Date('2024-02-01')
  }
];

// Sample tags
const availableTags = [
  'React', 'JavaScript', 'Python', 'Node.js', 'CSS', 'HTML', 
  'TypeScript', 'Vue.js', 'Angular', 'Django', 'Flask', 'Express',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Docker', 'AWS', 'Git',
  'JWT', 'OAuth', 'REST API', 'GraphQL', 'Webpack', 'Vite'
];

// Vote tracking
let questionVotes = [
  { questionId: 1, userId: 2, voteType: 'up' },
  { questionId: 1, userId: 3, voteType: 'up' },
  { questionId: 2, userId: 2, voteType: 'up' },
  { questionId: 3, userId: 1, voteType: 'up' },
  { questionId: 3, userId: 3, voteType: 'up' }
];

let answerVotes = [
  { answerId: 1, userId: 2, voteType: 'up' },
  { answerId: 1, userId: 1, voteType: 'up' },
  { answerId: 2, userId: 3, voteType: 'up' },
  { answerId: 3, userId: 1, voteType: 'up' },
  { answerId: 4, userId: 2, voteType: 'up' }
];

// Sample questions
let questions = [
  {
    id: 1,
    title: 'How to implement authentication with JWT in React?',
    description: '<p>I\'m building a React application and need to implement JWT authentication. Can someone help me with the best practices for storing and managing JWT tokens?</p>',
    tags: ['React', 'JWT', 'Authentication'],
    userId: 2,
    username: 'john_doe',
    timestamp: new Date('2024-01-15T10:30:00'),
    votes: 5
  },
  {
    id: 2,
    title: 'What\'s the difference between useState and useReducer?',
    description: '<p>I\'m confused about when to use useState vs useReducer in React. Can someone explain the key differences and when to use each one?</p>',
    tags: ['React', 'JavaScript', 'Hooks'],
    userId: 3,
    username: 'jane_smith',
    timestamp: new Date('2024-01-16T14:20:00'),
    votes: 3
  },
  {
    id: 3,
    title: 'Best practices for API error handling in Node.js',
    description: '<p>I\'m working on a Node.js backend and want to implement proper error handling for my API endpoints. What are the best practices?</p>',
    tags: ['Node.js', 'REST API', 'Error Handling'],
    userId: 2,
    username: 'john_doe',
    timestamp: new Date('2024-01-17T09:15:00'),
    votes: 7
  }
];

// Sample answers
let answers = [
  {
    id: 1,
    questionId: 1,
    userId: 3,
    username: 'jane_smith',
    content: '<p>Here\'s how I implement JWT authentication in React:</p><ol><li>Store the token in localStorage or httpOnly cookies</li><li>Create an auth context to manage authentication state</li><li>Use axios interceptors to automatically add the token to requests</li><li>Implement token refresh logic</li></ol>',
    votes: 8,
    accepted: true,
    timestamp: new Date('2024-01-15T11:00:00')
  },
  {
    id: 2,
    questionId: 1,
    userId: 1,
    username: 'admin',
    content: '<p>I recommend using httpOnly cookies for better security. Here\'s a complete example:</p><pre><code>// Auth context setup\nconst AuthContext = createContext();</code></pre>',
    votes: 12,
    accepted: false,
    timestamp: new Date('2024-01-15T11:30:00')
  },
  {
    id: 3,
    questionId: 2,
    userId: 2,
    username: 'john_doe',
    content: '<p><strong>useState</strong> is for simple state management, while <strong>useReducer</strong> is better for complex state logic. Use useState when you have simple state updates, and useReducer when you have multiple sub-values or when the next state depends on the previous one.</p>',
    votes: 15,
    accepted: true,
    timestamp: new Date('2024-01-16T15:00:00')
  },
  {
    id: 4,
    questionId: 3,
    userId: 1,
    username: 'admin',
    content: '<p>For API error handling in Node.js, I recommend:</p><ul><li>Use a global error handler middleware</li><li>Create custom error classes</li><li>Log errors properly</li><li>Return consistent error responses</li></ul>',
    votes: 10,
    accepted: false,
    timestamp: new Date('2024-01-17T10:00:00')
  }
];

// Sample notifications
let notifications = [
  {
    id: 1,
    userId: 2,
    type: 'answer',
    message: 'jane_smith answered your question about JWT authentication',
    read: false,
    timestamp: new Date('2024-01-15T11:00:00'),
    questionId: 1
  },
  {
    id: 2,
    userId: 2,
    type: 'answer',
    message: 'admin answered your question about JWT authentication',
    read: false,
    timestamp: new Date('2024-01-15T11:30:00'),
    questionId: 1
  },
  {
    id: 3,
    userId: 3,
    type: 'answer',
    message: 'john_doe answered your question about useState vs useReducer',
    read: true,
    timestamp: new Date('2024-01-16T15:00:00'),
    questionId: 2
  },
  {
    id: 4,
    userId: 2,
    type: 'answer',
    message: 'admin answered your question about API error handling',
    read: false,
    timestamp: new Date('2024-01-17T10:00:00'),
    questionId: 3
  }
];

// Platform-wide messages (for admin)
let platformMessages = [
  {
    id: 1,
    message: 'Welcome to StackIt! Please read our community guidelines before posting.',
    active: true,
    timestamp: new Date('2024-01-01T00:00:00')
  }
];

// Data management functions
export const mockData = {
  // User functions
  getUsers: () => [...users],
  getUserById: (id) => users.find(user => user.id === id),
  getUserByUsername: (username) => users.find(user => user.username === username),
  addUser: (userData) => {
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...userData,
      role: 'user',
      banned: false,
      createdAt: new Date()
    };
    users.push(newUser);
    return newUser;
  },
  updateUser: (id, updates) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      return users[index];
    }
    return null;
  },
  banUser: (id) => {
    const user = users.find(u => u.id === id);
    if (user) {
      user.banned = true;
      return user;
    }
    return null;
  },
  unbanUser: (id) => {
    const user = users.find(u => u.id === id);
    if (user) {
      user.banned = false;
      return user;
    }
    return null;
  },

  // Vote tracking functions
  getQuestionVotes: () => [...questionVotes],
  getAnswerVotes: () => [...answerVotes],
  getUserQuestionVote: (questionId, userId) => {
    return questionVotes.find(v => v.questionId === questionId && v.userId === userId);
  },
  getUserAnswerVote: (answerId, userId) => {
    return answerVotes.find(v => v.answerId === answerId && v.userId === userId);
  },
  voteQuestion: (questionId, userId, voteType) => {
    const existingVote = questionVotes.find(v => v.questionId === questionId && v.userId === userId);
    const question = questions.find(q => q.id === questionId);
    
    if (!question) return null;
    
    if (existingVote) {
      // User already voted, update or remove vote
      if (existingVote.voteType === voteType) {
        // Remove vote if clicking same button
        questionVotes = questionVotes.filter(v => v !== existingVote);
        question.votes -= (voteType === 'up' ? 1 : -1);
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        question.votes += (voteType === 'up' ? 2 : -2); // +2 because we're changing from down to up
      }
    } else {
      // New vote
      questionVotes.push({ questionId, userId, voteType });
      question.votes += (voteType === 'up' ? 1 : -1);
    }
    
    return question;
  },
  voteAnswer: (answerId, userId, voteType) => {
    const existingVote = answerVotes.find(v => v.answerId === answerId && v.userId === userId);
    const answer = answers.find(a => a.id === answerId);
    
    if (!answer) return null;
    
    if (existingVote) {
      // User already voted, update or remove vote
      if (existingVote.voteType === voteType) {
        // Remove vote if clicking same button
        answerVotes = answerVotes.filter(v => v !== existingVote);
        answer.votes -= (voteType === 'up' ? 1 : -1);
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        answer.votes += (voteType === 'up' ? 2 : -2); // +2 because we're changing from down to up
      }
    } else {
      // New vote
      answerVotes.push({ answerId, userId, voteType });
      answer.votes += (voteType === 'up' ? 1 : -1);
    }
    
    return answer;
  },

  // Question functions
  getQuestions: () => [...questions],
  getQuestionById: (id) => questions.find(q => q.id === id),
  addQuestion: (questionData) => {
    const newQuestion = {
      id: Math.max(...questions.map(q => q.id)) + 1,
      ...questionData,
      timestamp: new Date(),
      votes: 0
    };
    questions.push(newQuestion);
    return newQuestion;
  },
  deleteQuestion: (id) => {
    const index = questions.findIndex(q => q.id === id);
    if (index !== -1) {
      questions.splice(index, 1);
      // Also delete related answers and votes
      answers = answers.filter(a => a.questionId !== id);
      questionVotes = questionVotes.filter(v => v.questionId !== id);
      return true;
    }
    return false;
  },

  // Answer functions
  getAnswers: () => [...answers],
  getAnswersByQuestionId: (questionId) => answers.filter(a => a.questionId === questionId),
  addAnswer: (answerData) => {
    const newAnswer = {
      id: Math.max(...answers.map(a => a.id)) + 1,
      ...answerData,
      votes: 0,
      accepted: false,
      timestamp: new Date()
    };
    answers.push(newAnswer);
    return newAnswer;
  },
  deleteAnswer: (id) => {
    const index = answers.findIndex(a => a.id === id);
    if (index !== -1) {
      answers.splice(index, 1);
      // Also delete related votes
      answerVotes = answerVotes.filter(v => v.answerId !== id);
      return true;
    }
    return false;
  },
  acceptAnswer: (id) => {
    const answer = answers.find(a => a.id === id);
    if (answer) {
      // Unaccept all other answers for this question
      answers.forEach(a => {
        if (a.questionId === answer.questionId) {
          a.accepted = false;
        }
      });
      answer.accepted = true;
      return answer;
    }
    return null;
  },

  // Notification functions
  getNotifications: () => [...notifications],
  getNotificationsByUserId: (userId) => notifications.filter(n => n.userId === userId),
  getUnreadNotifications: (userId) => notifications.filter(n => n.userId === userId && !n.read),
  addNotification: (notificationData) => {
    const newNotification = {
      id: Math.max(...notifications.map(n => n.id)) + 1,
      ...notificationData,
      read: false,
      timestamp: new Date()
    };
    notifications.push(newNotification);
    return newNotification;
  },
  markNotificationAsRead: (id) => {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      return notification;
    }
    return null;
  },
  markAllNotificationsAsRead: (userId) => {
    notifications.forEach(n => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
  },

  // Tag functions
  getAvailableTags: () => [...availableTags],

  // Platform message functions
  getPlatformMessages: () => [...platformMessages],
  addPlatformMessage: (message) => {
    const newMessage = {
      id: Math.max(...platformMessages.map(m => m.id)) + 1,
      message,
      active: true,
      timestamp: new Date()
    };
    platformMessages.push(newMessage);
    return newMessage;
  },
  deactivatePlatformMessage: (id) => {
    const message = platformMessages.find(m => m.id === id);
    if (message) {
      message.active = false;
      return message;
    }
    return null;
  },

  // Utility functions
  generateReport: () => {
    const report = {
      totalUsers: users.length,
      totalQuestions: questions.length,
      totalAnswers: answers.length,
      totalNotifications: notifications.length,
      bannedUsers: users.filter(u => u.banned).length,
      activePlatformMessages: platformMessages.filter(m => m.active).length,
      topTags: availableTags.map(tag => ({
        tag,
        count: questions.filter(q => q.tags.includes(tag)).length
      })).sort((a, b) => b.count - a.count).slice(0, 5)
    };
    console.log('StackIt Platform Report:', report);
    return report;
  }
}; 
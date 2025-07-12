import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import QuestionList from './components/QuestionList.jsx';
import QuestionForm from './components/QuestionForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import { 
  authAPI, 
  questionsAPI, 
  votingAPI, 
  notificationsAPI, 
  adminAPI, 
  tagsAPI, 
  platformMessagesAPI,
  setAuthToken,
  getAuthToken
} from './services/api.js';

const App = () => {
  // State management
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [platformMessages, setPlatformMessages] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [availableTags, setAvailableTags] = useState([
    'React', 'JavaScript', 'Python', 'Node.js', 'CSS', 'HTML', 'TypeScript', 
    'Vue.js', 'Angular', 'Django', 'Flask', 'Express', 'MongoDB', 'PostgreSQL', 
    'MySQL', 'Docker', 'AWS', 'Git', 'JWT', 'OAuth', 'REST API', 'GraphQL', 'Webpack', 'Vite'
  ]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [questionsData, tagsData, messagesData] = await Promise.all([
        questionsAPI.getAll(),
        tagsAPI.getAll(),
        platformMessagesAPI.getAll()
      ]);
      

      setQuestions(questionsData);
      setAvailableTags(tagsData);
      setPlatformMessages(messagesData);
      
      if (currentUser) {
        const notificationsData = await notificationsAPI.getAll();
        setNotifications(notificationsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Load users for admin panel
  const loadUsers = async () => {
    if (currentUser?.role === 'admin') {
      setIsLoadingUsers(true);
      try {
        console.log('Loading users for admin...');
        const usersData = await adminAPI.getUsers();
        console.log('Users loaded:', usersData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]); // Set empty array on error
      } finally {
        setIsLoadingUsers(false);
      }
    }
  };

  // Load users when navigating to admin panel
  useEffect(() => {
    console.log('Admin useEffect triggered:', { currentView, currentUserRole: currentUser?.role });
    if (currentView === 'admin' && currentUser?.role === 'admin') {
      loadUsers();
    }
  }, [currentView, currentUser]);

  // Navigation
  const handleNavigate = async (view) => {
    // Ensure tags are loaded when navigating to ask page
    if (view === 'ask' && availableTags.length === 0) {
      try {
        const tagsData = await tagsAPI.getAll();
        setAvailableTags(tagsData);
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    }
    
    setCurrentView(view);
  };

  // Authentication
  const handleLogin = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      setAuthToken(response.token);
      setCurrentUser(response.user);
      const notificationsData = await notificationsAPI.getAll();
      setNotifications(notificationsData);
      setCurrentView('home');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      setAuthToken(response.token);
      setCurrentUser(response.user);
      setCurrentView('home');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setNotifications([]);
    setCurrentView('home');
  };

  // Question management
  const handleQuestionSubmit = async (questionData) => {
    try {
      await questionsAPI.create(questionData);
      await loadData(); // Reload questions
      setCurrentView('home');
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  };

  const handleQuestionVote = async (questionId, voteType) => {
    if (!currentUser) return;
    
    try {
      await votingAPI.vote('question', questionId, voteType);
      await loadData(); // Reload questions
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleQuestionDelete = async (questionId) => {
    // Note: Delete functionality would need to be added to the API
    console.log('Delete question:', questionId);
  };

  // Answer management
  const handleAnswerSubmit = async (answerData) => {
    try {
      await questionsAPI.addAnswer(answerData.questionId, { content: answerData.content });
      await loadData(); // Reload data to get updated notifications
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  };

  const handleAnswerVote = async (answerId, voteType) => {
    if (!currentUser) return;
    
    try {
      await votingAPI.vote('answer', answerId, voteType);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error voting on answer:', error);
    }
  };

  const handleAnswerAccept = async (answerId) => {
    try {
      await votingAPI.acceptAnswer(answerId);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error accepting answer:', error);
    }
  };

  const handleAnswerDelete = async (answerId) => {
    // Note: Delete functionality would need to be added to the API
    console.log('Delete answer:', answerId);
  };

  // Notification management
  const handleMarkNotificationAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      const notificationsData = await notificationsAPI.getAll();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    // Note: This would need to be implemented in the API
    console.log('Mark all notifications as read');
  };

  // Admin functions
  const handleBanUser = async (userId) => {
    try {
      await adminAPI.banUser(userId, true);
      await loadUsers(); // Reload users after banning
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await adminAPI.banUser(userId, false);
      await loadUsers(); // Reload users after unbanning
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };

  const handleAddPlatformMessage = async (message) => {
    try {
      await platformMessagesAPI.create(message);
      const messagesData = await platformMessagesAPI.getAll();
      setPlatformMessages(messagesData);
    } catch (error) {
      console.error('Error creating platform message:', error);
    }
  };

  const handleDeactivatePlatformMessage = async (messageId) => {
    try {
      await platformMessagesAPI.update(messageId, false);
      const messagesData = await platformMessagesAPI.getAll();
      setPlatformMessages(messagesData);
    } catch (error) {
      console.error('Error deactivating platform message:', error);
    }
  };

  const handleDeletePlatformMessage = async (messageId) => {
    try {
      await platformMessagesAPI.delete(messageId);
      const messagesData = await platformMessagesAPI.getAll();
      setPlatformMessages(messagesData);
    } catch (error) {
      console.error('Error deleting platform message:', error);
    }
  };

  const handleGenerateReport = () => {
    // Generate report from current data
    const report = {
      totalQuestions: questions.length,
      totalUsers: users.length,
      timestamp: new Date().toISOString()
    };
    console.log('Downloading report:', report);
  };



  // Render current view
  const renderCurrentView = () => {
    
    switch (currentView) {
      case 'home':
        return (
          <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <QuestionList
                questions={questions}
                currentUser={currentUser}
                onVote={handleQuestionVote}
                onAccept={handleAnswerAccept}
                onDelete={handleQuestionDelete}
                onAnswerSubmit={handleAnswerSubmit}
                onNavigate={handleNavigate}
              />
            </div>
          </div>
        );
      
      case 'ask':
        return (
          <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <QuestionForm
                onSubmit={handleQuestionSubmit}
                onCancel={() => setCurrentView('home')}
                availableTags={availableTags}
              />
            </div>
          </div>
        );
      
      case 'login':
        return (
          <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <LoginForm
              onLogin={handleLogin}
              onSwitchToRegister={() => setCurrentView('register')}
            />
          </div>
        );
      
      case 'register':
        return (
          <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <RegisterForm
              onRegister={handleRegister}
              onSwitchToLogin={() => setCurrentView('login')}
            />
          </div>
        );
      
      case 'admin':
        return (
          <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <AdminPanel
                questions={questions}
                users={users}
                platformMessages={platformMessages}
                isLoadingUsers={isLoadingUsers}
                onDeleteQuestion={handleQuestionDelete}
                onDeleteAnswer={handleAnswerDelete}
                onBanUser={handleBanUser}
                onUnbanUser={handleUnbanUser}
                onAddPlatformMessage={handleAddPlatformMessage}
                onDeactivatePlatformMessage={handleDeactivatePlatformMessage}
                onDeletePlatformMessage={handleDeletePlatformMessage}
                onGenerateReport={handleGenerateReport}
                onReloadUsers={loadUsers}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <QuestionList
                questions={questions}
                currentUser={currentUser}
                onVote={handleQuestionVote}
                onAccept={handleAnswerAccept}
                onDelete={handleQuestionDelete}
                onAnswerSubmit={handleAnswerSubmit}
                onNavigate={handleNavigate}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App min-h-screen flex flex-col">
      {/* Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        platformMessages={platformMessages}
      />

      {/* Main Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default App;

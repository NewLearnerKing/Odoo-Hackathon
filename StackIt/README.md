# StackIt - Q&A Forum Platform

A modern, responsive Q&A forum platform built with React, Vite, Node.js, and SQLite. StackIt provides a complete solution for asking questions, providing answers, and managing community interactions with a real database backend.

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration & Login** with JWT authentication
- **Role-based Access Control** (Guest, User, Admin)
- **User Profiles** with avatars and activity tracking
- **Admin Panel** for user management and moderation
- **Database Storage** with SQLite for persistent data

### 📝 Content Management
- **Rich Text Editor** for questions and answers with formatting tools
- **Tag System** with predefined and custom tags
- **Search & Filter** questions by content, tags, and metadata
- **Sort Options** (newest, oldest, most votes, most answers, unanswered)

### 🗳️ Voting System
- **One Vote Per User** per question/answer (prevents spam)
- **Vote Removal** - click same button to remove vote
- **Vote Changing** - change from upvote to downvote
- **Visual Feedback** - colored buttons show current vote state
- **Real-time Updates** - vote counts update immediately

### 💬 Answer System
- **Rich Text Answers** with full formatting support
- **Answer Acceptance** by question owners
- **Answer Sorting** (accepted answers first, then by votes)
- **Answer Notifications** for question owners

### 🔔 Notifications
- **Real-time Notifications** for new answers
- **Notification Dropdown** with read/unread status
- **Mark as Read** functionality
- **Notification Badges** and counters

### 🎨 Modern UI/UX
- **Responsive Design** works on mobile, tablet, and desktop
- **Modern Styling** with gradients, shadows, and smooth animations
- **Dark/Light Mode** support
- **Accessibility** features and keyboard navigation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StackIt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development environment**
   ```bash
   # Option 1: Start both servers manually
   npm run server    # Backend API (port 3001)
   npm run dev       # Frontend (port 5173)
   
   # Option 2: Use the batch script (Windows)
   start-dev.bat
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Default Admin Account
- **Username**: `admin`
- **Password**: `admin123`

### Quick Test
1. Open `http://localhost:5173` in your browser
2. Click "Ask Question" 
3. You should see tags available for selection
4. Fill in the form and submit
5. The question should be saved to the database

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite
- **Backend**: Node.js, Express
- **Database**: SQLite3
- **Authentication**: JWT, bcryptjs
- **Styling**: Tailwind CSS
- **Rich Text**: Custom contenteditable editor
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx      # Navigation and user menu
│   │   ├── LoginForm.jsx   # User authentication
│   │   ├── RegisterForm.jsx # User registration
│   │   ├── QuestionList.jsx # Questions listing with filters
│   │   ├── QuestionCard.jsx # Individual question display
│   │   ├── QuestionForm.jsx # Ask question form
│   │   ├── AnswerCard.jsx  # Individual answer display
│   │   ├── AnswerForm.jsx  # Answer form
│   │   ├── RichTextEditor.jsx # Custom rich text editor
│   │   ├── TagSelector.jsx # Tag selection component
│   │   ├── NotificationDropdown.jsx # Notifications
│   │   └── AdminPanel.jsx  # Admin interface
│   ├── services/
│   │   └── api.js          # API service functions
│   ├── App.jsx             # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── server/
│   └── index.js           # Express server with SQLite database
├── stackit.db             # SQLite database file (auto-generated)
├── start-dev.bat          # Development startup script
└── package.json           # Dependencies and scripts
```

## 🎯 Key Features Explained

### Rich Text Editor
The custom rich text editor provides:
- **Toolbar** with formatting buttons (bold, italic, underline, lists, links, code blocks)
- **Keyboard shortcuts** (Ctrl+B, Ctrl+I, etc.)
- **Clean paste handling** (strips formatting to avoid issues)
- **Placeholder text** when empty
- **Real-time content updates**

### Voting System
- **Restricted voting**: Users can only vote once per question/answer
- **Visual feedback**: Vote buttons show current state with colors
- **Vote management**: Remove votes by clicking the same button
- **Change votes**: Switch from upvote to downvote or vice versa

### User Roles
- **Guest**: Can view questions and answers
- **User**: Can ask questions, answer, vote, and manage their content
- **Admin**: Full access including user management and content moderation

## 🔧 Development

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run dev:full` - Start both servers concurrently
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **Components**: Add new components in `src/components/`
2. **API**: Extend API endpoints in `server/index.js`
3. **Database**: Add new tables and queries as needed
4. **Styling**: Use Tailwind CSS classes or add custom CSS in `src/index.css`

## 🐛 Troubleshooting

### Common Issues

1. **White Screen**: Check browser console for errors
2. **Rich Text Editor Not Working**: Ensure all dependencies are installed
3. **Voting Issues**: Clear browser cache and reload
4. **Navigation Problems**: Check that all routes are properly configured

### Development Tips

- Use browser dev tools to debug React components
- Check the console for any error messages
- Ensure all imports are correct and files exist
- Test on different screen sizes for responsiveness

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**StackIt** - Building better communities through knowledge sharing! 🚀

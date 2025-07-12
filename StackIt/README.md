# StackIt - Modern Q&A Platform

A modern, responsive question-and-answer platform built with React, Node.js, and SQLite. StackIt provides a beautiful, user-friendly interface for asking questions, sharing knowledge, and building a community of learners.

## ✨ Features

### 🎨 Modern UI/UX Design
- **Responsive Design**: Fully responsive layout that works perfectly on desktop, tablet, and mobile devices
- **Modern Visual Design**: Clean, professional interface with gradient backgrounds and glass morphism effects
- **Smooth Animations**: Subtle animations and transitions for enhanced user experience
- **Accessibility**: WCAG compliant design with proper focus states and keyboard navigation

### 🔐 Authentication & User Management
- User registration and login with secure password hashing
- Role-based access control (User/Admin)
- User profile management
- Account security features

### 💬 Q&A Functionality
- Ask questions with rich text editor
- Tag-based categorization system
- Voting system for questions and answers
- Accept best answers
- Search and filter questions

### 🏷️ Tag System
- Comprehensive tag management
- Popular technology tags (React, JavaScript, Python, etc.)
- Tag-based question filtering

### 🔔 Notifications
- Real-time notification system
- Answer notifications
- Platform announcements

### 👨‍💼 Admin Panel
- User management (ban/unban users)
- Content moderation
- Platform statistics
- System announcements

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Rich Text Editor** - For question and answer content

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** - Lightweight database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Design System
- **Custom Color Palette** - Modern, accessible colors
- **Typography** - Inter font family
- **Icons** - Heroicons and custom SVGs
- **Animations** - CSS animations and transitions

## 🎯 UI/UX Improvements

### Responsive Design
- **Mobile-First Approach**: Optimized for mobile devices
- **Breakpoint System**: xs, sm, md, lg, xl, 2xl, 3xl, 4xl
- **Flexible Layouts**: Adaptive components that work on all screen sizes
- **Touch-Friendly**: Large touch targets and proper spacing

### Visual Enhancements
- **Gradient Backgrounds**: Subtle gradients for visual depth
- **Glass Morphism**: Modern backdrop blur effects
- **Shadow System**: Multiple shadow levels for depth
- **Color System**: Comprehensive color palette with semantic naming

### Interactive Elements
- **Hover Effects**: Subtle animations on interactive elements
- **Loading States**: Skeleton screens and loading indicators
- **Form Validation**: Real-time validation with helpful error messages
- **Toast Notifications**: User feedback for actions

### Typography & Spacing
- **Consistent Typography**: Proper font hierarchy and sizing
- **Responsive Text**: Text that scales appropriately on different devices
- **Proper Spacing**: Consistent spacing system using Tailwind's spacing scale
- **Readability**: High contrast and proper line heights

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StackIt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev:full
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📱 Responsive Breakpoints

The application uses a comprehensive responsive design system:

- **xs**: 475px - Extra small devices
- **sm**: 640px - Small devices
- **md**: 768px - Medium devices
- **lg**: 1024px - Large devices
- **xl**: 1280px - Extra large devices
- **2xl**: 1536px - 2X large devices
- **3xl**: 1600px - 3X large devices
- **4xl**: 1920px - 4X large devices

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (50-950)
- **Secondary**: Gray scale (50-950)
- **Success**: Green scale (50-900)
- **Warning**: Yellow scale (50-900)
- **Error**: Red scale (50-900)

### Typography
- **Font Family**: Inter (system fallbacks)
- **Headings**: Bold weights with proper scaling
- **Body**: Regular weight with optimal line height
- **Code**: JetBrains Mono for code blocks

### Spacing
- **Consistent Scale**: Based on Tailwind's spacing system
- **Responsive**: Adapts to screen size
- **Accessible**: Proper spacing for touch targets

## 🔧 Customization

### Adding New Colors
```css
/* In src/index.css */
:root {
  --custom-50: #f0f9ff;
  --custom-100: #e0f2fe;
  /* ... more shades */
}
```

### Adding New Animations
```css
/* In src/index.css */
@keyframes customAnimation {
  from { /* ... */ }
  to { /* ... */ }
}

.animate-custom {
  animation: customAnimation 0.3s ease-out;
}
```

### Modifying Components
All components are built with Tailwind CSS classes and can be easily customized by modifying the className props.

## 📊 Performance Optimizations

- **Lazy Loading**: Components load on demand
- **Optimized Images**: Proper image sizing and formats
- **Minimal Bundle**: Tree-shaking and code splitting
- **Fast Rendering**: Efficient React patterns

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Server-side validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Built-in Express security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**StackIt** - Where knowledge meets community. 🚀

import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Database setup
const db = new sqlite3.Database('./stackit.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      banned INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Questions table
    db.run(`CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      votes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Answers table
    db.run(`CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      votes INTEGER DEFAULT 0,
      accepted INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (question_id) REFERENCES questions (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Tags table
    db.run(`CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )`);

    // Question tags relationship
    db.run(`CREATE TABLE IF NOT EXISTS question_tags (
      question_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (question_id, tag_id),
      FOREIGN KEY (question_id) REFERENCES questions (id),
      FOREIGN KEY (tag_id) REFERENCES tags (id)
    )`);

    // Votes table
    db.run(`CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content_type TEXT NOT NULL,
      content_id INTEGER NOT NULL,
      vote_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, content_type, content_id)
    )`);

    // Notifications table
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      question_id INTEGER,
      answer_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (question_id) REFERENCES questions (id),
      FOREIGN KEY (answer_id) REFERENCES answers (id)
    )`);

    // Platform messages table
    db.run(`CREATE TABLE IF NOT EXISTS platform_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert default data
    insertDefaultData();
  });
}

// Insert default data
function insertDefaultData() {
  // Check if admin user exists
  db.get("SELECT id FROM users WHERE username = 'admin'", (err, row) => {
    if (!row) {
      // Create admin user
      bcrypt.hash('admin123', 10, (err, hash) => {
        if (!err) {
          db.run("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", 
            ['admin', 'admin@stackit.com', hash, 'admin']);
        }
      });
    }
  });

  // Create some regular users
  const users = [
    { username: 'john_doe', email: 'john@example.com', password: 'password123', role: 'user' },
    { username: 'jane_smith', email: 'jane@example.com', password: 'password123', role: 'user' },
    { username: 'dev_expert', email: 'dev@example.com', password: 'password123', role: 'user' }
  ];

  users.forEach(user => {
    db.get("SELECT id FROM users WHERE username = ?", [user.username], (err, row) => {
      if (!row) {
        bcrypt.hash(user.password, 10, (err, hash) => {
          if (!err) {
            db.run("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", 
              [user.username, user.email, hash, user.role]);
          }
        });
      }
    });
  });

  // Insert default tags
  const defaultTags = ['React', 'JavaScript', 'Python', 'Node.js', 'CSS', 'HTML', 'TypeScript', 'Vue.js', 'Angular', 'Django', 'Flask', 'Express', 'MongoDB', 'PostgreSQL', 'MySQL', 'Docker', 'AWS', 'Git', 'JWT', 'OAuth', 'REST API', 'GraphQL', 'Webpack', 'Vite'];
  
  defaultTags.forEach(tag => {
    db.run("INSERT OR IGNORE INTO tags (name) VALUES (?)", [tag]);
  });

  // Insert dummy questions after a delay to ensure users exist
  setTimeout(() => {
    insertDummyQuestions();
  }, 1000);

  // Insert welcome platform message
  db.run("INSERT OR IGNORE INTO platform_messages (message) VALUES (?)", 
    ['Welcome to StackIt! Please read our community guidelines before posting.']);
}

// Insert dummy questions
function insertDummyQuestions() {
  const dummyQuestions = [
    {
      title: "How to implement authentication in React with JWT?",
      description: "<p>I'm building a React application and need to implement user authentication using JWT tokens. I've been looking at various tutorials but I'm confused about the best practices for:</p><ul><li>Token storage (localStorage vs sessionStorage)</li><li>Token refresh mechanisms</li><li>Protected routes implementation</li><li>Handling token expiration</li></ul><p>Can someone provide a comprehensive example or point me to reliable resources?</p>",
      username: "john_doe",
      tags: ["React", "JWT", "Authentication"]
    },
    {
      title: "What's the difference between useState and useReducer in React?",
      description: "<p>I'm learning React hooks and I'm confused about when to use <code>useState</code> vs <code>useReducer</code>. I understand that:</p><ul><li>useState is simpler for basic state management</li><li>useReducer is more complex but powerful</li></ul><p>But I'm not sure about the specific use cases where useReducer would be beneficial. Can someone explain with practical examples?</p>",
      username: "jane_smith",
      tags: ["React", "JavaScript", "Hooks"]
    },
    {
      title: "Best practices for API error handling in Node.js/Express",
      description: "<p>I'm building a REST API with Node.js and Express, and I want to implement proper error handling. Currently, I'm just sending basic error messages, but I want to:</p><ul><li>Standardize error responses</li><li>Handle different types of errors (validation, authentication, server errors)</li><li>Implement proper logging</li><li>Provide meaningful error messages to clients</li></ul><p>What are the best practices and patterns for this?</p>",
      username: "dev_expert",
      tags: ["Node.js", "Express", "REST API", "Error Handling"]
    }
  ];

  dummyQuestions.forEach((q, index) => {
    // Get user ID
    db.get("SELECT id FROM users WHERE username = ?", [q.username], (err, user) => {
      if (!err && user) {
        // Insert question
        db.run("INSERT OR IGNORE INTO questions (title, description, user_id) VALUES (?, ?, ?)", 
          [q.title, q.description, user.id], function(err) {
          if (!err && this.lastID) {
            const questionId = this.lastID;
            
            // Add tags
            q.tags.forEach(tag => {
              db.run("INSERT OR IGNORE INTO tags (name) VALUES (?)", [tag], function() {
                const tagId = this.lastID || tag;
                db.run("INSERT OR IGNORE INTO question_tags (question_id, tag_id) VALUES (?, ?)", 
                  [questionId, tagId]);
              });
            });

            // Add some dummy answers
            setTimeout(() => {
              insertDummyAnswers(questionId, q.username);
            }, 500);
          }
        });
      }
    });
  });
}

// Insert dummy answers
function insertDummyAnswers(questionId, questionUsername) {
  const dummyAnswers = [
    {
      content: "<p>For JWT authentication in React, here's a comprehensive approach:</p><ol><li><strong>Token Storage:</strong> Use localStorage for persistence across browser sessions, but be aware of XSS vulnerabilities. Consider using httpOnly cookies for better security.</li><li><strong>Token Refresh:</strong> Implement automatic token refresh using interceptors in axios or fetch.</li><li><strong>Protected Routes:</strong> Create a PrivateRoute component that checks for valid tokens.</li></ol><p>Here's a basic example:</p><pre><code>const PrivateRoute = ({ children }) => {\n  const token = localStorage.getItem('token');\n  return token ? children : <Navigate to='/login' />;\n};</code></pre>",
      username: "dev_expert"
    },
    {
      content: "<p>I've been using JWT for a while now. Here are some additional tips:</p><ul><li>Always validate tokens on the server side</li><li>Use short expiration times for access tokens</li><li>Implement proper logout by clearing tokens</li><li>Consider using refresh tokens for better security</li></ul>",
      username: "jane_smith"
    }
  ];

  dummyAnswers.forEach(answer => {
    db.get("SELECT id FROM users WHERE username = ?", [answer.username], (err, user) => {
      if (!err && user) {
        db.run("INSERT OR IGNORE INTO answers (question_id, user_id, content) VALUES (?, ?, ?)", 
          [questionId, user.id, answer.content]);
      }
    });
  });
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// API Routes

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
      [username, email, hashedPassword], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Username or email already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }

      const token = jwt.sign({ id: this.lastID, username, role: 'user' }, JWT_SECRET);
      res.json({ token, user: { id: this.lastID, username, email, role: 'user' } });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get("SELECT * FROM users WHERE username = ? AND banned = 0", [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET);
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

// Questions routes
app.get('/api/questions', (req, res) => {
  const { search, tags, sort = 'newest' } = req.query;
  
  let query = `
    SELECT q.*, u.username, GROUP_CONCAT(t.name) as tags
    FROM questions q
    JOIN users u ON q.user_id = u.id
    LEFT JOIN question_tags qt ON q.id = qt.question_id
    LEFT JOIN tags t ON qt.tag_id = t.id
  `;

  const conditions = [];
  const params = [];

  if (search) {
    conditions.push("(q.title LIKE ? OR q.description LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (tags) {
    const tagArray = tags.split(',');
    conditions.push(`t.name IN (${tagArray.map(() => '?').join(',')})`);
    params.push(...tagArray);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` GROUP BY q.id`;

  switch (sort) {
    case 'votes':
      query += ' ORDER BY q.votes DESC';
      break;
    case 'oldest':
      query += ' ORDER BY q.created_at ASC';
      break;
    default:
      query += ' ORDER BY q.created_at DESC';
  }

  db.all(query, params, (err, questions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(questions.map(q => ({
      ...q,
      tags: q.tags ? q.tags.split(',') : []
    })));
  });
});

app.post('/api/questions', authenticateToken, (req, res) => {
  const { title, description, tags } = req.body;
  const userId = req.user.id;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  db.run("INSERT INTO questions (title, description, user_id) VALUES (?, ?, ?)", 
    [title, description, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const questionId = this.lastID;

    // Add tags
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        db.run("INSERT OR IGNORE INTO tags (name) VALUES (?)", [tag], function() {
          const tagId = this.lastID || tag;
          db.run("INSERT INTO question_tags (question_id, tag_id) VALUES (?, ?)", 
            [questionId, tagId]);
        });
      });
    }

    res.json({ id: questionId, message: 'Question created successfully' });
  });
});

// Answers routes
app.get('/api/questions/:id/answers', (req, res) => {
  const questionId = req.params.id;

  db.all(`
    SELECT a.*, u.username
    FROM answers a
    JOIN users u ON a.user_id = u.id
    WHERE a.question_id = ?
    ORDER BY a.accepted DESC, a.votes DESC
  `, [questionId], (err, answers) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(answers);
  });
});

app.post('/api/questions/:id/answers', authenticateToken, (req, res) => {
  const questionId = req.params.id;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  db.run("INSERT INTO answers (question_id, user_id, content) VALUES (?, ?, ?)", 
    [questionId, userId, content], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Create notification for question owner
    db.get("SELECT user_id FROM questions WHERE id = ?", [questionId], (err, question) => {
      if (!err && question && question.user_id !== userId) {
        db.run("INSERT INTO notifications (user_id, type, message, question_id) VALUES (?, ?, ?, ?)", 
          [question.user_id, 'answer', `Someone answered your question`, questionId]);
      }
    });

    res.json({ id: this.lastID, message: 'Answer posted successfully' });
  });
});

// Voting routes
app.post('/api/vote', authenticateToken, (req, res) => {
  const { contentType, contentId, voteType } = req.body;
  const userId = req.user.id;

  if (!['question', 'answer'].includes(contentType) || !['up', 'down'].includes(voteType)) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  db.get("SELECT * FROM votes WHERE user_id = ? AND content_type = ? AND content_id = ?", 
    [userId, contentType, contentId], (err, existingVote) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const table = contentType === 'question' ? 'questions' : 'answers';
    const voteChange = voteType === 'up' ? 1 : -1;

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote
        db.run("DELETE FROM votes WHERE id = ?", [existingVote.id]);
        db.run(`UPDATE ${table} SET votes = votes - ? WHERE id = ?`, 
          [voteChange, contentId]);
      } else {
        // Change vote
        db.run("UPDATE votes SET vote_type = ? WHERE id = ?", [voteType, existingVote.id]);
        db.run(`UPDATE ${table} SET votes = votes + ? WHERE id = ?`, 
          [voteChange * 2, contentId]);
      }
    } else {
      // New vote
      db.run("INSERT INTO votes (user_id, content_type, content_id, vote_type) VALUES (?, ?, ?, ?)", 
        [userId, contentType, contentId, voteType]);
      db.run(`UPDATE ${table} SET votes = votes + ? WHERE id = ?`, 
        [voteChange, contentId]);
    }

    res.json({ message: 'Vote recorded successfully' });
  });
});

// Accept answer
app.post('/api/answers/:id/accept', authenticateToken, (req, res) => {
  const answerId = req.params.id;
  const userId = req.user.id;

  db.get("SELECT q.user_id FROM answers a JOIN questions q ON a.question_id = q.id WHERE a.id = ?", 
    [answerId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!result || result.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    db.run("UPDATE answers SET accepted = 0 WHERE question_id = (SELECT question_id FROM answers WHERE id = ?)", 
      [answerId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      db.run("UPDATE answers SET accepted = 1 WHERE id = ?", [answerId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Answer accepted successfully' });
      });
    });
  });
});

// Notifications routes
app.get('/api/notifications', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50", 
    [userId], (err, notifications) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(notifications);
  });
});

app.post('/api/notifications/:id/read', authenticateToken, (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user.id;

  db.run("UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?", 
    [notificationId, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Notification marked as read' });
  });
});

// Admin routes
app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  db.all("SELECT id, username, email, role, banned, created_at FROM users", (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(users);
  });
});

app.post('/api/admin/users/:id/ban', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const userId = req.params.id;
  const { banned } = req.body;

  db.run("UPDATE users SET banned = ? WHERE id = ?", [banned ? 1 : 0, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: `User ${banned ? 'banned' : 'unbanned'} successfully` });
  });
});

// Tags route
app.get('/api/tags', (req, res) => {
  db.all("SELECT * FROM tags ORDER BY name", (err, tags) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tags.map(tag => tag.name));
  });
});

// Platform messages
app.get('/api/platform-messages', (req, res) => {
  db.all("SELECT * FROM platform_messages WHERE active = 1 ORDER BY created_at DESC", (err, messages) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(messages);
  });
});

app.post('/api/platform-messages', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  db.run("INSERT INTO platform_messages (message) VALUES (?)", [message], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ id: this.lastID, message: 'Platform message created successfully' });
  });
});

app.put('/api/platform-messages/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const messageId = req.params.id;
  const { active } = req.body;

  db.run("UPDATE platform_messages SET active = ? WHERE id = ?", [active ? 1 : 0, messageId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: `Platform message ${active ? 'activated' : 'deactivated'} successfully` });
  });
});

app.delete('/api/platform-messages/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const messageId = req.params.id;

  db.run("DELETE FROM platform_messages WHERE id = ?", [messageId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Platform message deleted successfully' });
  });
});

// Serve React app for all other routes (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
} else {
  // In development, just return a message for non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.json({ 
        message: 'StackIt API Server is running',
        api: 'http://localhost:3001/api',
        frontend: 'http://localhost:5173'
      });
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
}); 
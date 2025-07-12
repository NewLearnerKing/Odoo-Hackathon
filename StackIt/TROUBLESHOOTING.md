# StackIt Troubleshooting Guide

## Common Issues and Solutions

### 1. White Screen / Blank Page

**Symptoms**: Page loads but shows only a white screen

**Solutions**:
- Check browser console for JavaScript errors
- Ensure all CDN links are loading properly
- Verify that all component files are accessible
- Clear browser cache and refresh

**Debug Steps**:
1. Open browser developer tools (F12)
2. Check Console tab for errors
3. Check Network tab to ensure all scripts load
4. Try opening in an incognito/private window

### 2. CDN Loading Issues

**Symptoms**: Script loading errors in console

**Solutions**:
- Check internet connection
- Try different CDN sources
- Use local development server (npm run dev)

**Alternative CDN Sources**:
```html
<!-- Alternative React CDN -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Alternative Tailwind CDN -->
<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio"></script>
```

### 3. Babel Transform Issues

**Symptoms**: "Cannot use 'import.meta' outside a module" error

**Solutions**:
- Ensure all scripts use `type="text/babel"`
- Load scripts in correct order (dependencies first)
- Use development server instead of direct file access

### 4. Component Not Found Errors

**Symptoms**: "Component is not defined" errors

**Solutions**:
- Verify all component files are loaded in index.html
- Check component file paths are correct
- Ensure components are defined before App.jsx

### 5. Mock Data Issues

**Symptoms**: Data not loading or functions undefined

**Solutions**:
- Check that mockData.js loads before App.jsx
- Verify window.mockData is available
- Check browser console for mockData errors

### 6. Rich Text Editor Issues

**Symptoms**: ReactQuill not working or showing errors

**Solutions**:
- Ensure ReactQuill CDN loads properly
- Check that Quill CSS is loaded
- Verify ReactQuill version compatibility

## Development vs Production

### Development (Recommended)
```bash
npm run dev
```
- Uses Vite development server
- Hot module replacement
- Better error messages
- No CDN dependency issues

### Production Build
```bash
npm run build
npm run preview
```
- Builds optimized production files
- Requires proper Tailwind CSS installation
- Better performance

## Browser Compatibility

**Supported Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Unsupported**:
- Internet Explorer
- Older browsers without ES6 support

## Performance Optimization

### For Production Use:
1. **Install Tailwind CSS locally**:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Build React components**:
   ```bash
   npm install react react-dom
   npm run build
   ```

3. **Use production React**:
   ```html
   <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
   <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
   ```

## Debug Mode

To enable debug mode, add this to your browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## Getting Help

If you're still experiencing issues:

1. **Check the console**: Look for specific error messages
2. **Verify file structure**: Ensure all files are in the correct locations
3. **Test with demo data**: Use the provided demo accounts
4. **Try different browser**: Test in Chrome, Firefox, or Safari
5. **Check network**: Ensure all CDN resources load properly

## Demo Accounts for Testing

- **Admin**: `admin` / `admin123`
- **User 1**: `john_doe` / `password123`
- **User 2**: `jane_smith` / `password123`

## File Structure Verification

Ensure your project structure matches:
```
StackIt/
├── index.html
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── QuestionForm.jsx
│   │   ├── RichTextEditor.jsx
│   │   ├── QuestionList.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── AnswerForm.jsx
│   │   ├── AnswerCard.jsx
│   │   ├── NotificationDropdown.jsx
│   │   ├── TagSelector.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   └── data/
│       └── mockData.js
``` 
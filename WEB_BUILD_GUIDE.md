# Web Build Guide for LogiPoint Dashboard

## Overview
Your LogiPoint Reporting Dashboard is now configured for web deployment. This guide explains how to build and deploy your app as a static web application.

## What Was Changed

### 1. **Web Compatibility**
- Added web fallbacks for all image picker functionality
- Platform-specific code for web (uses HTML5 File API) and mobile (uses expo-image-picker)
- Image compression works on both web and mobile platforms

### 2. **Modified Files**
- `app/(tabs)/contracts.tsx` - Added web support for 3 image upload functions
- `app/(tabs)/warehouse.tsx` - Added web support for allocation image upload

## Building for Web

### Prerequisites
Make sure you have:
- Node.js installed (v16 or higher)
- npm or bun installed

### Build Commands

There are two ways to build for web:

#### Option 1: Using Expo CLI (Recommended)
```bash
npx expo export --platform web
```

This will create a `dist/` folder with:
- `index.html` - Your main HTML file
- `_expo/` - Static assets (JS, CSS, images)
- Asset manifest files

#### Option 2: Using npm scripts
If you add these scripts to your package.json:
```json
{
  "scripts": {
    "build": "npx expo export --platform web",
    "build:web": "npx expo export --platform web",
    "serve": "npx serve dist"
  }
}
```

Then you can run:
```bash
npm run build
```

### Testing Locally

After building, you can test locally:
```bash
npx serve dist
```

This will start a local server (usually at http://localhost:3000) where you can test your web build.

## Features That Work on Web

✅ **Admin and Viewer Modes** - Login system works identically on web
✅ **Data Editing** - All edit functionality works
✅ **Charts and Visualizations** - All charts render correctly
✅ **Image Uploads** - Uses HTML5 File API on web
✅ **Local Storage** - AsyncStorage uses localStorage on web
✅ **Navigation** - Expo Router works seamlessly
✅ **Responsive Layout** - Adapts to different screen sizes

## Deployment Options

### 1. Static Hosting Services

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel dist
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --dir=dist --prod
```

#### GitHub Pages
1. Build your app: `npx expo export --platform web`
2. Push the `dist/` folder to your GitHub Pages branch
3. Configure GitHub Pages to serve from that branch

### 2. Self-Hosted
Upload the `dist/` folder contents to any web server that can serve static files:
- Apache
- Nginx
- Any CDN

### 3. Cloud Storage
Upload to cloud storage with static website hosting:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage

## Configuration

### app.json Web Settings
Your web configuration in `app.json`:
```json
{
  "web": {
    "favicon": "./assets/images/favicon.png",
    "bundler": "metro",
    "output": "static"
  }
}
```

### Important Notes

1. **Login Credentials** (unchanged):
   - Viewer: Code `2030`
   - Admin: `thamir.sulimani@logipoint.sa` / `Logi@2030`

2. **Data Persistence**:
   - On web, data is stored in browser localStorage
   - Clearing browser data will reset the app
   - Each browser/device has separate storage

3. **Image Storage**:
   - Images are stored as base64 strings in localStorage
   - Keep images reasonably sized (localStorage has ~5-10MB limit)
   - The app includes compression for mobile, but web relies on browser APIs

4. **Browser Compatibility**:
   - Modern browsers (Chrome, Firefox, Safari, Edge)
   - Requires JavaScript enabled
   - File API support for image uploads

## Troubleshooting

### Build Issues

**Problem**: "expo: command not found"
```bash
# Install Expo CLI globally
npm install -g expo-cli
```

**Problem**: Build fails with module errors
```bash
# Clean and rebuild
rm -rf node_modules
rm -rf .expo
npm install
npx expo export --platform web
```

### Runtime Issues

**Problem**: Images won't upload on web
- Check browser console for errors
- Ensure you're using HTTPS (some browsers block file access on HTTP)
- Try a different browser

**Problem**: Charts not displaying
- Clear browser cache
- Check browser console for errors
- Verify all static assets loaded correctly

**Problem**: Login not working
- Clear browser localStorage: `localStorage.clear()`
- Try incognito/private browsing mode
- Check browser console for errors

## File Structure After Build

```
dist/
├── index.html
├── _expo/
│   └── static/
│       ├── js/
│       │   ├── web/
│       │   │   └── entry-[hash].js
│       │   └── ...
│       └── css/
│           └── ...
├── assets/
│   └── (your app assets)
└── metadata/
    └── (Expo metadata)
```

## Security Considerations

1. **Authentication**: Current system uses hardcoded credentials for development
   - For production, implement proper authentication
   - Consider using environment variables
   - Implement server-side authentication

2. **Data Storage**: Data is stored client-side
   - For production, consider backend storage
   - Implement data encryption for sensitive information

3. **HTTPS**: Always serve over HTTPS in production
   - Required for many browser APIs
   - Essential for security

## Next Steps

1. **Build and Test**:
   ```bash
   npx expo export --platform web
   npx serve dist
   ```

2. **Deploy to Hosting**:
   - Choose a hosting provider
   - Deploy the `dist/` folder
   - Test all functionality on the deployed site

3. **Configure Domain** (if needed):
   - Point your domain to the hosting
   - Configure SSL certificate
   - Update app.json origin if needed

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all files in `dist/` are accessible
3. Test in different browsers
4. Check hosting provider logs

Your app is now ready to be deployed as a web application while maintaining full mobile app compatibility!

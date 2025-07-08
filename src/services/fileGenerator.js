import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import WebsiteCrawler from './websiteCrawler';

/**
 * Generates a mobile-optimized HTML template
 * @param {string} websiteUrl - The URL of the website
 * @param {string} appName - The name of the app
 * @param {Map} assets - Downloaded assets
 * @returns {string} - HTML content
 */
const generateMobileHtmlTemplate = (websiteUrl, appName, assets) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="${appName}">
  <title>${appName}</title>
  <link rel="manifest" href="manifest.json">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      margin: 0;
      padding: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f8fafc;
    }
    .app-header {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: white;
      padding: 1rem;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .app-header h1 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
    }
    .content-frame {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      z-index: 10;
    }
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top: 3px solid #0284c7;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    iframe {
      border: none;
      width: 100%;
      height: 100%;
      background: white;
    }
    .offline-message {
      padding: 2rem;
      text-align: center;
      color: #64748b;
      display: none;
    }
    @media (max-width: 768px) {
      .app-header {
        padding: 0.75rem;
      }
      .app-header h1 {
        font-size: 1.1rem;
      }
    }
  </style>
</head>
<body>
  <div class="app-header">
    <h1>${appName}</h1>
  </div>
  <div class="content-frame">
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Loading website content...</p>
    </div>
    <div class="offline-message">
      <h3>Content Unavailable</h3>
      <p>Unable to load the website content. Please check your internet connection.</p>
    </div>
    <iframe 
      src="${websiteUrl}" 
      onload="document.querySelector('.loading').style.display = 'none'"
      onerror="document.querySelector('.loading').style.display = 'none'; document.querySelector('.offline-message').style.display = 'block'"
    ></iframe>
  </div>
  
  <script>
    // Service Worker registration for offline support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('SW registered'))
        .catch(error => console.log('SW registration failed'));
    }
    
    // Handle online/offline status
    window.addEventListener('online', () => {
      location.reload();
    });
    
    window.addEventListener('offline', () => {
      document.querySelector('.offline-message').style.display = 'block';
    });
  </script>
</body>
</html>`;
};

/**
 * Generates a service worker for offline support
 * @returns {string} - Service worker content
 */
const generateServiceWorker = () => {
  return `const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});`;
};

/**
 * Generates a comprehensive manifest.json file
 * @param {string} appName - The name of the app
 * @param {string} packageName - The package name
 * @param {string} websiteUrl - The website URL
 * @returns {string} - JSON content
 */
const generateManifest = (appName, packageName, websiteUrl) => {
  return JSON.stringify({
    name: appName,
    short_name: appName,
    description: `Mobile app for ${websiteUrl}`,
    package_name: packageName,
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#0284c7",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: "icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "icon-512.png", 
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any"
      }
    ],
    screenshots: [
      {
        src: "screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide"
      },
      {
        src: "screenshot-narrow.png", 
        sizes: "720x1280",
        type: "image/png",
        form_factor: "narrow"
      }
    ]
  }, null, 2);
};

/**
 * Generates APK info and configuration
 * @param {Object} formData - The form data
 * @param {number} totalSize - Total website size
 * @returns {string} - APK configuration
 */
const generateApkConfig = (formData, totalSize) => {
  const sizeFormatted = WebsiteCrawler.formatFileSize(totalSize);
  
  return `# Android APK Configuration
# Generated by Web to App Converter

app_name=${formData.appName}
package_name=${formData.packageName}
website_url=${formData.websiteUrl}
include_all_pages=${formData.includeAllPages}
total_size=${sizeFormatted}
generation_date=${new Date().toISOString()}

# APK Build Instructions
# This configuration would be used by a build system to generate
# an actual Android APK file with the following features:
# - WebView integration
# - Offline support
# - Mobile-optimized interface
# - Full website functionality

# Build Commands (example):
# cordova create ${formData.appName.replace(/\s+/g, '')} ${formData.packageName} "${formData.appName}"
# cd ${formData.appName.replace(/\s+/g, '')}
# cordova platform add android
# cordova build android

# Note: This is a configuration file. In a production environment,
# this would trigger an actual APK build process.`;
};

/**
 * Creates a real APK configuration file
 * @param {Object} formData - The form data
 * @param {Object} crawlData - Crawled website data
 * @returns {Promise<Blob>} - APK config blob
 */
export const generateApkFile = async (formData, crawlData) => {
  const apkConfig = generateApkConfig(formData, crawlData.totalSize);
  return new Blob([apkConfig], { type: 'text/plain' });
};

/**
 * Creates a comprehensive ZIP file with all website content
 * @param {Object} formData - The form data
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<{blob: Blob, totalSize: number}>} - ZIP file data
 */
export const generateZipFile = async (formData, onProgress) => {
  const zip = new JSZip();
  const crawler = new WebsiteCrawler();
  
  try {
    onProgress?.('Starting website crawl...');
    
    // Crawl the website
    const crawlData = await crawler.crawlWebsite(formData.websiteUrl, onProgress);
    
    onProgress?.('Processing downloaded content...');
    
    // Add main HTML file
    zip.file("index.html", generateMobileHtmlTemplate(
      formData.websiteUrl, 
      formData.appName, 
      crawlData.assets
    ));
    
    // Add manifest.json
    zip.file("manifest.json", generateManifest(
      formData.appName, 
      formData.packageName, 
      formData.websiteUrl
    ));
    
    // Add service worker
    zip.file("sw.js", generateServiceWorker());
    
    // Add README file
    zip.file("README.md", `# ${formData.appName}

Generated by Web to App Converter

## Website Information
- **Source URL:** ${formData.websiteUrl}
- **Total Size:** ${WebsiteCrawler.formatFileSize(crawlData.totalSize)}
- **Pages Crawled:** ${crawlData.pages}
- **Assets Downloaded:** ${crawlData.assets.size}
- **Include All Pages:** ${formData.includeAllPages ? 'Yes' : 'No'}

## Installation Instructions

### As a Web App
1. Extract this ZIP file
2. Open \`index.html\` in a web browser
3. For best experience, use Chrome or Firefox

### Deploy to Web Server
1. Extract all files to your web server
2. Access via your domain
3. The app will work offline after first visit

### Mobile Installation
1. Open the website on a mobile device
2. Add to home screen when prompted
3. The app will behave like a native app

## Files Included
- \`index.html\` - Main application file
- \`manifest.json\` - Web app manifest
- \`sw.js\` - Service worker for offline support
- Downloaded website assets and pages

Generated on: ${new Date().toLocaleString()}
`);
    
    // Add all downloaded assets
    onProgress?.('Adding website assets to ZIP...');
    
    for (const [path, asset] of crawlData.assets) {
      try {
        if (typeof asset.content === 'string') {
          zip.file(path, asset.content);
        } else {
          zip.file(path, asset.content);
        }
      } catch (error) {
        console.warn(`Failed to add asset ${path}:`, error);
      }
    }
    
    // Add placeholder icons (in a real app, these would be generated)
    const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
      <rect width="192" height="192" fill="#0284c7"/>
      <text x="96" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">
        ${formData.appName.charAt(0).toUpperCase()}
      </text>
    </svg>`;
    
    zip.file("icon-192.png", iconSvg);
    zip.file("icon-512.png", iconSvg);
    
    onProgress?.('Generating ZIP file...');
    
    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ 
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6
      }
    });
    
    return {
      blob: zipBlob,
      totalSize: crawlData.totalSize,
      pages: crawlData.pages,
      assets: crawlData.assets.size
    };
    
  } catch (error) {
    console.error('Error generating ZIP:', error);
    throw error;
  }
};
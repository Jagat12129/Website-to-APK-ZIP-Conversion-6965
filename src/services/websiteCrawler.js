/**
 * Website Crawler Service
 * Crawls websites and downloads all assets
 */

class WebsiteCrawler {
  constructor() {
    this.visitedUrls = new Set();
    this.downloadedAssets = new Map();
    this.totalSize = 0;
    this.baseUrl = '';
    this.baseDomain = '';
  }

  /**
   * Initialize crawler with base URL
   * @param {string} url - Base URL to crawl
   */
  init(url) {
    try {
      const urlObj = new URL(url);
      this.baseUrl = url;
      this.baseDomain = urlObj.origin;
      this.visitedUrls.clear();
      this.downloadedAssets.clear();
      this.totalSize = 0;
    } catch (error) {
      throw new Error('Invalid URL provided');
    }
  }

  /**
   * Crawl website and return all assets
   * @param {string} url - URL to crawl
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} - Crawled website data
   */
  async crawlWebsite(url, onProgress) {
    this.init(url);
    
    try {
      // Start crawling from the main page
      await this.crawlPage(url, onProgress);
      
      return {
        assets: this.downloadedAssets,
        totalSize: this.totalSize,
        pages: this.visitedUrls.size
      };
    } catch (error) {
      console.error('Crawling failed:', error);
      throw error;
    }
  }

  /**
   * Crawl a single page
   * @param {string} url - URL to crawl
   * @param {Function} onProgress - Progress callback
   */
  async crawlPage(url, onProgress) {
    if (this.visitedUrls.has(url)) return;
    
    this.visitedUrls.add(url);
    onProgress?.(`Crawling: ${url}`);

    try {
      // Use a CORS proxy to fetch the page
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }

      const data = await response.json();
      const html = data.contents;
      
      // Store the HTML content
      const htmlSize = new Blob([html]).size;
      this.downloadedAssets.set(this.getRelativePath(url), {
        content: html,
        size: htmlSize,
        type: 'text/html'
      });
      this.totalSize += htmlSize;

      // Parse HTML to find assets
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract and download assets
      await this.extractAssets(doc, url, onProgress);
      
    } catch (error) {
      console.warn(`Failed to crawl ${url}:`, error);
      // Create a fallback page
      const fallbackHtml = this.createFallbackPage(url);
      const fallbackSize = new Blob([fallbackHtml]).size;
      this.downloadedAssets.set(this.getRelativePath(url), {
        content: fallbackHtml,
        size: fallbackSize,
        type: 'text/html'
      });
      this.totalSize += fallbackSize;
    }
  }

  /**
   * Extract assets from HTML document
   * @param {Document} doc - Parsed HTML document
   * @param {string} pageUrl - Current page URL
   * @param {Function} onProgress - Progress callback
   */
  async extractAssets(doc, pageUrl, onProgress) {
    const assets = [];
    
    // Extract CSS files
    const cssLinks = doc.querySelectorAll('link[rel="stylesheet"]');
    cssLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        assets.push({
          url: this.resolveUrl(href, pageUrl),
          type: 'text/css',
          selector: 'link[rel="stylesheet"]'
        });
      }
    });

    // Extract JavaScript files
    const scripts = doc.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src) {
        assets.push({
          url: this.resolveUrl(src, pageUrl),
          type: 'application/javascript',
          selector: 'script[src]'
        });
      }
    });

    // Extract images
    const images = doc.querySelectorAll('img[src]');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        assets.push({
          url: this.resolveUrl(src, pageUrl),
          type: 'image/*',
          selector: 'img[src]'
        });
      }
    });

    // Extract fonts
    const fontLinks = doc.querySelectorAll('link[href*="font"]');
    fontLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        assets.push({
          url: this.resolveUrl(href, pageUrl),
          type: 'font/*',
          selector: 'link[href*="font"]'
        });
      }
    });

    // Download all assets
    for (const asset of assets) {
      try {
        await this.downloadAsset(asset, onProgress);
      } catch (error) {
        console.warn(`Failed to download asset: ${asset.url}`, error);
      }
    }
  }

  /**
   * Download a single asset
   * @param {Object} asset - Asset information
   * @param {Function} onProgress - Progress callback
   */
  async downloadAsset(asset, onProgress) {
    const relativePath = this.getRelativePath(asset.url);
    
    if (this.downloadedAssets.has(relativePath)) return;
    
    onProgress?.(`Downloading: ${asset.url}`);

    try {
      // For external assets, use CORS proxy
      const isExternal = !asset.url.startsWith(this.baseDomain);
      const fetchUrl = isExternal ? 
        `https://api.allorigins.win/raw?url=${encodeURIComponent(asset.url)}` : 
        asset.url;

      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download ${asset.url}: ${response.status}`);
      }

      const blob = await response.blob();
      const content = await blob.arrayBuffer();
      
      this.downloadedAssets.set(relativePath, {
        content: content,
        size: blob.size,
        type: asset.type
      });
      
      this.totalSize += blob.size;
      
    } catch (error) {
      console.warn(`Failed to download ${asset.url}:`, error);
      // Create placeholder for failed assets
      const placeholder = `/* Failed to load asset: ${asset.url} */`;
      const placeholderSize = new Blob([placeholder]).size;
      this.downloadedAssets.set(relativePath, {
        content: placeholder,
        size: placeholderSize,
        type: 'text/plain'
      });
      this.totalSize += placeholderSize;
    }
  }

  /**
   * Create fallback page for failed crawls
   * @param {string} url - Original URL
   * @returns {string} - Fallback HTML
   */
  createFallbackPage(url) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Viewer</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .header {
      background: #0284c7;
      color: white;
      padding: 1rem;
      text-align: center;
    }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    iframe {
      border: none;
      width: 100%;
      height: 80vh;
      margin-top: 1rem;
    }
    .loading {
      font-size: 1.2rem;
      margin: 2rem 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Website Viewer</h1>
  </div>
  <div class="content">
    <div class="loading">Loading website content...</div>
    <iframe src="${url}" onload="document.querySelector('.loading').style.display = 'none'"></iframe>
  </div>
</body>
</html>`;
  }

  /**
   * Resolve relative URLs to absolute URLs
   * @param {string} url - URL to resolve
   * @param {string} baseUrl - Base URL for resolution
   * @returns {string} - Resolved URL
   */
  resolveUrl(url, baseUrl) {
    try {
      return new URL(url, baseUrl).href;
    } catch (error) {
      return url;
    }
  }

  /**
   * Get relative path for storing assets
   * @param {string} url - Full URL
   * @returns {string} - Relative path
   */
  getRelativePath(url) {
    try {
      const urlObj = new URL(url);
      let path = urlObj.pathname;
      
      // If path ends with /, add index.html
      if (path.endsWith('/')) {
        path += 'index.html';
      }
      
      // If path has no extension, add .html
      if (!path.includes('.') || path.split('/').pop().indexOf('.') === -1) {
        path += '.html';
      }
      
      return path.startsWith('/') ? path.substring(1) : path;
    } catch (error) {
      return 'index.html';
    }
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default WebsiteCrawler;
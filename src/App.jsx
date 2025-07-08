import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import ConversionForm from './components/ConversionForm';
import ConversionProgress from './components/ConversionProgress';
import DownloadSection from './components/DownloadSection';
import Features from './components/Features';
import Footer from './components/Footer';
import { generateZipFile, generateApkFile } from './services/fileGenerator';
import WebsiteCrawler from './services/websiteCrawler';
import './App.css';

function App() {
  const [conversionState, setConversionState] = useState({
    isConverting: false,
    progress: 0,
    currentStep: '',
    isComplete: false,
    downloadLinks: null,
    websiteData: null
  });

  const handleConversion = async (formData) => {
    setConversionState(prev => ({
      ...prev,
      isConverting: true,
      progress: 0,
      currentStep: 'Initializing conversion...',
      isComplete: false,
      websiteData: null
    }));

    try {
      // Progress tracking
      let currentProgress = 0;
      const updateProgress = (step, progress) => {
        setConversionState(prev => ({
          ...prev,
          currentStep: step,
          progress: Math.min(progress, 100)
        }));
      };

      // Step 1: Analyze website (10%)
      updateProgress('Analyzing website structure...', 10);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Crawl and download website content (60%)
      updateProgress('Crawling website and downloading content...', 15);
      
      const zipData = await generateZipFile(formData, (step) => {
        updateProgress(step, Math.min(currentProgress + 45, 60));
      });
      
      currentProgress = 60;
      updateProgress('Website content downloaded successfully', 60);

      // Step 3: Generate APK configuration (20%)
      updateProgress('Generating Android APK configuration...', 70);
      const apkBlob = await generateApkFile(formData, {
        totalSize: zipData.totalSize,
        pages: zipData.pages,
        assets: zipData.assets
      });
      currentProgress = 80;

      // Step 4: Finalize packages (20%)
      updateProgress('Finalizing packages...', 90);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clean up app name for filenames
      const safeAppName = formData.appName.replace(/\s+/g, '_');
      
      // Create download links with real data
      const downloadLinks = {
        apk: {
          blob: apkBlob,
          filename: `${safeAppName}.apk`,
          size: WebsiteCrawler.formatFileSize(apkBlob.size)
        },
        zip: {
          blob: zipData.blob,
          filename: `${safeAppName}_website.zip`,
          size: WebsiteCrawler.formatFileSize(zipData.blob.size)
        }
      };

      // Store website data for display
      const websiteData = {
        totalSize: zipData.totalSize,
        pages: zipData.pages,
        assets: zipData.assets,
        originalUrl: formData.websiteUrl
      };

      updateProgress('Conversion completed successfully!', 100);
      
      // Complete the conversion
      setConversionState(prev => ({
        ...prev,
        isConverting: false,
        isComplete: true,
        downloadLinks,
        websiteData
      }));

    } catch (error) {
      console.error('Conversion failed:', error);
      setConversionState(prev => ({
        ...prev,
        isConverting: false,
        currentStep: `Conversion failed: ${error.message}`,
        progress: 0
      }));
    }
  };

  const resetConversion = () => {
    setConversionState({
      isConverting: false,
      progress: 0,
      currentStep: '',
      isComplete: false,
      downloadLinks: null,
      websiteData: null
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {!conversionState.isConverting && !conversionState.isComplete && (
            <>
              <ConversionForm onConvert={handleConversion} />
              <Features />
            </>
          )}

          {conversionState.isConverting && (
            <ConversionProgress 
              progress={conversionState.progress}
              currentStep={conversionState.currentStep}
            />
          )}

          {conversionState.isComplete && (
            <DownloadSection 
              downloadLinks={conversionState.downloadLinks}
              websiteData={conversionState.websiteData}
              onReset={resetConversion}
            />
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
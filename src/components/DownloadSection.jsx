import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { saveAs } from 'file-saver';
import WebsiteCrawler from '../services/websiteCrawler';

const { FiDownload, FiSmartphone, FiPackage, FiCheck, FiRefreshCw, FiGlobe, FiFile, FiImage } = FiIcons;

const DownloadSection = ({ downloadLinks, websiteData, onReset }) => {
  const handleDownload = (linkData) => {
    if (linkData.blob) {
      saveAs(linkData.blob, linkData.filename);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
        >
          <SafeIcon icon={FiCheck} className="text-3xl text-green-600" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Conversion Complete!
        </h2>
        <p className="text-gray-600">
          Your website has been successfully converted and all content downloaded.
        </p>
      </div>

      {/* Website Statistics */}
      {websiteData && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2 mx-auto">
                <SafeIcon icon={FiGlobe} className="text-blue-600" />
              </div>
              <div className="text-sm text-gray-600">Total Size</div>
              <div className="font-semibold text-gray-900">
                {WebsiteCrawler.formatFileSize(websiteData.totalSize)}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-2 mx-auto">
                <SafeIcon icon={FiFile} className="text-green-600" />
              </div>
              <div className="text-sm text-gray-600">Pages</div>
              <div className="font-semibold text-gray-900">{websiteData.pages}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-2 mx-auto">
                <SafeIcon icon={FiImage} className="text-purple-600" />
              </div>
              <div className="text-sm text-gray-600">Assets</div>
              <div className="font-semibold text-gray-900">{websiteData.assets}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mb-2 mx-auto">
                <SafeIcon icon={FiPackage} className="text-orange-600" />
              </div>
              <div className="text-sm text-gray-600">Source</div>
              <div className="font-semibold text-gray-900 text-xs truncate">
                {new URL(websiteData.originalUrl).hostname}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* APK Download */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiSmartphone} className="text-2xl text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Android APK Config</h3>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Filename:</span>
              <span className="font-medium text-gray-900">{downloadLinks.apk.filename}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Size:</span>
              <span className="font-medium text-gray-900">{downloadLinks.apk.size}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium text-gray-900">APK Configuration</span>
            </div>
          </div>
          
          <button
            onClick={() => handleDownload(downloadLinks.apk)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
          >
            <SafeIcon icon={FiDownload} className="text-lg" />
            Download APK Config
          </button>
        </motion.div>

        {/* ZIP Download */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiPackage} className="text-2xl text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Complete Website</h3>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Filename:</span>
              <span className="font-medium text-gray-900">{downloadLinks.zip.filename}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Size:</span>
              <span className="font-medium text-gray-900">{downloadLinks.zip.size}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium text-gray-900">Website Archive</span>
            </div>
          </div>
          
          <button
            onClick={() => handleDownload(downloadLinks.zip)}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
          >
            <SafeIcon icon={FiDownload} className="text-lg" />
            Download Website ZIP
          </button>
        </motion.div>
      </div>

      {/* Installation Instructions */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Installation Instructions</h4>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">APK Configuration:</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Contains build configuration for Android APK</li>
              <li>• Use with Cordova/PhoneGap build tools</li>
              <li>• Includes all necessary app settings</li>
              <li>• Follow the build instructions in the file</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Website Archive:</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Extract the ZIP file to any location</li>
              <li>• Open index.html in a web browser</li>
              <li>• Upload to web server for online access</li>
              <li>• Includes offline support and PWA features</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          <SafeIcon icon={FiRefreshCw} className="text-lg" />
          Convert Another Website
        </button>
      </div>
    </motion.div>
  );
};

export default DownloadSection;
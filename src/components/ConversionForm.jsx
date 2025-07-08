import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiGlobe, FiSmartphone, FiPackage, FiSettings, FiPlay } = FiIcons;

const ConversionForm = ({ onConvert }) => {
  const [formData, setFormData] = useState({
    websiteUrl: '',
    appName: 'Web to App',
    packageName: 'com.webtoapp.converter',
    includeAllPages: true,
    outputFormats: ['apk', 'zip']
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = 'Website URL is required';
    } else if (!isValidUrl(formData.websiteUrl)) {
      newErrors.websiteUrl = 'Please enter a valid URL';
    }

    if (!formData.appName.trim()) {
      newErrors.appName = 'App name is required';
    }

    if (formData.outputFormats.length === 0) {
      newErrors.outputFormats = 'Select at least one output format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onConvert(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFormatChange = (format) => {
    setFormData(prev => ({
      ...prev,
      outputFormats: prev.outputFormats.includes(format)
        ? prev.outputFormats.filter(f => f !== format)
        : [...prev.outputFormats, format]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg p-8 mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <SafeIcon icon={FiSettings} className="text-2xl text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">Conversion Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Website URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiGlobe} className="inline mr-2" />
            Website URL
          </label>
          <input
            type="url"
            value={formData.websiteUrl}
            onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
            placeholder="https://example.com"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              errors.websiteUrl ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.websiteUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.websiteUrl}</p>
          )}
        </div>

        {/* App Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiSmartphone} className="inline mr-2" />
            App Name
          </label>
          <input
            type="text"
            value={formData.appName}
            onChange={(e) => handleInputChange('appName', e.target.value)}
            placeholder="My Web App"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              errors.appName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.appName && (
            <p className="mt-1 text-sm text-red-600">{errors.appName}</p>
          )}
        </div>

        {/* Package Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiPackage} className="inline mr-2" />
            Package Name (for APK)
          </label>
          <input
            type="text"
            value={formData.packageName}
            onChange={(e) => handleInputChange('packageName', e.target.value)}
            placeholder="com.example.app"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
          <p className="mt-1 text-sm text-gray-500">
            Used as the unique identifier for your Android app
          </p>
        </div>

        {/* Output Formats */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Output Formats
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.outputFormats.includes('apk')}
                onChange={() => handleFormatChange('apk')}
                className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div>
                <div className="font-medium text-gray-900">Android APK</div>
                <div className="text-sm text-gray-500">Install directly on Android devices</div>
              </div>
            </label>
            
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.outputFormats.includes('zip')}
                onChange={() => handleFormatChange('zip')}
                className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div>
                <div className="font-medium text-gray-900">ZIP Archive</div>
                <div className="text-sm text-gray-500">Complete website files</div>
              </div>
            </label>
          </div>
          {errors.outputFormats && (
            <p className="mt-1 text-sm text-red-600">{errors.outputFormats}</p>
          )}
        </div>

        {/* Include All Pages */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.includeAllPages}
              onChange={(e) => handleInputChange('includeAllPages', e.target.checked)}
              className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Include all pages from the website
            </span>
          </label>
          <p className="mt-1 ml-7 text-sm text-gray-500">
            Crawl and include all linked pages from the website
          </p>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <SafeIcon icon={FiPlay} className="text-lg" />
          Start Conversion
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ConversionForm;
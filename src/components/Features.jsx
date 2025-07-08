import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiZap, FiShield, FiSmartphone, FiGlobe, FiDownload, FiSettings } = FiIcons;

const Features = () => {
  const features = [
    {
      icon: FiZap,
      title: 'Fast Conversion',
      description: 'Convert websites to apps in minutes with our optimized processing engine'
    },
    {
      icon: FiShield,
      title: 'Secure Processing',
      description: 'Your data is processed securely and never stored on our servers'
    },
    {
      icon: FiSmartphone,
      title: 'Mobile Optimized',
      description: 'Generated apps are optimized for mobile devices with responsive layouts'
    },
    {
      icon: FiGlobe,
      title: 'Full Website',
      description: 'Crawl and include all pages from your website automatically'
    },
    {
      icon: FiDownload,
      title: 'Multiple Formats',
      description: 'Get both Android APK and ZIP archive formats for maximum compatibility'
    },
    {
      icon: FiSettings,
      title: 'Customizable',
      description: 'Configure app name, package name, and other settings to match your needs'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Choose Our Converter?</h2>
        <p className="text-gray-600">
          Powerful features to transform your website into a professional mobile app
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
              <SafeIcon icon={feature.icon} className="text-2xl text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Features;
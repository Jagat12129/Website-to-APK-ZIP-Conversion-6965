import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSmartphone, FiGlobe, FiZap } = FiIcons;

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <SafeIcon 
                icon={FiGlobe} 
                className="text-4xl text-primary-600"
              />
              <SafeIcon 
                icon={FiSmartphone} 
                className="text-2xl text-primary-500 absolute -bottom-1 -right-1"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Web to App Converter
            </h1>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform any website into a mobile app and downloadable archive. 
            Generate both Android APK and ZIP files with just a few clicks.
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-primary-600">
              <SafeIcon icon={FiZap} className="text-lg" />
              <span className="text-sm font-medium">Fast Conversion</span>
            </div>
            <div className="flex items-center gap-2 text-primary-600">
              <SafeIcon icon={FiSmartphone} className="text-lg" />
              <span className="text-sm font-medium">Mobile Ready</span>
            </div>
            <div className="flex items-center gap-2 text-primary-600">
              <SafeIcon icon={FiGlobe} className="text-lg" />
              <span className="text-sm font-medium">Full Website</span>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
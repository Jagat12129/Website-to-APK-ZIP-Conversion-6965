import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiLoader, FiCheck } = FiIcons;

const ConversionProgress = ({ progress, currentStep }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg p-8 text-center"
    >
      <div className="mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          <SafeIcon icon={FiLoader} className="text-6xl text-primary-600" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          Converting Your Website
        </h2>
        <p className="text-gray-600">
          Please wait while we process your website and create the app packages
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-primary-600">{progress}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-center gap-2 text-gray-700">
          <SafeIcon icon={FiLoader} className="text-sm animate-spin" />
          <span className="text-sm font-medium">{currentStep}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <SafeIcon icon={FiCheck} className="text-green-500" />
          <span>Website Analysis</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <SafeIcon icon={progress > 30 ? FiCheck : FiLoader} className={progress > 30 ? "text-green-500" : "text-gray-400"} />
          <span>Content Download</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <SafeIcon icon={progress > 60 ? FiCheck : FiLoader} className={progress > 60 ? "text-green-500" : "text-gray-400"} />
          <span>APK Generation</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <SafeIcon icon={progress > 80 ? FiCheck : FiLoader} className={progress > 80 ? "text-green-500" : "text-gray-400"} />
          <span>ZIP Creation</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversionProgress;
import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeart, FiGithub, FiMail, FiGlobe } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Web to App Converter</h3>
            <p className="text-gray-600 text-sm">
              Transform any website into a mobile app with our powerful conversion tool. 
              Fast, secure, and easy to use.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Android APK Generation</li>
              <li>• ZIP Archive Creation</li>
              <li>• Full Website Crawling</li>
              <li>• Mobile Optimization</li>
              <li>• Custom App Settings</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Support</h4>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                <SafeIcon icon={FiMail} className="text-sm" />
                Contact Support
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                <SafeIcon icon={FiGithub} className="text-sm" />
                View on GitHub
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                <SafeIcon icon={FiGlobe} className="text-sm" />
                Documentation
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
            Made with <SafeIcon icon={FiHeart} className="text-red-500" /> for developers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
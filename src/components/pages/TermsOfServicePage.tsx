import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <div className="flex items-center mb-8">
        <Shield className="w-8 h-8 text-primary-600 mr-3" />
        <h1 className="text-3xl font-serif font-semibold text-gray-800">Terms of Service</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600">
            Last updated: April 1, 2025
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-6">
            Welcome to DocAnalytics. By accessing or using our service, you agree to be bound by these terms. Please read them carefully.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2. Definitions</h2>
          <p className="text-gray-600 mb-6">
            "Service" refers to the DocAnalytics platform, including all features, functionalities, and user interfaces.
            "User" refers to any individual or entity that accesses or uses the Service.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">3. Account Terms</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li className="mb-2">You must be 18 years or older to use this Service.</li>
            <li className="mb-2">You must provide accurate and complete registration information.</li>
            <li className="mb-2">You are responsible for maintaining the security of your account.</li>
            <li className="mb-2">You are responsible for all activities that occur under your account.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4. Acceptable Use</h2>
          <p className="text-gray-600 mb-6">
            You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Service.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">5. Data Privacy</h2>
          <p className="text-gray-600 mb-6">
            Our privacy practices are governed by our Privacy Policy, which is incorporated into these Terms by reference.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">6. Intellectual Property</h2>
          <p className="text-gray-600 mb-6">
            The Service and its original content, features, and functionality are owned by DocAnalytics and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">7. Termination</h2>
          <p className="text-gray-600 mb-6">
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">8. Changes to Terms</h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on the Service.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">9. Contact Information</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about these Terms, please contact us at legal@docanalytics.com.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsOfServicePage;
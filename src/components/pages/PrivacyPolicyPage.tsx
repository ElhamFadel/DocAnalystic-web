import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <div className="flex items-center mb-8">
        <Lock className="w-8 h-8 text-primary-600 mr-3" />
        <h1 className="text-3xl font-serif font-semibold text-gray-800">Privacy Policy</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600">
            Last updated: April 1, 2025
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-6">
            At DocAnalytics, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2. Information We Collect</h2>
          <h3 className="text-lg font-medium text-gray-800 mb-3">2.1 Personal Information</h3>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li className="mb-2">Name and contact information</li>
            <li className="mb-2">Account credentials</li>
            <li className="mb-2">Payment information</li>
            <li className="mb-2">Usage data and preferences</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mb-3">2.2 Document Information</h3>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li className="mb-2">Document content and metadata</li>
            <li className="mb-2">Classification and analysis results</li>
            <li className="mb-2">Usage patterns and statistics</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-600 mb-6">
            We use the collected information for various purposes:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li className="mb-2">To provide and maintain our service</li>
            <li className="mb-2">To notify you about changes to our service</li>
            <li className="mb-2">To provide customer support</li>
            <li className="mb-2">To gather analysis or valuable information</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4. Data Security</h2>
          <p className="text-gray-600 mb-6">
            We implement appropriate technical and organizational security measures to protect your personal information, including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li className="mb-2">Encryption of data in transit and at rest</li>
            <li className="mb-2">Regular security assessments</li>
            <li className="mb-2">Access controls and authentication</li>
            <li className="mb-2">Employee training on data protection</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">5. Data Sharing and Disclosure</h2>
          <p className="text-gray-600 mb-6">
            We may share your information with third parties only in the ways described in this privacy policy:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li className="mb-2">With your consent</li>
            <li className="mb-2">For legal requirements</li>
            <li className="mb-2">With service providers</li>
            <li className="mb-2">In case of a business transaction</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">6. Your Rights</h2>
          <p className="text-gray-600 mb-6">
            You have certain rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li className="mb-2">Right to access your data</li>
            <li className="mb-2">Right to correct inaccurate data</li>
            <li className="mb-2">Right to delete your data</li>
            <li className="mb-2">Right to object to processing</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">7. Changes to This Policy</h2>
          <p className="text-gray-600 mb-6">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">8. Contact Us</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about this Privacy Policy, please contact us at privacy@docanalytics.com.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicyPage;
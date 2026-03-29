import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 font-serif">Privacy & Security</h1>
          <p className="text-gray-500 mt-2">Your trust is our priority. Learn how we protect your data.</p>
        </div>

        <div className="space-y-8">
          {/* Security Standards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center font-serif">
              <Lock className="mr-3 h-6 w-6 text-primary" />
              Security Standards
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                <h3 className="font-bold text-primary mb-2">Global Data Protection</h3>
                <p className="text-sm text-primary/80 leading-relaxed">
                  We adhere to global data protection guidelines (like GDPR and HIPAA) to ensure your health information is handled with the highest level of confidentiality.
                </p>
              </div>
              <div className="p-6 bg-accent/5 rounded-2xl border border-accent/10">
                <h3 className="font-bold text-accent mb-2">ISO 27799</h3>
                <p className="text-sm text-accent leading-relaxed">
                  Our platform follows ISO 27799 standards for health informatics security management.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Data Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center font-serif">
              <Eye className="mr-3 h-6 w-6 text-primary" />
              How We Use Your Data
            </h2>
            <div className="space-y-4">
              {[
                { title: "Personalization", desc: "We use your onboarding info to tailor the AI's personality and responses." },
                { title: "Sentiment Analysis", desc: "AI analyzes your messages to detect emotional trends and potential crises." },
                { title: "Anonymization", desc: "Data used for platform analytics is strictly anonymized and aggregated." },
                { title: "No Third-Party Sharing", desc: "We never sell or share your personal data with advertisers or third parties." }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4 p-4 hover:bg-primary/5 rounded-2xl transition-colors">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-red-50 p-8 rounded-3xl border border-red-100"
          >
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <AlertCircle className="h-6 w-6" />
              <h2 className="text-xl font-bold">Important Disclaimer</h2>
            </div>
            <p className="text-red-700 leading-relaxed">
              MindCare AI is an AI-powered support tool and **does not replace professional medical advice, diagnosis, or treatment**. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </motion.div>

          <div className="text-center text-gray-400 text-sm">
            <p>Last updated: March 25, 2026</p>
            <p className="mt-2">MindCare AI Security Team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;

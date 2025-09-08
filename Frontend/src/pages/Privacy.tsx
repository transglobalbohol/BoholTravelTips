import React from 'react';
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <div className="flex items-center mb-4">
                <UserCheck className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We collect information you provide directly to us when you create an account, make a booking, 
                contact us, or otherwise interact with our services. This may include your name, email address, 
                phone number, payment information, and travel preferences.
              </p>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Eye className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We use your information to provide, maintain, and improve our services, process transactions, 
                send you confirmations and updates, communicate with you about our services, and comply with 
                legal requirements.
              </p>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Lock className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Information Security</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                over the internet is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a 
                  href="mailto:reservations@transglobaltravelandtours.com" 
                  className="text-blue-600 hover:underline"
                >
                  reservations@transglobaltravelandtours.com
                </a>
              </p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Last updated:</strong> September 8, 2025
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
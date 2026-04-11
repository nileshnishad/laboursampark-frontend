import SEOHead from "@/app/components/SEOHead";

export default function PrivacyPolicy() {
  return (
    <>
      <SEOHead
        section="privacy"
        title="Privacy Policy - LabourSampark"
        description="Our privacy policy explains how LabourSampark collects, uses, and protects your personal information."
        keywords={["privacy policy", "data protection", "personal information"]}
        ogUrl="https://laboursampark.com/privacy-policy"
      />
      <div className="pt-24 md:pt-32 pb-16 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-white mb-8">Privacy Policy</h1>
          
          <div className="prose dark:prose-invert max-w-full">
            <div className="text-gray-700 dark:text-gray-300 space-y-6">
              
              <section>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mt-8 mb-4">1. Introduction</h2>
                <p>
                  Welcome to LabourSampark ("we," "us," "our," or "Company"). We are committed to protecting your privacy 
                  and ensuring you have a positive experience on our website and mobile application (collectively, the "Platform"). 
                  This Privacy Policy explains how we collect, use, disclose, and otherwise handle your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mt-8 mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-6 mb-3">2.1 Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Registration Information:</strong> Name, email address, phone number, address, profession, experience, skills, and other profile details</li>
                  <li><strong>Authentication:</strong> Passwords, security questions, OTP codes for two-factor authentication</li>
                  <li><strong>Payment Information:</strong> Payment method details (processed securely through payment gateways)</li>
                  <li><strong>Communication:</strong> Messages, inquiries, feedback, and support tickets</li>
                  <li><strong>Profile Content:</strong> Photos, certifications, documents, work history, and portfolio items</li>
                  <li><strong>Verification Documents:</strong> Aadhar number (encrypted), government IDs, licenses</li>
                </ul>

                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-6 mb-3">2.2 Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Device Information:</strong> Device type, operating system, browser type, IP address, unique device identifiers</li>
                  <li><strong>Usage Data:</strong> Pages visited, search queries, time spent on pages, click-through rates, referring URL</li>
                  <li><strong>Location Data:</strong> Approximate location based on IP address (if you enable location services)</li>
                  <li><strong>Cookies & Tracking:</strong> Session cookies, preference cookies, analytics tracking</li>
                </ul>

                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-6 mb-3">2.3 Third-Party Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Information from social media when you connect your account</li>
                  <li>Data from background check providers (with your consent)</li>
                  <li>Payment processor information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mt-8 mb-4">3. How We Use Your Information</h2>
                <p>We use collected information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Creating and managing your account</li>
                  <li>Verifying your identity and background (for safety)</li>
                  <li>Matching labourers with contractors and vice versa</li>
                  <li>Processing payments and transactions</li>
                  <li>Sending notifications, updates, and promotional content</li>
                  <li>Improving our Platform and user experience</li>
                  <li>Preventing fraud, abuse, and security incidents</li>
                  <li>Complying with legal obligations</li>
                  <li>Responding to your inquiries and customer support</li>
                  <li>Conducting analytics and market research</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mt-8 mb-4">4. Sharing Your Information</h2>
                
                <p>We may share your information in the following situations:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>With Other Users:</strong> Your profile information is visible to matching users (labourers/contractors)</li>
                  <li><strong>Service Providers:</strong> Payment processors, cloud storage, analytics providers, email services</li>
                  <li><strong>Legal Requirements:</strong> Law enforcement, government agencies when required by law</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                  <li><strong>With Your Consent:</strong> Any other sharing when you explicitly permit</li>
                </ul>
                <p className="mt-3 text-red-600 dark:text-red-400 font-semibold">We do NOT sell your personal data to third parties for marketing purposes.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mt-8 mb-4">5. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your personal information, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>SSL/TLS encryption for data in transit</li>
                  <li>AES-256 encryption for sensitive data at rest</li>
                  <li>Secure password hashing algorithms</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure API endpoints</li>
                </ul>
                <p className="mt-3 text-yellow-600 dark:text-yellow-400">
                  Note: No method of transmission over the internet is 100% secure. While we use industry-standard protections, 
                  we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mt-8 mb-4">6. Your Rights and Choices</h2>
                
                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-6 mb-3">6.1 Access & Portability</h3>
                <p>You have the right to request and receive a copy of your personal data in a structured, commonly used format.</p>

                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-6 mb-3">6.2 Correction & Update</h3>
                <p>You can update or correct your profile information anytime through your account settings.</p>

                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-6 mb-3">6.3 Deletion</h3>
                <p>You can request deletion of your account and associated data. Some data may be retained for legal compliance.</p>

                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-6 mb-3">6.4 Opt-Out</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Unsubscribe from marketing emails using the link in any email</li>
                  <li>Disable cookies through your browser settings</li>
                  <li>Adjust notification preferences in your account settings</li>
                </ul>

                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-6 mb-3">6.5 Do Not Track</h3>
                <p>Our Platform does not currently respond to "Do Not Track" signals, but you can disable cookies in your browser.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mt-8 mb-4">7. Retained Information</h2>
                <p>
                  We retain personal data as long as necessary to provide services and comply with legal obligations. 
                  Specifically:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Account Data:</strong> Retained during account lifetime; deleted after account deletion (with exceptions)</li>
                  <li><strong>Transaction Data:</strong> Retained for 7 years for tax and compliance purposes</li>
                  <li><strong>Communication Records:</strong> Retained for dispute resolution purposes</li>
                  <li><strong>Cookies:</strong> Session cookies deleted after session; preference cookies retained per your settings</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mt-8 mb-4">8. Third-Party Links</h2>
                <p>
                  Our Platform may contain links to third-party websites and services that are not operated by LabourSampark. 
                  This Privacy Policy does not apply to third-party platforms, and we are not responsible for their privacy practices. 
                  Please review their privacy policies before providing any information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mt-8 mb-4">9. Children's Privacy</h2>
                <p>
                  Our Platform is not intended for children under 18 years of age. We do not knowingly collect personal information 
                  from children. If we become aware that a child has provided us with information, we will take steps to delete such 
                  information and terminate the child's account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mt-8 mb-4">10. International Data Transfers</h2>
                <p>
                  Your information may be transferred to, stored in, and processed in countries other than India. 
                  By using LabourSampark, you consent to such transfers and processing under this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mt-8 mb-4">11. Updates to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy periodically to reflect changes in our practices, technology, or laws. 
                  We will notify you of material changes by posting the updated policy on our Platform and updating the "Last Updated" date. 
                  Your continued use constitutes acceptance of updates.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mt-8 mb-4">12. Contact Us</h2>
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-blue-900 dark:text-white">LabourSampark Privacy Team</p>
                  <p className="text-gray-700 dark:text-gray-300">Email: privacy@laboursampark.com</p>
                  <p className="text-gray-700 dark:text-gray-300">Phone: +91 9172272305</p>
                </div>
              </section>

              <section className="text-center mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated: March 2026</p>
              </section>

            </div>
          </div>
        </div>
    </>
  );
}

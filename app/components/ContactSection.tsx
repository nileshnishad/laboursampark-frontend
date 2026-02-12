"use client";
import { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-20 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-blue-900 dark:text-white">Get In Touch</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      {/* Contact Content */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Contact Info Cards */}
        {[
          {
            icon: "📍",
            title: "Address",
            content: "123 Labour Street, New Delhi, India 110001"
          },
          {
            icon: "📞",
            title: "Phone",
            content: "+91 (800) 123-4567"
          },
          {
            icon: "✉️",
            title: "Email",
            content: "support@laboursampark.com"
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition text-center">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{item.content}</p>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <h3 className="text-2xl font-bold text-blue-900 dark:text-white mb-6">Send us a Message</h3>
          {submitted && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg border border-green-400">
              ✓ Thank you! Your message has been sent successfully.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="feedback">Feedback & Suggestions</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                rows={5}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-600 transition shadow-lg hover:shadow-xl"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div>
          <h3 className="text-2xl font-bold text-blue-900 dark:text-white mb-6">Why Contact Us?</h3>
          <div className="space-y-4">
            {[
              {
                title: "Support",
                desc: "Need help with your account or have technical issues? We're here to assist."
              },
              {
                title: "Partnerships",
                desc: "Interested in collaborating with LabourSampark? Let's explore opportunities together."
              },
              {
                title: "Feedback",
                desc: "Your feedback helps us improve. Share your suggestions and ideas with us."
              },
              {
                title: "Inquiries",
                desc: "Any questions about our services? Get answers directly from our team."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-600">
                <h4 className="font-bold text-gray-800 dark:text-white mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Response Time */}
          <div className="mt-8 bg-linear-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
            <h4 className="font-bold text-gray-800 dark:text-white mb-2">⏱️ Response Time</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">We typically respond to all inquiries within <strong>24 hours</strong>. For urgent matters, please call us directly.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

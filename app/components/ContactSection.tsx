"use client";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitInquiry, resetInquiryState } from "@/store/slices/inquirySlice";
import { showSuccessToast, showErrorToast, showWarningToast } from "@/lib/toast-utils";
import type { AppDispatch, RootState } from "@/store/store";

export default function ContactSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, error } = useSelector(
    (state: RootState) => state.inquiry
  );
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Validation functions
  const validateMobile = (mobile: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(mobile);
  };

  const validateMessage = (message: string): boolean => {
    return message.trim().length >= 50;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Phone number: only allow digits and max 10 characters
    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: phoneValue }));
      
      // Clear error when user corrects the field
      if (phoneValue.length === 10) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.phone;
          return newErrors;
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear field-specific errors as user types
      if (validationErrors[name]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (formData.phone && !validateMobile(formData.phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.subject) {
      errors.subject = "Please select a subject";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (!validateMessage(formData.message)) {
      errors.message = `Message must be at least 50 characters (currently ${formData.message.trim().length})`;
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Show first error as toast
      const firstError = Object.values(errors)[0];
      showErrorToast(firstError);
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setValidationErrors({});
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!validateForm()) {
      return;
    }

    // Prepare data for API
    const inquiryData = {
      fullName: formData.name,
      email: formData.email,
      mobile: formData.phone || "",
      subject: formData.subject,
      message: formData.message,
    };

    // Submit inquiry
    const result = await dispatch(submitInquiry(inquiryData));

    // Check if submission was successful
    if (submitInquiry.fulfilled.match(result)) {
      showSuccessToast("Thank you! Your inquiry has been submitted successfully. We'll get back to you soon.");
      resetForm();

      // Clear success message after 5 seconds
      setTimeout(() => {
        dispatch(resetInquiryState());
      }, 5000);
    }
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
            content: "laboursampark@gmail.com"
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

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                  validationErrors.name
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
              )}
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
                className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                  validationErrors.email
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number (10 digits)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                maxLength={10}
                className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                  validationErrors.phone
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {validationErrors.phone ? (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
              ) : formData.phone && (
                <p className="text-gray-500 text-sm mt-1">{formData.phone.length}/10 digits</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                  validationErrors.subject
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="feedback">Feedback & Suggestions</option>
                <option value="other">Other</option>
              </select>
              {validationErrors.subject && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message (minimum 50 characters)</label>
                <span className={`text-sm font-medium ${
                  formData.message.trim().length >= 50
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}>
                  {formData.message.trim().length}/50
                </span>
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind... (at least 50 characters)"
                className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none ${
                  validationErrors.message
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                rows={5}
                required
              />
              {validationErrors.message && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 rounded-lg font-bold transition shadow-lg ${
                loading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 hover:shadow-xl"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Submitting...
                </span>
              ) : (
                "Send Message"
              )}
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

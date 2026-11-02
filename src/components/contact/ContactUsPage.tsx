import React, { useState } from 'react';
import {
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Share2,
  ArrowUpRight,
  X
} from 'lucide-react';
import { Button } from '../common/Button';
import { submitContactInquiryToSupabase } from '../../services/inquiriesService';

interface ContactUsPageProps {
  onBackToHome?: () => void;
  onOpenExplore?: () => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({
  onBackToHome
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMsg('Please enter your message or question.');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContactInquiryToSupabase({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category: 'General Inquiry',
        message: formData.message
      });

      // Show instant glass modal feedback
      setIsSubmitting(false);
      setShowSuccessModal(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (err) {
      console.error('Submission failed:', err);
      setIsSubmitting(false);
      setErrorMsg('Failed to submit message. Please try again or email us directly.');
    }
  };

  return (
    <div className="w-full bg-sand min-h-screen pt-28 pb-20 text-espresso-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-espresso-600">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                onBackToHome?.();
              }}
              className="hover:text-copper-600 cursor-pointer transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-copper-700">Contact Us</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-champagne-500/50 text-xs font-semibold text-espresso-800 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-copper-600" />
            <span>Average Response Time: &lt; 4 Hours</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-copper-500/10 border border-copper-500/30 text-copper-800 text-xs font-bold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Direct Investor & Institutional Desk
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-espresso-950 tracking-tight leading-tight mb-4">
            Connect with <span className="text-copper-600">WelNex</span>
          </h1>
          <p className="text-sm sm:text-base text-espresso-700 leading-relaxed max-w-2xl mx-auto">
            Have questions about alternative asset discovery, SEBI regulatory frameworks, or asset disclosures? Our institutional team is here to assist you.
          </p>
        </div>

        {/* Main Grid: Form (Left) & Direct Support / Socials (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Clean Glassmorphism Inquiry Form */}
          <div className="lg:col-span-7 bg-white/75 backdrop-blur-md border border-champagne-500/50 rounded-3xl p-6 sm:p-8 shadow-glass-md">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-champagne-500/30">
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-espresso-950">
                  Send an Inquiry
                </h2>
                <p className="text-xs text-espresso-600 mt-0.5">
                  Your message is directly logged into our Admin CMS for priority response.
                </p>
              </div>
              <ShieldCheck className="w-6 h-6 text-copper-600 opacity-80" />
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-900 mb-1.5">
                  Full Name <span className="text-copper-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singhania"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-champagne-500/60 text-espresso-950 text-sm focus:outline-none focus:ring-2 focus:ring-copper-500/30 focus:border-copper-500 transition-all placeholder:text-espresso-400"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso-900 mb-1.5">
                    Email Address <span className="text-copper-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-champagne-500/60 text-espresso-950 text-sm focus:outline-none focus:ring-2 focus:ring-copper-500/30 focus:border-copper-500 transition-all placeholder:text-espresso-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso-900 mb-1.5">
                    Phone Number <span className="text-espresso-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98200 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-champagne-500/60 text-espresso-950 text-sm focus:outline-none focus:ring-2 focus:ring-copper-500/30 focus:border-copper-500 transition-all placeholder:text-espresso-400"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-900 mb-1.5">
                  Message <span className="text-copper-600">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="How can our research and alternative asset analytics team help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-champagne-500/60 text-espresso-950 text-sm focus:outline-none focus:ring-2 focus:ring-copper-500/30 focus:border-copper-500 transition-all placeholder:text-espresso-400 resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  icon={<Send className="w-4 h-4" />}
                  iconPosition="right"
                  className="w-full shadow-md text-sm font-bold uppercase tracking-wider py-3.5 cursor-pointer"
                >
                  {isSubmitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}
                </Button>
                <p className="text-[11px] text-center text-espresso-500 mt-3">
                  All messages are strictly confidential. WelNex never shares investor details with third parties.
                </p>
              </div>

            </form>
          </div>

          {/* RIGHT: Direct Support Contact Info & Official Socials */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Email Card */}
            <div className="bg-white/75 backdrop-blur-md border border-champagne-500/50 rounded-3xl p-6 sm:p-7 shadow-glass-sm space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-copper-500/15 border border-copper-500/30 flex items-center justify-center text-copper-700 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-espresso-500 block">
                    Direct Official Inquiries
                  </span>
                  <a
                    href="mailto:connect.welnex@gmail.com"
                    className="text-base font-bold text-copper-700 hover:text-copper-800 transition-colors"
                  >
                    connect.welnex@gmail.com
                  </a>
                </div>
              </div>
              <p className="text-xs text-espresso-700 leading-relaxed pt-1">
                For institutional partnerships, press briefings, or general investor queries, write directly to our desk.
              </p>
            </div>

            {/* Official Social Links Card */}
            <div className="bg-white/75 backdrop-blur-md border border-champagne-500/50 rounded-3xl p-6 sm:p-7 shadow-glass-sm space-y-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-copper-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-espresso-950">
                  Official Channels & Socials
                </h3>
              </div>
              <p className="text-xs text-espresso-700 leading-relaxed">
                Follow WelNex for regular market updates, alternative investment insights, and community announcements.
              </p>
              
              <div className="space-y-3 pt-1">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/_welnex_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-champagne-500/40 hover:border-copper-500/60 shadow-xs transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-copper-500/10 text-copper-600 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-espresso-950 block">Instagram</span>
                      <span className="text-[11px] text-copper-700 block font-mono">@_welnex_</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-espresso-400 group-hover:text-copper-600 transition-colors" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/welnex-alt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-champagne-500/40 hover:border-copper-500/60 shadow-xs transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-copper-500/10 text-copper-600 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                        <rect width="4" height="12" x="2" y="9"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-espresso-950 block">LinkedIn</span>
                      <span className="text-[11px] text-copper-700 block font-mono">welnex-alt</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-espresso-400 group-hover:text-copper-600 transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Response SLA Card */}
            <div className="p-6 rounded-3xl bg-[#FAF5EE] border border-champagne-500/50 shadow-glass-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-espresso-900">
                <Clock className="w-4 h-4 text-copper-600" />
                <span>Dedicated Response SLA</span>
              </div>
              <p className="text-xs text-espresso-700 leading-relaxed">
                All inquiries submitted through this form are logged directly into the WelNex Admin Inquiries portal and assigned to our research desk within <strong>4 business hours</strong>.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* INSTANT GLASS CONFIRMATION MODAL FEEDBACK */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-[#FAF5EE]/95 border border-champagne-500/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center animate-scaleUp">
            
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-espresso-500 hover:text-espresso-900 hover:bg-copper-500/10 transition-colors cursor-pointer"
              aria-label="Close confirmation"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="font-display text-2xl font-extrabold text-espresso-950 mb-2">
              Inquiry Received!
            </h3>
            
            <p className="text-sm text-espresso-800 leading-relaxed mb-6 font-medium">
              Thank you for reaching out to WelNex. Our team will contact you shortly.
            </p>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-champagne-500/40 mb-6 text-xs text-espresso-600 text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-espresso-900">Desk Status:</span>
                <span className="text-emerald-700 font-bold">Online & Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-espresso-900">SLA:</span>
                <span>Within 4 business hours</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 text-xs uppercase font-bold cursor-pointer"
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setShowSuccessModal(false);
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  onBackToHome?.();
                }}
                className="flex-1 text-xs uppercase font-bold cursor-pointer"
              >
                Go to Home
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

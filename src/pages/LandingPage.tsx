import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Brain, Heart, Shield, MessageCircle, ArrowRight, Star, Users, CheckCircle } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-primary uppercase bg-primary/10 rounded-full">
                Empowering Mental Wellness
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight font-serif">
                Your Safe Space to <br />
                <span className="text-primary">Express & Heal</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                MindCare AI is a personal AI psychologist designed for everyone. Speak your heart out without fear of judgment.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/awareness"
                  className="px-8 py-4 bg-white text-primary border-2 border-primary/10 rounded-2xl font-bold text-lg hover:bg-primary/5 transition-all flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* SDG 3 Focus Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">
                Aligned with UN SDG 3: <br />
                <span className="text-accent">Good Health & Well-being</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We are committed to promoting mental health and well-being for all, providing a safe space for every person worldwide.
              </p>
              <ul className="space-y-4">
                {[
                  "Reducing stigma around mental health",
                  "Providing 24/7 accessible support",
                  "Early detection of emotional distress",
                  "Empowering every individual"
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://picsum.photos/seed/mentalhealth/800/600"
                alt="Mental Wellness"
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-primary/5 max-w-xs">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-900">98% Satisfaction</span>
                </div>
                <p className="text-sm text-gray-500">Users feel more heard and understood after using MindCare AI.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 font-serif">Why Choose MindCare AI?</h2>
            <p className="text-gray-600 mt-4">Innovative features designed for your mental peace.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "AI Chatbot", desc: "Empathetic conversations with Arjun or Siya, tailored to you.", icon: MessageCircle, color: "primary" },
              { title: "Mood Tracking", desc: "Visualize your emotional journey with smart analytics.", icon: Heart, color: "accent" },
              { title: "Crisis Detection", desc: "Real-time monitoring for distress with immediate escalation.", icon: Shield, color: "accent" },
              { title: "Privacy First", desc: "Your data is encrypted and secure. Anonymous mode available.", icon: Shield, color: "primary" },
              { title: "Professional Help", desc: "Connect with verified therapists when you need more.", icon: Users, color: "primary" },
              { title: "Smart Insights", desc: "AI-driven analysis of your mood patterns and progress.", icon: Brain, color: "accent" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-6`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold font-serif">MindCare AI</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Empowering People to overcome silence and embrace wellness through AI-driven empathy.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white">Help Directory</Link></li>
                <li><Link to="/awareness" className="hover:text-white">Awareness</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-gray-400">support@mindcare.ai</p>
              <p className="text-gray-400">Emergency: 108 / 911</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2026 MindCare AI. All rights reserved. Aligned with UN SDG 3.</p>
            <p className="mt-2 text-xs">Disclaimer: AI does not replace professional medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

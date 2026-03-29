import React from 'react';
import { motion } from 'motion/react';
import { Brain, Heart, Shield, MessageCircle, Star, Users, CheckCircle, Info, Lightbulb, HelpCircle, Plus } from 'lucide-react';

const AwarenessPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 font-serif"
          >
            Mental Health Matters
          </motion.h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Understanding mental health is the first step towards healing. Let's break the stigma together.
          </p>
        </div>
      </section>

      {/* Common Issues */}
      <section id="challenges" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Common Challenges We All Face</h2>
            <p className="text-gray-500 mt-4">You're not alone. Millions of people worldwide navigate these feelings every day.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Performance Pressure", desc: "Whether it's academic competition or workplace demands, the drive to succeed can lead to severe stress and burnout.", icon: Brain, color: "primary" },
              { title: "Relationship Strain", desc: "Balancing personal goals with the expectations of family and partners can create significant emotional strain.", icon: Users, color: "accent" },
              { title: "Life Transitions", desc: "Persistent worry about career changes, aging, or social standing in a rapidly changing world.", icon: Shield, color: "accent" }
            ].map((issue, i) => (
              <div key={i} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className={`w-12 h-12 rounded-2xl bg-${issue.color}/10 flex items-center justify-center mb-6`}>
                  <issue.icon className={`h-6 w-6 text-${issue.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">{issue.title}</h3>
                <p className="text-gray-600 leading-relaxed">{issue.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section id="self-care" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] p-12 shadow-xl overflow-hidden relative border border-gray-100">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 flex items-center font-serif">
                <Lightbulb className="mr-3 h-8 w-8 text-accent" />
                Self-Care Strategies
              </h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  {[
                    "Practice mindfulness and meditation daily.",
                    "Maintain a consistent sleep schedule.",
                    "Engage in regular physical activity.",
                    "Set healthy boundaries with social media."
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-gray-700 font-medium">{tip}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-background p-8 rounded-3xl border border-primary/10">
                  <h4 className="font-bold text-primary mb-4 flex items-center">
                    <Info className="mr-2 h-5 w-5" />
                    Did you know?
                  </h4>
                  <p className="text-gray-700 leading-relaxed italic">
                    "Talking about your feelings isn't a sign of weakness; it's a sign of strength. It shows you're taking control of your well-being."
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 opacity-50"></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center flex items-center justify-center">
            <HelpCircle className="mr-3 h-8 w-8 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              { q: "Is it normal to feel overwhelmed?", a: "Absolutely. Life transitions, whether personal, academic, or professional, are challenging. Recognizing these feelings is the first step." },
              { q: "How can MindCare AI help me?", a: "MindCare AI provides a safe, non-judgmental space to express your thoughts, analyze your mood, and detect early signs of distress." },
              { q: "When should I seek professional help?", a: "If your feelings interfere with daily life, last for more than two weeks, or if you have thoughts of self-harm, please reach out to a professional immediately." }
            ].map((faq, i) => (
              <details key={i} className="group bg-gray-50 rounded-2xl p-6 cursor-pointer border border-gray-100">
                <summary className="font-bold text-gray-900 list-none flex justify-between items-center">
                  {faq.q}
                  <Plus className="h-5 w-5 text-blue-600 group-open:rotate-45 transition-transform" />
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AwarenessPage;

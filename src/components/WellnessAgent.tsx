import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, X, Brain, Heart, Zap, BookOpen, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WellnessAgentProps {
  moodAvg: number;
  lastMood: number | null;
}

const WellnessAgent: React.FC<WellnessAgentProps> = ({ moodAvg, lastMood }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState<{
    title: string;
    description: string;
    icon: any;
    action: string;
    path?: string;
    type: 'navigation' | 'action' | 'meditation';
  } | null>(null);

  useEffect(() => {
    // Proactively show suggestion after a short delay
    const timer = setTimeout(() => {
      generateSuggestion();
      setIsVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [moodAvg, lastMood]);

  const generateSuggestion = () => {
    // Logic for targeted interventions
    if (lastMood && lastMood <= 2) {
      // Very low mood - immediate intervention
      setSuggestion({
        title: "Need a moment of calm?",
        description: "I've noticed you're feeling quite low. A 2-minute guided breathing exercise can help lower your cortisol levels right now.",
        icon: Wind,
        action: "Breathe Now",
        type: 'meditation'
      });
    } else if (moodAvg < 3) {
      // Sustained low mood - educational resources
      setSuggestion({
        title: "Understanding your feelings",
        description: "Your mood trend has been a bit low lately. Learning about academic pressure and self-care might help you navigate this.",
        icon: BookOpen,
        action: "Read Awareness Guide",
        path: "/awareness#challenges",
        type: 'navigation'
      });
    } else if (moodAvg >= 3 && moodAvg <= 4) {
      // Neutral/Stable - proactive wellness
      setSuggestion({
        title: "Boost your focus",
        description: "You're doing okay! A quick 5-minute mindfulness session could help sharpen your focus for your next study session.",
        icon: Brain,
        action: "Try Mindfulness",
        type: 'meditation'
      });
    } else if (moodAvg > 4) {
      // Positive - reinforcement
      setSuggestion({
        title: "Keep the momentum!",
        description: "You're in a great headspace. Why not check out some advanced self-care strategies to maintain this positive energy?",
        icon: Heart,
        action: "View Strategies",
        path: "/awareness#self-care",
        type: 'navigation'
      });
    } else {
      setSuggestion({
        title: "Wellness Check-in",
        description: "Consistency is key! A quick 5-minute walk can boost your focus for the rest of the day.",
        icon: Zap,
        action: "Set Reminder",
        type: 'action'
      });
    }
  };

  const handleAction = () => {
    if (suggestion?.type === 'navigation' && suggestion.path) {
      navigate(suggestion.path);
      setIsVisible(false);
    } else if (suggestion?.type === 'meditation') {
      setIsBreathing(true);
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible || !suggestion) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50 max-w-sm w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
          <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-bold">Wellness Assistant</span>
            </div>
            <button 
              onClick={() => {
                setIsVisible(false);
                setIsBreathing(false);
              }}
              className="p-1 hover:bg-blue-500 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-6">
            {!isBreathing ? (
              <>
                <div className="flex items-start space-x-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <suggestion.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{suggestion.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={handleAction}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center group"
                >
                  {suggestion.action}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <motion.div
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center"
                >
                  <div className="w-16 h-16 bg-blue-400 rounded-full opacity-50"></div>
                </motion.div>
                <h4 className="font-bold text-gray-900 mb-2">Breathe In... Breathe Out...</h4>
                <p className="text-sm text-gray-500 mb-6">Focus on your breath. Let everything else fade away.</p>
                <button 
                  onClick={() => setIsBreathing(false)}
                  className="text-blue-600 font-bold text-sm hover:underline"
                >
                  Finish Session
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WellnessAgent;

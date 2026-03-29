import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { User, Calendar, Users, Brain, ArrowRight } from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [personalityType, setPersonalityType] = useState('');
  const { token, updateUser, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ age: parseInt(age), gender, personalityType }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        updateUser(updatedUser);
        navigate('/chat');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 font-serif">Welcome, {user?.name}!</h2>
          <p className="text-gray-500 mt-2">Let's personalize your experience to better support you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center font-serif">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Your Age
              </label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 25"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center font-serif">
                <Users className="h-4 w-4 mr-2 text-primary" />
                Gender
              </label>
              <select
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary / Other">Non-binary / Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700 flex items-center font-serif">
              <User className="h-4 w-4 mr-2 text-primary" />
              Personality Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Introvert', 'Extrovert', 'Ambivert'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPersonalityType(type)}
                  className={`p-4 rounded-2xl border-2 transition-all text-center font-bold ${
                    personalityType === type
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-primary/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center group shadow-lg shadow-primary/10"
          >
            Complete Profile
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
